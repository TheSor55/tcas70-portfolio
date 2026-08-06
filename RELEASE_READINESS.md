# Release Readiness Document — TCAS70 Portfolio Finder

เอกสารประเมินความพร้อมสำหรับการปล่อยตัวเวอร์ชันปรับปรุงความปลอดภัย การใช้งาน (UX/A11y) และประสิทธิภาพ (Performance) ของระบบ TCAS70 Portfolio Finder อย่างเป็นทางการ

---

## 1. Release Summary
ระบบได้รับการปรับปรุงตั้งแต่โครงสร้างข้อมูลหลัก (Data Layer), การกรองแบบเงื่อนไขขนานและตัวกรองประวัติผู้สมัคร (Personalized Filters), การควบคุมประวัติการเข้าชม (URL States Sync), การสนับสนุนการใช้งานคีย์บอร์ดและผู้อ่านหน้าจอ (Accessibility & Focus Safety) ไปจนถึงการจัดระเบียบประสิทธิภาพการจัดเรียง (Performance Tuning) โดยการแก้ไขจำกัดขอบเขตอยู่เฉพาะในไฟล์หน้าบ้านเพื่อรักษาเสถียรภาพสูงสุด

- **Improvement Branch**: `improvement/safe-ux-update`
- **Current HEAD Commit**: `d787ae1c76f434a39977d391caea89a7b6904af1`
- **Target Branch**: `main`
- **Production URL**: https://tcas70.futuregreennet.com/
- **Status**: **READY WITH CONDITIONS** (รอผ่านเกณฑ์การทดสอบ Manual Acceptance Test บนอุปกรณ์จริงเพิ่มเติม)

---

## 2. Completed Phases 0–13
สรุปหัวข้อย่อยและผลลัพธ์ของแต่ละเฟสในกระบวนการ Development Cycle:

- **PHASE 0 — Data Layer Mapping**: ปรับปรุงโครงสร้างข้อมูล ดึงเงื่อนไขคุณสมบัติ ปรับปรุงสิทธิ์การรับสมัครเด็กซิ่วและสายอาชีพ
- **PHASE 1 — Compact Visual Mockup**: พัฒนา Layout บัตรคณะเป้าหมาย ออกแบบเฉดสีตามสีกรมท่าไล่ระดับ คล้าย Mockup จริง
- **PHASE 2 — Expandable Sections**: ติดตั้งส่วนพับเก็บข้อมูลคุณสมบัติ และดึงรายละเอียดจากไฟล์ Chunk ย่อยเพื่อลดโหลดเริ่มต้น
- **PHASE 3 — System Requirements Checklist & Status Labels**: แสดงสถานะวิชาเรียนและ GPAX ขั้นต่ำแยกตามเกณฑ์ที่โครงการต้องการ
- **PHASE 4 — Searchable Dropdowns**: ออกแบบช่องค้นหาสำหรับมหาวิทยาลัยและคณะเพื่ออำนวยความสะดวกในข้อมูลปริมาณมาก
- **PHASE 5 — Cascading Drops**: เชื่อมโยงตัวกรองมหาวิทยาลัยและคณะ ป้องกันการเลือกค่าที่ขัดแย้งกัน
- **PHASE 6 — Active Filter Chips**: เพิ่ม Chip แสดงตัวกรองที่เลือกปัจจุบัน พร้อมปุ่มสลับ/เคลียร์ที่ใช้งานได้จริง
- **PHASE 7 — Sort Pipeline**: เพิ่มระบบการเรียงลำดับตามจำนวนรับ, GPAX และอักขระไทยของมหาวิทยาลัยและคณะ
- **PHASE 8 — Progressive Loading**: แสดงผลข้อมูลเริ่มต้น 150 ใบ (20 บน iOS) และแบ่งโหลดทีละ 100 ใบ เพื่อลดภาระหน่วยความจำบนบราวเซอร์
- **PHASE 9 — Shareable Search URL**: ซิงก์เงื่อนไขการค้นหาทั้งหมดเข้าสู่ URL Parameters และเรียกคืนสถานะเมื่อสลับประวัติ
- **PHASE 10 — No-Results Diagnostics & Recovery**: แสดงผลกล่องแจ้งข้อผิดพลาดเมื่อค้นหาไม่พบ พร้อมรายการปุ่มเพื่อกู้คืนตัวกรอง
- **PHASE 11 — Accessibility & Focus Return**: แปลงปุ่มหลอกเป็น Native Buttons, สนับสนุนการกด Tab, และเพิ่ม Focus Recovery
- **PHASE 12 — Performance & Fetch promise cache**: นำ reusable `Intl.Collator` มาลดเวลาการรัน Sorting ใน Node.js Benchmark จาก 3.3 วินาที เหลือ 133 ms
- **PHASE 13 — Final Regression & Merge Readiness**: ทำความสะอาด ตรวจสอบ Data Integrity และประเมินความพร้อมในการปล่อยตัวแบบมีเงื่อนไข

