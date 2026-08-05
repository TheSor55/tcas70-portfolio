# CHANGELOG - Safe UX/UI Improvements

## Document Info
* **Date & Time**: 2026-08-04 17:12:00 (Indochina Time / Asia/Bangkok)
* **Original Branch**: main
* **Original Baseline Commit**: `f7722b469c452a8c55f52cb7536d4e6af6fa328f`
* **Safety Branch**: `improvement/safe-ux-update`
* **Tracked Working Tree Status**: Clean
* **Untracked Files Status**: 19 files preserved and excluded from this phase

### Excluded Untracked Files List (19 files):
1. `analyze_data.js`
2. `check_active_unis.js`
3. `check_json.js`
4. `check_ku.js`
5. `check_other_rounds.js`
6. `check_universities_in_courses.js`
7. `courses.json`
8. `deploy_helper.bat`
9. `download_and_examine.js`
10. `fetch_rounds.js`
11. `probe_chunk.js`
12. `probe_mytcas.js`
13. `probe_mytcas.py`
14. `sample_portfolio_data.csv`
15. `sample_portfolio_data.json`
16. `sample_scraper.js`
17. `search_context.js`
18. `search_fetches.js`
19. `universities.json`

---

## Project Technology Stack
* **Architecture**: Single-Page App (SPA) built with Vanilla HTML5, CSS3, and JavaScript (ES6+). Static site hosting.
* **Libraries & Frameworks**:
  * None (No React, Vue, Angular, Vite, or active server-side backend).
  * **FontAwesome (v6.4.0)** (CDN) for icons.
  * **html2canvas (v1.4.1)** (CDN) for rendering shareable images.
* **Storage / Cache**:
  * LocalStorage: `tcas70_targets` (Bookmarks) and `tcas70_chat_history` (AI chat logs, limited to last 3 turns).
  * Static JSON chunks: `data_chunks/global_index.json` (~10.15 MB) and university-specific JSON files.

---

## Baseline Functional Test Results
* **Main Data Fetching**: Verified. `data_chunks/global_index.json` (~10.15 MB) fetches successfully on startup.
* **Interactive UI Search**: Verified. String query match on program name, faculty name, university name, major/field works.
* **Cascading Dropdowns**: Verified. University selection dynamically populates the Faculty dropdown.
* **Round Selection**: Verified. Toggling Round (1 Portfolio, 2 Quota, 3 Admission) updates the index filter.
* **Collapsible Details (Criteria/Conditions)**: Verified. Dynamically fetches split university-specific files (`data_chunks/uni_[id].json`).
* **Bookmarks / Targets Dashboard**: Verified. Saves targets to LocalStorage, retrieves them, and displays list in modal.
* **About Modal**: Verified. Modal content renders and toggles correctly.
* **AI Chatbot**: Verified. Correctly interacts with Gemini API and parses Markdown answers.

---

## Existing Errors (Baseline)
* **Console Errors**: 0 errors / 0 warnings on fresh load. (The deprecated `<meta name="apple-mobile-web-app-capable">` warning was fixed in the baseline commit).
* **Network Errors**: 0 network errors on load.
* **Note**: External deep links to PSU `admission.psu.ac.th/project/` which previously triggered infinite redirect loops are bypassed using a client-side safeguard to load PSU's root page instead.

---

## Files Planned for Future Modification
* `index.html` (UI labels, search placeholder, program card elements, searchable dropdown layout, active filter chips, disclaimer, dates display, source URL check, and about modal sections).

---

## Rollback Instructions
* **Restore index.html to stable baseline version**:
  ```bash
  git restore --source=f7722b469c452a8c55f52cb7536d4e6af6fa328f -- index.html
  ```
* **Discard safety branch and return to main**:
  ```bash
  git switch main
  git branch -D improvement/safe-ux-update
  ```

---

## PHASE 2 — UI Copy Adjustments (Applied: 2026-08-04 17:28:00)

### Changes Made:
1. **Heading Section Title**:
   * Old: `<h2 class="section-title">Featured Programs</h2>`
   * New: `<h2 class="section-title">ผลการค้นหาโครงการ</h2>`
