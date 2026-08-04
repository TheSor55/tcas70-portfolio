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