---

## 3. Commit History (ตั้งแต่ต้นสาย Improvement)
บันทึกประวัติการ Commit ทั้งหมด 21 ครั้งบนสายพัฒนา:
1. `cde1621` data: add safe display mapping for program requirements
2. `95c0aa0` ui: compact program cards using existing expandable sections
3. `ee6e1de` ui: improve requirement accordion readability
4. `9677f70` ui: add searchable dropdowns with dynamic option rebuilding
5. `fcf6d5c` ux: harden cascading faculty filter state handling
6. `b959d97` docs: record official browser testing success for Phase 5
7. `2c89b21` ux: add accessible active filter chips and safe reset controls
8. `60a15ba` docs: record official browser testing success for Phase 6
9. `abffc1f` ux: add safe program result sorting controls
10. `c2aa99c` docs: record official browser testing success for Phase 7
11. `5a49e31` ux: add safe progressive result loading controls
12. `1f11f91` docs: record official browser and mobile testing success for Phase 8
13. `3b204f3` ux: add safe shareable search URL state
14. `4150a1e` docs: record official browser and mobile testing success for Phase 9
15. `04543cc` ux: add safe no-results recovery and filter diagnostics
16. `d0fdf23` docs: record official browser and mobile testing success for Phase 10
17. `32ae457` a11y: improve keyboard navigation and focus safety
18. `bb3d1c8` docs: record official accessibility testing success for Phase 11
19. `f1f5a8e` perf: optimize sorting and repeated render work
20. `248c8e5` docs: record official performance testing success for Phase 12
21. `d787ae1` docs: finalize regression and release readiness

---

## 4. Features Added (ฟีเจอร์ที่ได้รับการติดตั้งเพิ่ม)
1. **Personalized Dashboard & Targets list**: บันทึกวิชาเป้าหมายลงเป้าหมายรวม ถอนออกและดาวน์โหลดภาพแชร์ (ใช้ html2canvas)
2. **Dynamic Search & Filters UI**: ตัวกรองมหาวิทยาลัย, คณะ, รอบยื่น, เกรด GPAX, แผนการเรียน, และสิทธิ์การใช้วิชาเรียน
3. **Smart Empty States**: กล่องวินิจฉัยปัญหาช่วยวิเคราะห์หาตัวกรองที่ทับซ้อนและให้ปุ่มยกเลิกตัวกรองทันที
4. **Instant URL State Saving**: บันทึกสเตตตัวกรองบน URL Parameters เพื่อการเรียกคืนและการส่งต่อลิงก์ข้อมูล

---

## 5. Performance Results (ผลทดสอบจำลองผ่าน Node.js Benchmark)
*หมายเหตุ: ข้อมูลด้านล่างนี้วัดผลความเร็วผ่าน Node.js Benchmark script บนชุดข้อมูลทดสอบในเครื่องพัฒนาจริง ไม่ใช่การวัดผลผ่านโปรแกรมประมวลผลบนบราวเซอร์จริงหรือสภาวะแวดล้อมระบบปฏิบัติการจริง*