2. **Search Input Placeholder**:
   * Old: `placeholder="Search universities, programs, or criteria..."`
   * New: `placeholder="ค้นหามหาวิทยาลัย คณะ สาขา โครงการ หรือคุณสมบัติ"`
3. **Search Hint**:
   * Added: `<div class="search-hint">ตัวอย่าง: วิศวกรรมคอมพิวเตอร์, เด็กซิ่ว, GPAX 3.00, Portfolio</div>`
4. **Faculty Dropdown Label (HTML & JS)**:
   * Old: `<option value="">เลือกคณะ (Faculties)</option>`
   * New: `<option value="">เลือกคณะ / วิทยาลัย / สำนักวิชา</option>`
5. **System Disclaimer (Footer)**:
   * Added: `<div class="system-disclaimer"><i class="fa-solid fa-circle-exclamation"></i><span>ข้อมูลในระบบเป็นข้อมูลสรุปเพื่อช่วยค้นหา ผู้สมัครควรตรวจสอบประกาศฉบับทางการของมหาวิทยาลัยก่อนสมัครทุกครั้ง</span></div>`

### CSS Added:
```css
        .search-hint {
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-top: -0.25rem;
            margin-bottom: 0.75rem;
            padding-left: 0.5rem;
            text-align: left;
        }
        .system-disclaimer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 0.85rem;
            color: var(--text-muted);
            background: rgba(255, 255, 255, 0.02);
            border: 1px dashed rgba(255, 255, 255, 0.08);
            border-radius: var(--radius-sm);
            padding: 0.75rem 1rem;
            margin: 1.5rem 0 1rem 0;
            text-align: center;
            line-height: 1.4;
        }
        .system-disclaimer i {
            color: var(--primary-light);
            font-size: 0.95rem;
        }
        @media (max-width: 768px) {
            .system-disclaimer {
                font-size: 0.75rem;
                padding: 0.6rem 0.85rem;
                flex-direction: column;
                text-align: center;
                gap: 4px;
            }
        }
```

### Phase 2 Test Results:
* **Functional Tests**: Passed. The UI text updates render beautifully. Search queries correctly fetch and filter results dynamically. Dropdowns behave identically. Favorite, Dashboard, About, and AI Chat functions continue to work flawlessly. No layout shifts or blocked buttons.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 2 specifically**:
  ```bash
  git revert <PHASE_2_COMMIT_HASH>
  ```

---

## PHASE 3A — seats-badge prominence reduction (Applied: 2026-08-04 17:53:00)

### Changes Made:
1. **seats-badge Styling in CSS**:
   * Removed full-width gradient container, heavy borders, shadow, and large font (`1rem`).
   * Replaced with a modern, compact inline-flex badge (`align-self: flex-start; width: auto;`).
   * Subtle transparent primary background (`rgba(99, 102, 241, 0.08)`), thin border (`1px solid rgba(99, 102, 241, 0.2)`), compact padding (`0.35rem 0.75rem`), and smaller font (`0.85rem`).
2. **seats-badge in HTML Template (renderCards)**:
   * Added `fa-user-group` FontAwesome icon.
   * Standardized text representation: `รับจำนวน <span class="seats-count">${item.seats}</span> คน` (preserving value insertion via `item.seats` and the `.seats-count` target class).

### CSS Added/Modified:
```css
        .seats-badge {
            align-self: flex-start;
            width: auto;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            background: rgba(99, 102, 241, 0.08);
            border: 1px solid rgba(99, 102, 241, 0.2);
            padding: 0.35rem 0.75rem;
            border-radius: 6px;
            font-weight: 600;
            color: var(--primary-light);
            font-size: 0.85rem;
            letter-spacing: 0.3px;
        }
        .seats-badge i {
            font-size: 0.8rem;
            opacity: 0.9;
        }
        .seats-count {
            font-weight: 700;
            color: #fff;
        }
```

### Phase 3A Test Results:
* **Functional Tests**: Passed. Correctly displays seat counts (e.g. 60, 200, 2) inside the new compact inline badge structure. Height of card is slightly reduced, improving the dashboard's information density. Filters, searches, bookmark system, modals, and chatbot operate securely without regressions.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 3A specifically**:
  ```bash
  git revert <PHASE_3A_COMMIT_HASH>
  ```

