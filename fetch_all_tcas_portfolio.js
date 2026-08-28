const fs = require('fs');
const path = require('path');

// Helper sleep function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function extractGPAX(criteria) {
    if (!criteria) return null;
    const text = criteria.replace(/\s+/g, ' ').toLowerCase();
    
    // Pattern 1: gpax ไม่ต่ำกว่า 3.00
    const match1 = text.match(/gpax[^\d]*?ไม่ต่ำกว่า[^\d]*?(\d\.\d{2})/);
    if (match1) return parseFloat(match1[1]);
    
    // Pattern 2: gpax >= 3.00
    const match2 = text.match(/gpax\s*?[>=]{1,2}\s*?(\d\.\d{2})/);
    if (match2) return parseFloat(match2[1]);

    // Pattern 3: gpax ... 3.00
    const match3 = text.match(/gpax[^\d]*?(\d\.\d{2})/);
    if (match3) return parseFloat(match3[1]);
    
    // Pattern 4: เกรดเฉลี่ยสะสม... 3.00
    const match4 = text.match(/เฉลี่ยสะสม[^\d]*?(\d\.\d{2})/);
    if (match4) return parseFloat(match4[1]);
    
    // Pattern 5: เกรดเฉลี่ย... 3.00
    const match5 = text.match(/เกรดเฉลี่ย[^\d]*?(\d\.\d{2})/);
    if (match5) return parseFloat(match5[1]);

    // Pattern 6: ไม่ต่ำกว่า 3.00
    const match6 = text.match(/ไม่ต่ำกว่า[^\d]*?(\d\.\d{2})/);
    if (match6) return parseFloat(match6[1]);

    return null;
}