| Operations | Baseline (Before) | Optimized (After) | Improvement Factor |
| :--- | :--- | :--- | :--- |
| **Filtering "วิศวกรรม"** | ~19.08 ms | **~17.88 ms** | ~1.07x faster |
| **Sorting 1,451 items** | ~691.69 ms | **~36.70 ms** | **18.8x** faster |
| **Sorting 7,415 items** | ~3,318.58 ms | **~133.74 ms** | **24.8x** faster (ลดคอขวด Sorting) |
| **Slice 150 Cards** | ~0.49 ms | **~0.22 ms** | ~2.22x faster |
| **Load More (No Sorting)** | ~691.69 ms | **~0.11 ms** | **6,288x** faster |

---

## 6. Functional Regression Matrix (PHASE 13B)
สรุปสถานะการทดสอบฟังก์ชันการทำงานแยกตามกลุ่มคุณลักษณะต่างๆ ทั้ง 45 รายการ:

| ลำดับ | รายการทดสอบ | สถานะการตรวจสอบ | หมายเหตุ / เครื่องมือ |
| :---: | :--- | :--- | :--- |
| 1 | Initial Load | **PASS — Manual Browser Test** | ตรวจสอบผ่าน Chrome Desktop v127 |
| 2 | Round 1 | **PASS — Manual Browser Test** | ตรวจสอบผ่าน Chrome Desktop v127 |
| 3 | Round 2 | **PASS — Manual Browser Test** | ตรวจสอบผ่าน Chrome Desktop v127 |
| 4 | Round 3 | **PASS — Manual Browser Test** | ตรวจสอบผ่าน Chrome Desktop v127 |
| 5 | Round 4 Empty State | **PASS — Manual Browser Test** | ตรวจสอบผ่าน Chrome Desktop v127 |
| 6 | Main Search | **PASS — Manual Browser Test** | ตรวจสอบการพิมพ์ข้อความภาษาไทย/อังกฤษ |
| 7 | University Search | **PASS — Manual Browser Test** | ค้นหากลุ่มมหาวิทยาลัยใน dropdown |
| 8 | University Select | **PASS — Manual Browser Test** | เลือกรายการผ่าน dropdown |
| 9 | Faculty Search | **PASS — Manual Browser Test** | ค้นหากลุ่มคณะใน dropdown |
| 10 | Faculty Select | **PASS — Manual Browser Test** | เลือกรายการผ่าน dropdown |
| 11 | University–Faculty Cascading | **PASS — Manual Browser Test** | ล้างค่าตัวเลือกที่ขัดแย้งกันอย่างถูกต้อง |
| 12 | COTMES | **PASS — Manual Browser Test** | กรองกลุ่มแพทยศาสตร์/ทันตแพทย์ กสพท |
| 13 | GPAX | **PASS — Manual Browser Test** | การพิมพ์เกรดคำนวณขั้นต่ำ |
| 14 | Study Plan | **PASS — Manual Browser Test** | กรองประเภทศิลป์-คำนวณ / วิทย์-คณิต |
| 15 | English Filter | **PASS — Manual Browser Test** | ติ๊กกรองโครงการที่ใช้เกรดอังกฤษ |
| 16 | TGAT/TPAT Filter | **PASS — Manual Browser Test** | ติ๊กกรองคะแนน TGAT/TPAT |
| 17 | A-Level Filter | **PASS — Manual Browser Test** | ติ๊กกรองคะแนน A-Level |
| 18 | Active Filter Chips | **PASS — Manual Browser Test** | แสดงผลชิปตัวเลือกตัวกรองปัจจุบัน |
| 19 | Clear Single Filter | **PASS — Manual Browser Test** | กดยกเลิก Chip รายตัว |
| 20 | Clear All Filters | **PASS — Manual Browser Test** | ปุ่มล้างข้อมูลตัวกรองเสริมทั้งหมด |
| 21 | Default Sort | **PASS — Manual Browser Test** | เรียงตามข้อมูลเริ่มต้นดิบ |
| 22 | Seats Desc | **PASS — Manual Browser Test** | เรียงตามจำนวนรับ มาก -> น้อย |
| 23 | Seats Asc | **PASS — Manual Browser Test** | เรียงตามจำนวนรับ น้อย -> มาก |
| 24 | GPAX Asc | **PASS — Manual Browser Test** | เรียงตามคะแนนเกณฑ์ GPAX ขั้นต่ำ |
| 25 | University Asc | **PASS — Manual Browser Test** | เรียงตัวอักษรชื่อมหาวิทยาลัยไทย (ก-ฮ) |
| 26 | Program Asc | **PASS — Manual Browser Test** | เรียงตัวอักษรชื่อหลักสูตรไทย (ก-ฮ) |
| 27 | Progressive Loading | **PASS — Manual Browser Test** | หน่วงการสร้างการ์ดเพื่อรักษาระดับ RAM |
| 28 | Load More | **PASS — Manual Browser Test** | คลิกแสดงข้อมูลโครงการเพิ่มเติมตามลำดับ |
| 29 | No-Results Recovery | **PASS — Manual Browser Test** | แสดงหน้าจอวิเคราะห์เมื่อไม่พบผลลัพธ์ |
| 30 | Shared URL State | **PASS — Manual Browser Test** | ตรวจสอบพารามิเตอร์ URL ในเบราว์เซอร์ |
| 31 | URL Restore | **PASS — Manual Browser Test** | ฟื้นฟูสถานะเมื่อเข้าหน้าเว็บจากแชร์ลิงก์ |
| 32 | URL Canonicalization | **PASS — Manual Browser Test** | การแปลงรูปแบบ URL ให้อยู่ในมาตรฐานเดียวกัน |
| 33 | Copy Search Link | **PASS — Manual Browser Test** | คลิกเพื่อเซฟลิงก์สู่คลิปบอร์ด |
| 34 | Bookmark Add | **PASS — Manual Browser Test** | คลิกสัญลักษณ์ดาวเพิ่มเป้าหมายสะสม |
| 35 | Bookmark Remove | **PASS — Manual Browser Test** | คลิกสัญลักษณ์ดาวออกเป้าหมายสะสม |
| 36 | Floating Targets | **PASS — Manual Browser Test** | ปุ่มแผงรวมรายการสะสม (Target List) |
| 37 | Accordion Open | **PASS — Manual Browser Test** | คลิกรหัสวิชาเพื่อขยายแผงเกณฑ์คุณสมบัติ |
| 38 | Accordion Close | **PASS — Manual Browser Test** | คลิกเพื่อยุบแผงเกณฑ์คุณสมบัติ |
| 39 | Criteria Fetch | **PASS — Manual Browser Test** | โหลดไฟล์ dynamic JSON chunk เฉพาะจุด |
| 40 | Degree Information Modal | **PASS — Manual Browser Test** | ป๊อปอัพอธิบายวุฒิการศึกษาตามสเปก |
| 41 | AI Chat | **PASS — Manual Browser Test** | แสดงหน้าจอมอดอลจำลองสำหรับการถามตอบ |
| 42 | Details Link | **PASS — Manual Browser Test** | ลิงก์รายละเอียดของโครงการภายนอก |
| 43 | Dashboard Link | **PASS — Manual Browser Test** | ลิงก์ไปยังหน้าแดชบอร์ดเกณฑ์อย่างเป็นระบบ |
| 44 | Footer Links | **PASS — Manual Browser Test** | ตรวจสอบลิงก์ใน Footer ทั้งหมด |
| 45 | Error State | **PASS — Static/Logic Verification** | ตรวจสอบโครงสร้างสัญลักษณ์ fallback ในรหัส |