---

## PHASE 3B — Safe Data Status Mapping (Applied: 2026-08-04 17:58:00)

### Changes Made:
1. **Dynamic Requirement Status Classes (CSS)**:
   * Added explicit accessibility-safe colors and FontAwesome icon colors for requirements:
     * `.req-list li.status-required`: Emerald green (`#10b981`) for "ต้องใช้".
     * `.req-list li.status-not-used`: Rose red (`#f43f5e`) for "ไม่ใช้".
     * `.req-list li.status-warning`: Amber gold (`#fbbf24`) for "ใช้ GPAX แต่ไม่กำหนดเกณฑ์ขั้นต่ำ".
     * `.req-list li.status-unknown`: Muted slate (`#94a3b8`) for "ไม่พบข้อมูล".
2. **Display Mapping Functions (JS)**:
   * Created `getRequirementStatusHTML(label, rawValue, hasKeyword)` helper function to map boolean flags and keywords into structured HTML list items without mutating raw database properties.
   * Created `getGPAXStatusHTML(item, combinedText)` helper function to parse GPAX criteria and mapped it to the five target criteria statuses: "ต้องใช้ (GPAX ≥ score)", "ไม่กำหนด GPAX ขั้นต่ำ", "ใช้ GPAX แต่ไม่ระบุคะแนนขั้นต่ำ", "ไม่พบข้อมูล GPAX", and "ไม่พบข้อมูลที่ยืนยันได้" (as safe fallback).
3. **getRequirementsHTML Signature & Call Update**:
   * Updated `getRequirementsHTML` to accept `item` parameter.
   * Adjusted call structure inside `renderCards()`: `getRequirementsHTML(item.criteria, item.condition, item)`.

### Helper Functions Added:
```javascript
        // Display status formatter helper for generic requirements (Phase 3B)
        function getRequirementStatusHTML(label, rawValue, hasKeyword) {
            let statusText = "ไม่พบข้อมูล";
            let statusClass = "status-unknown";
            let iconClass = "fa-circle-question";
            
            if (rawValue === true) {
                statusText = "ต้องใช้";
                statusClass = "status-required";
                iconClass = "fa-circle-check";
            } else if (rawValue === false) {
                statusText = "ไม่ใช้";
                statusClass = "status-not-used";
                iconClass = "fa-circle-xmark";
            } else {
                if (hasKeyword) {
                    statusText = "ต้องใช้";
                    statusClass = "status-required";
                    iconClass = "fa-circle-check";
                } else {
                    statusText = "ไม่พบข้อมูล";
                    statusClass = "status-unknown";
                    iconClass = "fa-circle-question";
                }
            }
            return `<li class="${statusClass}"><i class="fa-solid ${iconClass}"></i> ${label}: <strong>${statusText}</strong></li>`;
        }

        // Display status formatter helper for GPAX requirements (Phase 3B)
        function getGPAXStatusHTML(item, combinedText) {
            const gpaVal = extractGPAX(combinedText);
            const dbGpa = item.min_gpax;
            
            if (dbGpa !== null && dbGpa !== undefined && dbGpa !== "") {
                return `<li class="status-required"><i class="fa-solid fa-circle-check"></i> GPAX: <strong>GPAX ≥ ${dbGpa}</strong> (ต้องใช้)</li>`;
            } else if (gpaVal) {
                return `<li class="status-required"><i class="fa-solid fa-circle-check"></i> GPAX: <strong>GPAX ≥ ${gpaVal}</strong> (ต้องใช้)</li>`;
            }
            
            const hasGpaKeywords = combinedText.includes('gpa') || combinedText.includes('เกรด') || combinedText.includes('เฉลี่ย');
            const explicitlyNoLimit = combinedText.includes('ไม่กำหนดเกรด') || combinedText.includes('ไม่กำหนด gpax') || combinedText.includes('ไม่จำกัดเกรด') || combinedText.includes('ไม่จำกัด gpax') || combinedText.includes('ไม่กำหนดคะแนนเฉลี่ย');
            
            if (explicitlyNoLimit) {
                return `<li class="status-not-used"><i class="fa-solid fa-circle-minus"></i> GPAX: <strong>ไม่กำหนด GPAX ขั้นต่ำ</strong></li>`;
            } else if (hasGpaKeywords) {
                return `<li class="status-warning"><i class="fa-solid fa-circle-exclamation"></i> GPAX: <strong>ใช้ GPAX แต่ไม่ระบุคะแนนขั้นต่ำ</strong></li>`;
            } else if (item.criteria === null || item.criteria === undefined || item.criteria === "") {
                return `<li class="status-unknown"><i class="fa-solid fa-circle-question"></i> GPAX: <strong>ไม่พบข้อมูล GPAX</strong></li>`;
            } else {
                return `<li class="status-unknown"><i class="fa-solid fa-circle-question"></i> GPAX: <strong>ไม่พบข้อมูลที่ยืนยันได้</strong></li>`;
            }
        }
```

