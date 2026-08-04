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