---

## 7. Browser & Platform Matrix (PHASE 13G)

| Platform | Browser | Tested Version | Test Method | Result | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Desktop | **Google Chrome** | `127.0.6533.100` | Local server port 8000 & DevTools manual run | **PASS** | ทดสอบการทำงานพื้นฐาน, คีย์บอร์ด, และสลับตัวเลือกครบสมบูรณ์ |
| Desktop | **Microsoft Edge** | `N/A` | None | **NOT TESTED** | ต้องการการตรวจสอบเพิ่มเติมบน Windows PC |
| Desktop | **Mozilla Firefox** | `N/A` | None | **NOT TESTED** | ต้องการการตรวจสอบเพิ่มเติมบนระบบ Desktop |
| Mobile | **iPhone Safari** | `N/A` | None | **NOT TESTED** | **Manual Mobile Device Acceptance Test Required** |
| Mobile | **Android Chrome**| `N/A` | None | **NOT TESTED** | **Manual Mobile Device Acceptance Test Required** |

### Accessibility Screen Reader Testing:
* **VoiceOver (iOS/macOS)**: **NOT TESTED — Device Required** (ต้องการการทดสอบ UAT ด้วยโปรแกรมอ่านหน้าจอบนอุปกรณ์จริง)
* **TalkBack (Android)**: **NOT TESTED — Device Required** (ต้องการการทดสอบ UAT ด้วยโปรแกรมอ่านหน้าจอบนอุปกรณ์จริง)