### Phase 3B Test Results:
* **Functional & Visual Tests**: Passed. The requirements checklists render with clear, descriptive statuses and matching icons. No raw `null`, `undefined`, or `N/A` text leaked to UI. Card heights are clean and consistent. Filters, searches, and lazy details continue to operate normally.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 3B specifically**:
  ```bash
  git revert <PHASE_3B_COMMIT_HASH>
  ```

---

## PHASE 3C — Compact and Expandable Program Card (Applied: 2026-08-04 18:09:00)

### Changes Made:
1. **Simplified Main Card view (JS)**:
   * Updated `getRequirementsHTML()` to render **GPAX status only** in the main card checklist. This dramatically reduces card height and visual clutter on load.
2. **Prepend Secondary Requirements inside Collapsible Section**:
   * Updated `window.toggleCriteria` (specifically type `'cond'`) to dynamically prepend the secondary requirements checklist (IELTS/English, Portfolio, SAT/ACT, SOP) at the top of the details panel.
   * Utilizes database flags `match.req_english`, `match.req_aptitude`, and keyword matching on fetched criteria/condition text.
3. **Unconditional Accordion Rendering (HTML)**:
   * Modified the "Conditions" accordion rendering in `renderCards()` to output unconditionally for all cards, renamed to "เกณฑ์คุณสมบัติและเงื่อนไข (Requirements)", so users can always expand to see the secondary requirements checklist.

### Phase 3C Test Results:
* **Functional Tests**: Passed. Main card displays are compact. Expanding the accordion correctly fetches the university chunk, prepends the secondary checklist (IELTS, Portfolio, SAT/ACT, SOP) dynamically, and appends the detailed text. Expand/collapse, favorites, searches, and filters continue to work normally.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 3C specifically**:
  ```bash
  git revert <PHASE_3C_COMMIT_HASH>
  ```

---

## PHASE 3C.1 — Requirement Accordion UI Polish (Applied: 2026-08-04 18:14:00)

### Changes Made:
1. **Status Color Optimization (CSS)**:
   * Changed `.status-not-used` ("ไม่ใช้") from rose red (`#f43f5e`) to neutral slate gray (`#64748b`) to prevent users from mistaking it for a system error.
   * Changed `.status-unknown` ("ไม่พบข้อมูล") to a high-contrast light slate color (`#cbd5e1`) and increased opacity to `0.9` for improved readability in Dark Theme.
2. **Responsive Grid Layout inside Accordion (CSS)**:
   * Styled `.secondary-requirements-box .req-list` with CSS Grid: `display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;` for 2 columns on wide viewports (Desktop).
   * Styled `@media (max-width: 768px)` media query to stack items into 1 column (`grid-template-columns: 1fr;`) on mobile screens, wrapping text naturally.
   * Increased spacing between label and status: `.secondary-requirements-box .req-list li strong { margin-left: 0.25rem; }`.
3. **Class Refinement in window.toggleCriteria**:
   * Removed inline styles from the prepended requirements box HTML string inside `window.toggleCriteria()`. Replaced with semantic CSS classes: `.secondary-requirements-box` and `.secondary-requirements-title`.

### Phase 3C.1 Test Results:
* **Functional & Visual Tests**: Passed. The grid layout looks extremely clean and premium. The neutral Slate Gray color for "ไม่ใช้" does not suggest errors. The high-contrast slate color for "ไม่พบข้อมูล" is clearly readable in Dark Theme. Mobile wrapping matches viewport widths naturally.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 3C.1 specifically**:
  ```bash
  git revert <PHASE_3C1_COMMIT_HASH>
  ```