function extractFlags(combinedText) {
    const text = combinedText.toLowerCase();
    
    const requiresSciMath = text.includes('วิทยาศาสตร์-คณิตศาสตร์') || 
                            text.includes('วิทย์-คณิต') || 
                            text.includes('วิทยาศาสตร์ และ คณิตศาสตร์') || 
                            text.includes('วิทย์คณิต') ||
                            text.includes('คณิตศาสตร์-วิทยาศาสตร์') ||
                            text.includes('วิทยาศาสตร์และคณิตศาสตร์') ||
                            text.includes('แผนการเรียนวิทยาศาสตร์');
                            
    const noLimitText = text.includes('ไม่จำกัดแผน') || 
                        text.includes('ไม่กำหนดแผน') || 
                        text.includes('ทุกแผนการเรียน') || 
                        text.includes('ทุกกลุ่มสาระ');
                        
    const reqEnglish = text.includes('ielts') || text.includes('toefl') || text.includes('toeic');
    const reqAptitude = text.includes('tgat') || text.includes('tpat');
    const reqALevel = text.includes('a-level') || text.includes('alevel') || text.includes('วิชาสามัญ');

    return {
        requires_sci_math: requiresSciMath,
        no_limit_text: noLimitText,
        req_english: reqEnglish,
        req_aptitude: reqAptitude,
        req_alevel: reqALevel
    };
}


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
                
                // Filter active rounds (type starts with "1_", "2_", "3_", "4_")
                // CRITICAL FIX: Filter rounds by major_id exactly to eliminate duplicate listings across majors
                const validRounds = rounds.filter(r => {
                    if (!r.type) return false;
                    const startsWithRound = /^[1234]_/.test(r.type);
                    if (!startsWithRound) return false;
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
                
                // Clean and correct KMUTNB Mechanical 5-year teacher education degree name (which actually grants ค.อ.บ.)
                if (course.university_id === "015" && fullProgramName.includes("วศ.บ.วิศวกรรมเครื่องกลและการศึกษา (หลักสูตร 5 ปี)")) {
                    fullProgramName = fullProgramName.replace("วศ.บ.วิศวกรรมเครื่องกลและการศึกษา (หลักสูตร 5 ปี)", "ค.อ.บ. วิศวกรรมเครื่องกลและการศึกษา (หลักสูตร 5 ปี)");
                }
                
                if (validRounds.length > 0) {
                    for (const round of validRounds) {
                        const roundNum = parseInt(round.type.charAt(0)) || 1;
                        const critText = (round.folio && round.folio.criteria) ? round.folio.criteria.replace(/\r?\n/g, ' ') : '';
                        const condText = round.condition ? round.condition.replace(/\r?\n/g, ' ') : '';
                        const minGpa = extractGPAX(critText + ' ' + condText);
                        
                        const combinedInfo = (cleanUniversityName + ' ' + faculty_name_th + ' ' + fullProgramName + ' ' + (round.project_name_th || '') + ' ' + condText + ' ' + critText).toLowerCase();
                        const flags = extractFlags(combinedInfo);

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
                            criteria: critText,
                            link: round.link || '',
                            only_formal: round.only_formal || 2,
                            only_international: round.only_international || 2,
                            only_vocational: round.only_vocational || 2,
                            only_non_formal: round.only_non_formal || 2,
                            only_ged: round.only_ged || 2,
                            condition: condText,
                            grad_current: round.grad_current !== undefined ? round.grad_current : false,
                            major_id: course.major_id || '',
                            major_name: course.major_name_th || '',
                            field_name: course.field_name_th || '',
                            round: roundNum,
                            min_gpax: minGpa,
                            requires_sci_math: flags.requires_sci_math,
                            no_limit_text: flags.no_limit_text,
                            req_english: flags.req_english,
                            req_aptitude: flags.req_aptitude,
                            req_alevel: flags.req_alevel,
                            closed_date: (round.folio && round.folio.closed_date) ? round.folio.closed_date : ''
                        });
                    }
                } else {
                    // Log program with no active rounds
                    results.push({
                        university_id: course.university_id,
                        university_name: cleanUniversityName,
                        faculty_id: course.faculty_id,
                        faculty_name: faculty_name_th,
                        program_id: program_id,
                        program_name: fullProgramName,
                        project_id: 'N/A',
                        project_name: 'ไม่มีข้อมูลโครงการ',
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
                        field_name: course.field_name_th || '',
                        round: 1,
                        min_gpax: null,
                        requires_sci_math: false,
                        no_limit_text: false,
                        req_english: false,
                        req_aptitude: false,
                        req_alevel: false,
                        closed_date: ''
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
    
    // Compare with Git HEAD to populate seats_diff
    console.log("Comparing with Git HEAD to calculate seats_diff...");
    let oldMap = new Map();
    try {
        const cp = require('child_process');
        const rawOld = cp.execSync(`git show HEAD:tcas_portfolio_admission_details.json`, { cwd: baseDir, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
        const oldData = JSON.parse(rawOld);
        for (const r of oldData) {
            const key = `${r.program_id}_${r.project_id}`;
            oldMap.set(key, r.seats || 0);
        }
    } catch (e) {
        console.log("Could not load old database from HEAD. Setting seats_diff to 0.");
    }

    for (const r of results) {
        const key = `${r.program_id}_${r.project_id}`;
        if (oldMap.has(key)) {
            r.seats_diff = r.seats - oldMap.get(key);
        } else {
            r.seats_diff = 0;
        }
    }

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
        'Admission Conditions', 'Major ID', 'Major Name', 'Field Name', 'Round'
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
            `"${r.field_name.replace(/"/g, '""')}"`,
            r.round || 1
        ];
        csvRows.push(row.join(','));
    }
    
    fs.writeFileSync(outCsvPath, csvRows.join('\n'), 'utf8');
    console.log(`Saved CSV output to: ${outCsvPath}`);

    // Automatic Database Splitting into data_chunks
    console.log("Automatically splitting database into chunks...");
    const destDir = path.join(baseDir, 'data_chunks');
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const groups = {};
    results.forEach(item => {
        const uniId = item.university_id;
        if (!groups[uniId]) {
            groups[uniId] = [];
        }
        groups[uniId].push(item);
    });

    for (const [uniId, items] of Object.entries(groups)) {
        const uniPath = path.join(destDir, `uni_${uniId}.json`);
        fs.writeFileSync(uniPath, JSON.stringify(items), 'utf8');
    }

    const globalIndex = results.map(item => {
        const copy = { ...item };
        copy.has_criteria = !!item.criteria;
        copy.has_condition = !!item.condition;
        delete copy.criteria;
        delete copy.condition;
        return copy;
    });
    fs.writeFileSync(path.join(destDir, 'global_index.json'), JSON.stringify(globalIndex), 'utf8');
    console.log("Database chunks split successfully during scrape pipeline!");
}

main().catch(console.error);