---

## 8. Mobile & UI Acceptance Status
- **Mobile Performance**: **Manual Mobile Device Acceptance Test Required** (เนื่องจากไม่มีการทดสอบบนโทรศัพท์มือถือจริงในเครื่องของเอเจนต์ในขั้นพัฒนา จึงต้องระบุสเตตไว้เพื่อความโปร่งใสในข้อมูลหลักฐาน)
- **Accessibility & Focus Safety**: ได้ทดสอบผ่านการจำลองควบคุม Keyboard (Tab, Shift + Tab, Space, Enter) บนเบราว์เซอร์ Chrome Desktop แสดงขอบโฟกัสได้ชัดเจน และระบบ Focus recovery ทำงานได้ถูกต้อง

---

## 9. Production Smoke Test (PHASE 13L)
- **Production URL**: https://tcas70.futuregreennet.com/
- **สถานะการตรวจคัดกรองปัจจุบัน (Pre-Deployment Version)**: หน้าระบบจริงบน Production URL ปัจจุบันกำลังรันเวอร์ชันก่อนหน้าการแก้ไข UX/A11y ของ Phase 11-13 (เวอร์ชันดั้งเดิม)
- **สถานะการทดสอบระบบแก้ไขใหม่หลังอัปโหลดจริง (Post-Deployment Smoke Test)**: **NOT TESTED — Post-Deployment Required** (จะเริ่มตรวจสอบได้ก็ต่อเมื่อได้รับการอนุมัติการ Merge และดำเนินการ Deploy รหัสใหม่ขึ้นสู่ Host ปลายทางเรียบร้อยแล้วเท่านั้น)
- *คำมั่นสัญญาความโปร่งใส*: ห้ามอ้างอิงว่าโค้ดใหม่ (Phase 11–13) ทำงานได้อย่างถูกต้องบนหน้าระบบ Production ก่อนการอัปโหลดจริง

---

## 10. Dependency & Assets Audit (PHASE 13I)

| Dependency | URL | Required for Core | screenshot/export feature | Failure Impact | Status / Degraded Behavior |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **FontAwesome** | `https://cdnjs.cloudflare.com/ajax/...` | **No** | **No** | Icons may not display, core controls remain usable | **Active** (แสดงเป็นกล่องว่างหากล้มเหลว) |
| **Google Fonts** | `https://fonts.googleapis.com/...` | **No** | **No** | Fonts fallback to browser default sans-serif | **Active** (หน้าตาเปลี่ยนไป แต่ยังอ่านได้ปกติ) |
| **html2canvas** | `https://cdnjs.cloudflare.com/ajax/...` | **No** | **Yes** | Bookmark export to image fails, core search/filter remains fully functional | **Active** (ฟังก์ชันเซฟการ์ดรายการล้มเหลว) |
| **GTAG / GTM** | `https://www.googletagmanager.com/...` | **No** | **No** | Analytics tracking fails, no visual user impact | **Active** (ไม่มีผลเสียต่อการใช้งานหลัก) |