---

## PHASE 4 — Searchable Dropdowns (Applied: 2026-08-04 18:20:00)

### Changes Made:
1. **Search Inputs in Filters Row (HTML)**:
   * Added search inputs `#uniSearch` ("ค้นหาชื่อมหาวิทยาลัย") and `#facultySearch` ("ค้นหาชื่อคณะ/สำนักวิชา") above the respective selects.
   * Wrapped each filter group in a semantic `.select-search-wrapper` container.
2. **Search Input CSS (CSS)**:
   * Added styles for `.select-search-wrapper` (flex-direction: column) and `.select-search-input` (dark border, rounded corners, subtle transparent background, transitions) to match the dark theme and search bar aesthetics.
3. **Option Caching & Rebuild Layer (JS)**:
   * Created memory caches: `cachedUniStructure` (rebuilt in `populateFilters` to cache the grouped university names) and `cachedFacultyOptions` (rebuilt in `updateFacultyDropdown` to cache the faculty names).
   * Added `window.filterUniOptions()` and `window.filterFacultyOptions()` to rebuild `<option>` tags dynamically.
   * This rebuild approach ensures 100% cross-browser compatibility, specifically bypasses iOS Safari's bug which fails to hide options using `display: none`, and preserves current selections cleanly.
4. **Cascading Clearing Behavior (JS)**:
   * Added logic to clear `#facultySearch` input values when the university selection `#uniFilter` is changed, preventing cross-filter keyword mismatch.

### Phase 4 Test Results:
* **Functional Tests**: Passed. Typing in `#uniSearch` instantly filters the available universities within their respective groups (optgroups). Typing in `#facultySearch` instantly filters the available faculties. Selecting a university cascadingly resets the faculty search query. Logic, bookmark dashboard, chatbot, and details accordions remain fully functional without regressions.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 4 specifically**:
  ```bash
  git revert <PHASE_4_COMMIT_HASH>
  ```

---

## PHASE 5B — Minimal Cascading State Safety Patch (Applied: 2026-08-04 18:38:00)

### Changes Made:
1. **UI Feedback Helper Element (HTML & CSS)**:
   * Added a text element `<div id="facultyScopeHint" class="faculty-scope-hint"></div>` below the Faculty select tag container.
   * Styled `.faculty-scope-hint` in CSS with high-contrast text (`var(--primary-light)` / `#6366f1`) and size `0.78rem` to match the layout cleanly.
   * Added `updateFacultyScopeHint()` in JavaScript which uses `textContent` to safely show active university scope (or COTMES specific message) or hides itself if no university is selected.
2. **Cascading State Preservation Logic (JS)**:
   * Updated `updateFacultyDropdown()` to cache the previous faculty select value before rebuilding. It checks if the previous selection is still present in the updated `cachedFacultyOptions`. If valid, it preserves the selection; otherwise, it resets `facultyFilter.value = ''` and clears `facultySearch.value = ''`.
3. **Round Transition State Safety (JS)**:
   * Updated `populateFilters()` to check if the previous university selection remains valid inside the new round. If it is valid, it is preserved; if not, the university select value is reset to `""` and both `#uniSearch` and `#facultySearch` queries are safely cleared.
4. **Event Handler Optimization (JS)**:
   * Updated `uniFilter` change listener to delegate dropdown rebuilds and query clears directly to `updateFacultyDropdown()`, preventing redundant state resets and double-filtering triggers.

### Phase 5B Test Results:
* **Functional & Visual Tests**: Passed. Officially verified in browser with all 7 test cases succeeding:
  1. University-Faculty Cascading behaves correctly.
  2. Faculty value is reset dynamically only when it does not exist under the newly selected university.
  3. Clearing the university filter restores all faculties immediately.
  4. COTMES special group logic matches target medical faculties properly.
  5. Switching active rounds does not produce stale dropdown selections.
  6. Other filters (GPAX, Round, Study Plan, A-Level) remain fully preserved during cascading changes.
  7. Searchable dropdown keypress filtering and cleaning function securely.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 5B specifically**:
  ```bash
  git revert <PHASE_5_COMMIT_HASH>
  ```

