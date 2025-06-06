[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/w8H8oomW)
**<ins>Note</ins>: Students must update this `README.md` file to be an installation manual or a README file for their own CS403 projects.**

**รหัสโครงงาน:** 67-1_10_nrc-s1

**ชื่อโครงงาน (ไทย):** Emotion Journey: โมบายแอปพลิเคชันสำหรับจดไดอารี และวิเคราะห์อารมณ์ความรู้สึก เพื่อเสริมสร้างสุขภาพใจที่ดี

**Project Title (Eng):** EMOTION JOURNEY: MOBILE APPLICATION FOR KEEPING A DIARY AND USING SENTIMENT ANALYSIS TO INCREASE GOOD MENTAL HEALTH.


**อาจารย์ที่ปรึกษาโครงงาน:** อ. ดร.นวฤกษ์ ชลารักษ์ 

**ผู้จัดทำโครงงาน:**
1. นางสาวกรกมล ฉายประเวช  6409650154  kornkamon.chai@dome.tu.ac.th
   
## โครงสร้างของโปรเจค
ไฟล์โค้ดของโปรเจคนี้ `emotion-journey`
ประกอบด้วยไฟล์หลักดังต่อไปนี้:

- `_layout.tsx` – จัดการเมนูนำทางและโครงสร้างของหน้าจอ  
- `CreateDiary.tsx` – หน้าสำหรับเขียนและบันทึกไดอารี่  
- `index.tsx` – แสดงปฏิทินสำหรับเลือกวัน  
- `PreviousDiary.tsx` – หน้าสำหรับดูรายการไดอารี่ย้อนหลัง  
- `Summary.tsx` – หน้าสรุปผลที่แสดงแนวโน้มและอารมณ์จากไดอารี่ในรูปแบบแดชบอร์ด

---

## วิธีติดตั้งโปรแกรม

ทำตามขั้นตอนด้านล่างนี้ใน **Visual Studio Code**:

1. เปิด Terminal
2. ติดตั้ง dependencies ทั้งหมด ด้วยคำสั่ง:

   ```bash
   npm install --force
3. เริ่มต้นเซิร์ฟเวอร์

   ```bash
   npx expo start
## การทดสอบแอปพลิเคชัน

สามารถทดสอบแอปได้ 2 วิธีหลัก ดังนี้:

### 1. ทดสอบบนเครื่อง (ผ่านเว็บเบราว์เซอร์)

- หลังจากรันคำสั่ง `npx expo start` แล้ว ให้กดปุ่ม **`w`** บนแป้นพิมพ์ใน Terminal
- ระบบจะเปิดแอปในเว็บเบราว์เซอร์อัตโนมัติ (local host)

### 2. ทดสอบบนสมาร์ทโฟน

- หลังจากรันคำสั่ง `npx expo start` แล้ว ให้กดปุ่ม **`s`** บนแป้นพิมพ์ใน Terminal
- ติดตั้งแอป **Expo Go** บนสมาร์ทโฟน
- ใช้แอป Expo Go สแกน **QR Code** ที่แสดงใน Terminal เพื่อเปิดแอป