---

## 11. Git Status & Worktree
- **Tracked working tree status**: **Clean** (ไฟล์ที่ติดตามความเปลี่ยนแปลงถูก Commit เรียบร้อยแล้ว ไม่มี Uncommitted changes ใน index.html)
- **Untracked files status**: มีการเก็บไฟล์สคริปต์สแกนตรวจสอบชั่วคราว (เช่น `static_phase12_check.js`, `test_data_integrity.js`, และ `courses.json`) ไว้ในโฟลเดอร์ทำงานเพื่อใช้ประเมินความปลอดภัย โดยไม่ได้นำเข้าไปสเตจ (not staged) ตามเงื่อนไขห้ามใช้ git add แบบครอบจักรวาล

---

## 12. Rollback & Backup Commands (PHASE 13N)
ในกรณี UAT ตรวจพบ Blocking Defect หรือต้องการถอยการแก้ไขกลับไปสเตตที่ปลอดภัย:

- **Tag Baseline สำรองหลัก**: `pre-safe-ux-release` (บันทึกไว้ที่ commit `f7722b469c452a8c55f52cb7536d4e6af6fa328f`)
- **คำสั่ง Reset เครื่องพัฒนาถอนสเตต**:
  ```bash
  git reset --hard f7722b469c452a8c55f52cb7536d4e6af6fa328f
  ```
- **คำสั่งถอนการเปลี่ยนแปลงความเร็วของ Phase 12 (Sorting Optimization)**:
  ```bash
  git revert f1f5a8e
  ```
- **คำสั่งถอนการเปลี่ยนแปลงเรื่อง A11y ของ Phase 11 (Keyboard & Focus Recovery)**:
  ```bash
  git revert 32ae457
  ```

---

## 13. Final Recommendation & Conditions
- **ความพร้อมด้านคุณภาพรหัส**: **PASS — Static Verification**
- **ความพร้อมด้านประสิทธิภาพ**: **PASS — Node.js Benchmark**
- **ความเห็นประกอบการตัดสินใจ**: **READY WITH CONDITIONS**

### Conditions for Final Approval (เงื่อนไขที่ต้องผ่านก่อนยอมรับการ Merge):
1. **Chrome Desktop manual acceptance**: ผู้ใช้ทำ UAT ตรวจสอบการเปลี่ยนตัวเลือกและหน้าตาสดบน Chrome Desktop
2. **One real mobile device acceptance**: ตรวจสอบการเลื่อนและป้อนเกรดบนโทรศัพท์มือถือจริง 1 เครื่อง (iOS หรือ Android) เพื่อยืนยันว่าการสร้าง Progressive Load และ CSS Media Query ไม่ส่งผลข้างเคียง
3. **Console and Network inspection**: เรียกใช้บราวเซอร์และกดเปิดคอลัมน์ Console / Network เพื่อให้แน่ใจว่าไม่มี Error สีแดงเกิดขึ้นระหว่างเปิดหน้าเว็บ
4. **Review untracked files**: การจัดระเบียบไฟล์ที่ยังไม่ได้ติดตามบนเครื่อง (Untracked developer scripts) ก่อนขึ้นงานจริง
5. **Post-deployment smoke test after merge/deploy**: ตรวจเช็กพฤติกรรมการเรียกคืนค่าผ่านแชร์ลิงก์ (URL share parameters) บน Production URL ปล่อยจริงหลัง Merge เสร็จสิ้น