---

## PHASE 6 — Active Filter Chips and Safe Reset Controls (Applied: 2026-08-04 19:00:00)

### Changes Made:
1. **Active Filters Summary Section (HTML & CSS)**:
   * Added `#activeFiltersSection` layout block beneath the collapsible personalized filter panel.
   * Styled CSS classes (`.active-filters-section`, `.active-filters-header`, `.active-filters-title`, `.active-filter-chips`, `.active-filter-chip`, `.active-filter-chip-label`, `.active-filter-chip-remove`, `.clear-all-filters-btn`) ensuring responsive wrapping, high-contrast readability in Dark Theme, clear button targets, focus visible states, and layout safety.
2. **State Synchronizer Pipeline (JS)**:
   * Created pure read function `getActiveFiltersFromUI()` mapping valid non-default filter settings (Search input, University selection, Faculty selection, GPAX query, Study Plan dropdown, English, Aptitude, and A-Level checklist flags) without editing state or firing events. COTMES selection is mapped cleanly to `'กลุ่ม กสพท.'`.
   * Created safe rendering function `renderActiveFilterChips()` rebuilding `<button>` elements with `textContent` protection to defend against XSS, showing or hiding the container dynamically.
3. **Safe Centralized Clear & Reset (JS)**:
   * Defined `clearSingleFilter(key)` to clear a target filter in the DOM and trigger the centralized filtering workflow.
   * Defined `clearAllOptionalFilters()` to reset all optional parameters while correctly keeping the selected round (`roundFilter`).
4. **Integration & Delegation (JS)**:
   * Injected `renderActiveFilterChips()` at the end of the centralized `filterData()` function to synchronize chips inside the single-pass filter pipeline without loops.
   * Attached delegation event listener on `#activeFilterChips` click to capture clicks on target filter keys, and bound `#clearAllFiltersBtn`.

### Phase 6 Test Results:
* **Functional & Visual Tests**: Passed. Officially verified in browser with all 12 test cases succeeding:
  1. Active Filter Section correctly hides when there are no active filters.
  2. Search Chip displays and can be deleted to reset the search input.
  3. University Chip displays the correct university name (or group translation).
  4. COTMES selection displays as "กลุ่ม กสพท.".
  5. Faculty Chip can be deleted while preserving the university selection.
  6. GPAX Chip displays correctly as "x.xx ขึ้นไป".
  7. Study Plan, English, TGAT/TPAT, and A-Level Chips display and reset correctly.
  8. Deleting the University Chip triggers cascading logic to reset invalid faculties.
  9. "ล้างตัวกรองทั้งหมด" resets all optional filters while keeping the active round selection.
  10. Responsive layout wraps chips cleanly on mobile viewports without horizontal scroll.
  11. Browser console does not record any errors during filter manipulation.
  12. Network tab shows no unexpected or extra HTTP requests.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 6 specifically**:
  ```bash
  git revert <PHASE_6_COMMIT_HASH>
  ```

---

## PHASE 7 — Safe Results Sorting Controls (Applied: 2026-08-04 19:15:00)

### Sort Audit Matrix:
* **filteredData**: Global variable declared using `let`.
* **renderCards()**: Reads directly from `filteredData` and slices using `filteredData.slice(0, displayLimit)`.
* **Stable Identifiers**: `university_id`, `faculty_id`, `program_id`, `project_id`. Unique key combines `${item.program_id}-${item.project_id}`.
* **Favorite State**: Uses stable `program_id` and `project_id` matching, independent of index values.
* **Accordion Details**: Iterates through display subset with `.forEach((item, index) => { ... })` and maps collapse tags and `toggleCriteria` calls to `crit-content-[type]-${index}` safely.

### Field Types & Null Handling:
* **seats**: Numeric type. Nulls / empty strings are treated as nullable and kept at the end of lists in both ascending and descending directions.
* **min_gpax**: Numeric type or null. Nulls/empty values are placed at the end.
* **university_name / program_name**: Thai String types. Checked using stable localeCompare and empty strings sent to the end.

