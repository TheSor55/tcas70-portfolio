const fs = require('fs');
const path = require('path');

// Helper sleep function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    console.log("=========================================");
    console.log("TCAS Portfolio Data Extractor Starting...");
    console.log("=========================================");
    
    // 1. Download universities.json and courses.json if not present
    const baseDir = __dirname;
    const universitiesPath = path.join(baseDir, 'universities.json');
    const coursesPath = path.join(baseDir, 'courses.json');
    
    if (!fs.existsSync(universitiesPath)) {
        console.log("Downloading universities.json...");
        const res = await fetch("https://my-tcas.s3.ap-southeast-1.amazonaws.com/mytcas/universities.json");
        const data = await res.json();
        fs.writeFileSync(universitiesPath, JSON.stringify(data, null, 2));
    }
    
    if (!fs.existsSync(coursesPath)) {
        console.log("Downloading courses.json...");
        const res = await fetch("https://my-tcas.s3.ap-southeast-1.amazonaws.com/mytcas/courses.json");
        const data = await res.json();
        fs.writeFileSync(coursesPath, JSON.stringify(data, null, 2));
    }
    
    // 2. Load courses
    const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
    console.log(`Loaded ${courses.length} programs/courses.`);
    
    const results = [];
    let processedCount = 0;
    const errors = [];
    
    // 3. Set concurrency limit (e.g. 10 simultaneous requests)
    const CONCURRENCY = 10;
    const queue = [...courses];
    
    // Helper function to fetch with retries
    async function fetchRoundsWithRetry(programId, retries = 3) {
        const url = `https://my-tcas.s3.ap-southeast-1.amazonaws.com/mytcas/rounds/${programId}.json`;
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    return await response.json();
                }
                if (response.status === 404) {
                    // Not found means no round details yet or not updated, which is fine
                    return [];
                }
                throw new Error(`HTTP Status ${response.status}`);
            } catch (e) {
                if (attempt === retries) throw e;
                await sleep(500 * attempt); // exponential backoff
            }
        }
    }
    
    // Worker function
    async function worker() {
        while (queue.length > 0) {
            const course = queue.shift();
            if (!course) break;
            
            const { program_id, university_name_th, faculty_name_th, program_name_th } = course;
            
            // Clean misspelled university names from central database
            let cleanUniversityName = university_name_th || "";
            if (cleanUniversityName === "มหาวิทยาลัยราคำแหง") {
                cleanUniversityName = "มหาวิทยาลัยรามคำแหง";
            }
            
            try {
                const rounds = await fetchRoundsWithRetry(program_id);
                
                // Filter Portfolio round (type starts with "1_")
                // CRITICAL FIX: Filter rounds by major_id exactly to eliminate duplicate listings across majors
                const portfolioRounds = rounds.filter(r => {
                    if (!r.type || !r.type.startsWith("1_")) return false;
                    const courseMajor = course.major_id || "";
                    const roundMajor = r.major_id || "";
                    return roundMajor === courseMajor;
                });
                
                // Build a descriptive program name including the major name if available,
                // or field name if it differs from the program name (e.g. Chula's General Engineering).
                let fullProgramName = program_name_th;
                if (course.major_name_th) {
                    fullProgramName += ` (${course.major_name_th})`;
                } else if (course.field_name_th && !program_name_th.includes(course.field_name_th)) {
                    fullProgramName += ` (${course.field_name_th})`;
                }
                
                if (portfolioRounds.length > 0) {
                    for (const round of portfolioRounds) {
                        results.push({
                            university_id: course.university_id,
                            university_name: cleanUniversityName,
                            faculty_id: course.faculty_id,
                            faculty_name: faculty_name_th,
                            program_id: program_id,
                            program_name: fullProgramName,
                            project_id: round.project_id || 'N/A',
                            project_name: round.project_name_th || 'โครงการทั่วไป / โครงการหลัก',
                            seats: round.receive_student_number || 0,
                            criteria: (round.folio && round.folio.criteria) ? round.folio.criteria.replace(/\r?\n/g, ' ') : '',
                            link: round.link || '',
                            only_formal: round.only_formal || 2,
                            only_international: round.only_international || 2,
                            only_vocational: round.only_vocational || 2,
                            only_non_formal: round.only_non_formal || 2,
                            only_ged: round.only_ged || 2,
                            condition: round.condition ? round.condition.replace(/\r?\n/g, ' ') : '',
                            grad_current: round.grad_current !== undefined ? round.grad_current : false,
                            major_id: course.major_id || '',
                            major_name: course.major_name_th || '',
                            field_name: course.field_name_th || ''
                        });
                    }
                } else {
                    // Log program with no portfolio rounds
                    results.push({
                        university_id: course.university_id,
                        university_name: cleanUniversityName,
                        faculty_id: course.faculty_id,
                        faculty_name: faculty_name_th,
                        program_id: program_id,
                        program_name: fullProgramName,
                        project_id: 'N/A',
                        project_name: 'ไม่มีข้อมูลรอบ Portfolio',
                        seats: 0,
                        criteria: '',
                        link: '',
                        only_formal: 2,
                        only_international: 2,
                        only_vocational: 2,
                        only_non_formal: 2,
                        only_ged: 2,
                        condition: '',
                        grad_current: false,
                        major_id: course.major_id || '',
                        major_name: course.major_name_th || '',
                        field_name: course.field_name_th || ''
                    });
                }
            } catch (error) {
                errors.push({ program_id, error: error.message });
            }
            
            processedCount++;
            if (processedCount % 100 === 0 || processedCount === courses.length) {
                console.log(`Progress: ${processedCount}/${courses.length} programs processed (${((processedCount/courses.length)*100).toFixed(1)}%) | Portfolio Records: ${results.length} | Errors: ${errors.length}`);
            }
            
            // Subtle delay to be a good citizen
            await sleep(50);
        }
    }
    
    // Spawn workers
    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
        workers.push(worker());
    }
    
    // Wait for all workers to finish
    await Promise.all(workers);
    
    console.log("\nExtracting completed!");
    console.log(`Successfully processed: ${processedCount - errors.length} programs.`);
    console.log(`Errors encountered: ${errors.length} programs.`);
    
    // Write JSON file
    const outJsonPath = path.join(baseDir, 'tcas_portfolio_admission_details.json');
    fs.writeFileSync(outJsonPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`Saved JSON output to: ${outJsonPath}`);
    
    // Write CSV file
    const outCsvPath = path.join(baseDir, 'tcas_portfolio_admission_details.csv');
    const headers = [
        'University ID', 'University Name', 'Faculty ID', 'Faculty Name', 
        'Program ID', 'Program/Major Name', 'Project ID', 'Project Name (Portfolio)', 
        'Seats Accepted', 'Criteria Details', 'URL',
        'Only Formal', 'Only International', 'Only Vocational', 'Only Non-Formal', 'Only GED',
        'Admission Conditions', 'Major ID', 'Major Name', 'Field Name'
    ];
    
    const csvRows = [headers.join(',')];
    for (const r of results) {
        const row = [
            `"${r.university_id}"`,
            `"${r.university_name.replace(/"/g, '""')}"`,
            `"${r.faculty_id}"`,
            `"${r.faculty_name.replace(/"/g, '""')}"`,
            `"${r.program_id}"`,
            `"${r.program_name.replace(/"/g, '""')}"`,
            `"${r.project_id}"`,
            `"${r.project_name.replace(/"/g, '""')}"`,
            r.seats,
            `"${r.criteria.replace(/"/g, '""')}"`,
            `"${r.link}"`,
            r.only_formal,
            r.only_international,
            r.only_vocational,
            r.only_non_formal,
            r.only_ged,
            `"${r.condition.replace(/"/g, '""')}"`,
            `"${r.major_id}"`,
            `"${r.major_name.replace(/"/g, '""')}"`,
            `"${r.field_name.replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
    }
    
    fs.writeFileSync(outCsvPath, csvRows.join('\n'), 'utf8');
    console.log(`Saved CSV output to: ${outCsvPath}`);
}

main().catch(console.error);