### Sort Options:
1. `default`: Keeps original order from `filterData()` output.
2. `seats-desc`: Total seats descending.
3. `seats-asc`: Total seats ascending.
4. `gpax-asc`: Minimum GPAX requirement ascending.
5. `university-asc`: University name alphabetical ascending (Thai ก-ฮ).
6. `program-asc`: Program/major name alphabetical ascending (Thai ก-ฮ).

### Integration Point:
* Performs shallow clone copy `const sortedResults = getSortedResults(filteredData, sortMode);` inside `renderCards()` before applying the low-memory display limit slice, which preserves the original `filteredData` array completely intact.
* Re-triggers rendering safely by binding change listener on `#sortResults` select dropdown.

### Phase 7 Test Results:
* **Functional & Visual Tests**: Passed. Officially verified in browser with all 16 test cases succeeding:
  1. Default order matches original search/filter output.
  2. Seats Descending correctly sorts with nulls at the end.
  3. Seats Ascending correctly sorts with nulls at the end.
  4. GPAX Ascending sorts correctly without losing float precision and nulls at the end.
  5. University Thai sort matches dictionary order (ก-ฮ) without empty names first.
  6. Program name Thai sort correctly implements stable tie-breaker comparators.
  7. Sort applies correctly on filtered subsets after university/faculty filters.
  8. Sort works properly on active search results.
  9. Round toggles successfully preserve sorting preferences.
  10. Clear All Filters preserves selected sorting options.
  11. Active Filter Chips does not create chips for sorting parameters.
  12. Special medical group COTMES sorting functions correctly.
  13. Favorite button maps cleanly to target IDs, remaining on the correct card after sort.
  14. Accordion collapse containers and toggle buttons match index values perfectly.
  15. Details link and external URL targets point to the correct program.
  16. iOS slice display limits sorting of the complete array before slicing.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 7 specifically**:
  ```bash
  git revert <PHASE_7_COMMIT_HASH>
  ```

---

## PHASE 8 — Safe Progressive Results Loading (Applied: 2026-08-04 19:23:00)

### Existing Display Flow:
On initial load or when any filter or query changes, `filterData()` computes `filteredData`. At the end of `filterData()`, `renderCards()` is called.
Inside `renderCards()`, `sortedResults` is obtained from `getSortedResults(filteredData, sortMode)`.
It checks user-agent for iOS: `const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;`
Initial display limit is `20` on iOS and `150` on other devices.
It slices: `const toDisplay = sortedResults.slice(0, displayLimit);`
Then it iterates `toDisplay.forEach((item, index) => { ... })` and appends card elements to the DOM.
If `filteredData.length > displayLimit`, it appends a helper text ` (แสดงผลเฉพาะ ${displayLimit} รายการแรก กรุณาค้นหาแบบเจาะจงเพิ่มเติม)` to the `statsText` container.

### Progressive State Rules:
* **Initial Display Limit**: Desktop = 150, iOS = 20.
* **Display Batch Size**: Desktop = 100, iOS = 20.
* **Reset Visible Count Rules**: `currentVisibleCount` resets to initial limit whenever any query changes, active round updates, sorting changes, a single chip is removed, or "ล้างตัวกรองทั้งหมด" is clicked.
* **Persistence Safeguards**: Visible count state is kept purely in memory (view layer), and is not written to URL or LocalStorage.

### Slicing Integration:
* Sorted the complete array using `getSortedResults(filteredData, sortMode)` before slicing `currentVisibleCount` elements, ensuring that items shown after sorting represent the absolute highest/lowest values in the complete set.
* Replaced the hard-coded slice length warning in `statsText` with a dynamic progress bar underneath the card grid.
* Dynamically updates the text content of `#visibleResultsStatus` using safe `.textContent` to show progressive status (e.g. "แสดง 150 จาก 7,208 โครงการ" or "แสดงครบทั้งหมด 87 โครงการ" when fully loaded).

### Phase 8 Test Results:
* **Functional & Visual Tests**: Passed. Officially verified in browser with all 18 test cases succeeding:
  1. Desktop load correctly displays 150 initial items.
  2. iOS load correctly displays 20 initial items.
  3. Load More button successfully increments visible cards by batch size.
  4. Complete load safely hides Load More controls once all cards are displayed.
  5. Search query updates successfully reset visible count.
  6. University selections successfully reset visible count.
  7. Faculty selections successfully reset visible count.
  8. GPAX and Study Plan updates successfully reset visible count.
  9. Exam checklist switches successfully reset visible count.
  10. Sorting dropdown selections successfully reset visible count.
  11. Round transitions successfully reset visible count.
  12. Deleting single filter chips successfully resets visible count.
  13. Clear All filters button successfully resets visible count.
  14. Favorite states correctly map and persist on cards before/after loading more.
  15. Accordion contents load correctly and keep ID unique.
  16. External links match targeted indexes.
  17. Empty results hide load more section completely.
  18. Results size below initial limit hides load more button completely.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 8 specifically**:
  ```bash
  git revert <PHASE_8_COMMIT_HASH>
  ```

---

## PHASE 9 — Safe Shareable Search URL State (Applied: 2026-08-04 19:39:00)

### URL State Matrix:
| UI State | Element ID | URL Parameter | Value Type | Validate ด้วย |
|---|---|---|---|---|
| Search | searchInput | q | string | length / trim (limit to 200 chars) |
| Round | roundFilter | round | enum | option exists (values: 1, 2, 3, 4) |
| University | uniFilter | university | string | option exists (or special value COTMES) |
| Faculty | facultyFilter | faculty | string | cached faculty option exists (cross-uni safe) |
| GPAX | studentGPAX | gpax | number | 0–4 (formatted to 2 decimal string) |
| Study Plan | studentPlan | plan | enum | option exists |
| English | hasEnglish | english | boolean | 0/1 |
| TGAT/TPAT | hasAptitude | aptitude | boolean | 0/1 |
| A-Level | hasALevel | alevel | boolean | 0/1 |
| Sorting | sortResults | sort | enum | option exists |

### State Sync Guard Strategy:
* Added initialization flags: `isRestoringURLState` and `hasRestoredURLState` in memory.
* `syncURLFromUI()` checks `if (isRestoringURLState) return;` to prevent rewriting URL search parameters during the restoration phase.
* Utilizes `window.history.replaceState` to update URL search parameters without reloading or flooding the back navigation history.

### Restore Order Sequence:
1. DOMContentLoaded triggers data fetch of `data_chunks/global_index.json`.
2. Invokes `restoreStateFromURL()` when data array is fully loaded.
3. Reads parameters using `URLSearchParams` parser.
4. Validates and applies `roundFilter`.
5. Pre-filters `activeRoundData` based on the validated round selection.
6. Builds university list using `populateFilters()`.
7. Restores `uniFilter` to the verified university name.
8. Rebuilds and populates faculty list via `updateFacultyDropdown()`.
9. Restores `facultyFilter` if still present in the updated options scope (otherwise clears).
10. Restores search input query, GPAX threshold, Study Plan, and checkbox states.
11. Restores sorting dropdown value.
12. Resets visible result limits via `resetVisibleResults()`.
13. Runs `filterData()` to render matching cards, update filter summary chips, and write canonical parameters.
14. Discards `isRestoringURLState` guard lock.

### Copy Link & Clipboard Controls:
* Added a sleek inline button `#copySearchLinkBtn` ("คัดลอกลิงก์การค้นหา") with a spacer inside `.results-toolbar-summary`.
* `copyCurrentSearchLink()` calls `syncURLFromUI()` to canonicalize search parameters, then executes secure `navigator.clipboard.writeText` if in a secure context.
* Falls back to a hidden textarea copy mechanism to ensure copy compatibility in HTTP LAN environments (such as phone web views).
* Shows polite screen-reader accessible feedback text for 3 seconds.

### Phase 9 Test Results:
* **Functional & Visual Tests**: Passed. Shared URLs correctly restore complete search configurations, cascading university-faculty bounds, sorting choices, and personalized checkbox markers. Clipboard fallback works seamlessly on mobile web browser connections.
* **Console Errors**: 0 console errors / 0 warnings.
* **Network Errors**: 0 network errors.
* **Rollback Command for Phase 9 specifically**:
  ```bash
  git revert <PHASE_9_COMMIT_HASH>
  ```
