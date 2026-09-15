# 📢 PR SYSTEM - ระบบบริหารจัดการและบริการงานประชาสัมพันธ์
> ออกแบบและพัฒนาเพื่อยกระดับงานบริการประชาสัมพันธ์ให้เป็นระบบ ทันสมัย และมีประสิทธิภาพสูงสุด ด้วย UI สไตล์ iOS, แดชบอร์ดเรียลไทม์, ระบบแจ้งเตือนผ่าน LINE, รายงานรายเดือนอัตโนมัติ และระบบจัดเก็บข้อมูลแบบไฟล์เบส (File-Based Storage / JSON)

---

## ✨ ฟีเจอร์หลัก (Key Features)

1. **🎨 บริการงานประชาสัมพันธ์ครอบคลุม (Comprehensive PR Services)**:
   - **ออกแบบโปสเตอร์และกราฟิก** (Poster & Infographic Design)
   - **ถ่ายภาพนิ่งและกิจกรรม** (Event Photography & Studio)
   - **ลงข่าวประชาสัมพันธ์ Facebook & สื่อโซเชียล** (FB News & Content Release)
   - **งานแถลงข่าวและประสานงานสื่อมวลชน** (Press Release & Media Relations)
   - **ถ่ายทำและตัดต่อวิดีโอ** (Video Production, Reels & TikTok)
   - **สื่อสิ่งพิมพ์ ป้ายไวนิล และสูจิบัตร** (Print Media, Backdrop & Exhibition)

2. **📱 UI ดีไซน์สไตล์ iOS (Apple iOS 18 Design Language)**:
   - รองรับทั้งการใช้งานบนมือถือ (Mobile iPhone App Layout) และคอมพิวเตอร์ (Desktop Workspace)
   - ปุ่มสลับ **Dark Mode (โหมดมืด)** และ **Light Mode (โหมดสว่าง)** นุ่มนวล สบายตา
   - Segmented Controls, Dynamic Badges, iOS Action Sheets, และ Motion Animations

3. **📊 แดชบอร์ดติดตามสถานะงานแบบเรียลไทม์ (Real-time Status Dashboard)**:
   - มุมมอง Kanban Board และ List View
   - ติดตามสถานะ 5 ขั้นตอน: รอดำเนินการ ➜ กำลังดำเนินการ ➜ รอตรวจรับงาน ➜ กำลังแก้ไข ➜ เสร็จสมบูรณ์
   - ตัวกรองตามประเภทบริการ หน่วยงาน ความเร่งด่วน (ปกติ, ด่วน, ด่วนพิเศษ 24 ชม.)
   - Timeline บันทึกประวัติการทำงานและการส่งมอบไฟล์อย่างโปร่งใส

4. **💬 ระบบแจ้งเตือนผ่าน LINE (LINE Notification Integration)**:
   - แจ้งเตือนทันทีเมื่อมีคำขอใหม่, เมื่อมีการปรับเปลี่ยนสถานะงาน, หรือส่งมอบไฟล์งาน
   - รองรับ LINE Notify และ Webhook
   - มีระบบจำลองการส่งข้อความและบันทึกประวัติ Notification Logs

5. **📈 สรุปผลการดำเนินงานรายเดือนอัตโนมัติ (Automated Monthly PR Report)**:
   - คำนวณ KPIs อัตโนมัติ: จำนวนงานทั้งหมด, อัตราความสำเร็จตรงเวลา (On-time Rate), เวลาเฉลี่ยในการผลิต
   - สรุปบริการยอดนิยมและหน่วยงานที่มีการประสานงานสูงสุด
   - บทวิเคราะห์และข้อเสนอแนะเชิงกลยุทธ์ด้าน PR
   - ส่งออกข้อมูลเป็นไฟล์ **CSV** หรือพิมพ์เป็น **PDF / เอกสารสรุปผู้บริหาร** ในคลิกเดียว

6. **💾 ระบบไฟล์เบส (File-Based Database & Backup)**:
   - ทำงานแบบ Local-first บันทึกข้อมูลอัตโนมัติในเบราว์เซอร์
   - มีปุ่มส่งออกฐานข้อมูลทั้งระบบเป็นไฟล์ `.json` (Export Database)
   - นำเข้าไฟล์ฐานข้อมูลเดิมกลับมาได้ทุกเมื่อ (Import Database)

---

## 🚀 คู่มือการนำขึ้น GitHub และ Deploy บน Vercel พร้อม CI/CD

### ขั้นตอนที่ 1: นำขึ้น GitHub Repository
```bash
# 1. เริ่มต้น Git repository
git init

# 2. เพิ่มไฟล์ทั้งหมด
git add .

# 3. Commit โค้ด
git commit -m "feat: Initial commit of PR SYSTEM"

# 4. เปลี่ยนชื่อ branch เป็น main
git branch -M main

# 5. เชื่อมต่อกับ GitHub Repository ของคุณ (สร้าง repo เปล่าบน github.com ก่อน)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/pr-system.git

# 6. Push โค้ดขึ้น GitHub
git push -u origin main
```

---

### ขั้นตอนที่ 2: Deploy บน Vercel (วิธีที่ง่ายที่สุดผ่าน Vercel Dashboard)
1. เข้าไปที่ [https://vercel.com](https://vercel.com) และลงชื่อเข้าใช้ด้วยบัญชี GitHub ของคุณ
2. คลิก **"Add New..."** ➜ **"Project"**
3. เลือก Repository `pr-system` ที่คุณเพิ่ง push ขึ้นไป
4. ในหน้าตั้งค่าโปรเจกต์:
   - **Framework Preset**: เลือก `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. คลิก **"Deploy"** ภายใน 1-2 นาที ระบบจะขึ้นลิงก์เว็บไซต์พร้อมใช้งานทันที (เช่น `https://pr-system.vercel.app`)

---

### ขั้นตอนที่ 3: ตั้งค่า CI/CD ด้วย GitHub Actions เพื่อการอัปเดตต่อเนื่องอัตโนมัติ
ในโปรเจกต์นี้ได้เตรียมไฟล์ `/.github/workflows/deploy.yml` ไว้ให้เรียบร้อยแล้ว เมื่อมีการ push โค้ดใหม่ขึ้น branch `main` GitHub จะรัน CI/CD และ Deploy ไปยัง Vercel อัตโนมัติ โดยตั้งค่า Secret ดังนี้:

1. **ดึง Vercel Tokens & IDs**:
   - **VERCEL_TOKEN**: ไปที่ Vercel Dashboard ➜ Account Settings ➜ **Tokens** ➜ สร้าง Token ใหม่
   - **VERCEL_ORG_ID** และ **VERCEL_PROJECT_ID**: รันคำสั่ง `npx vercel link` ในโฟลเดอร์โปรเจกต์ จะได้ค่าดังกล่าวในไฟล์ `.vercel/project.json`
2. **นำค่าไปใส่ใน GitHub Repository**:
   - เปิด GitHub Repo ของคุณ ➜ ไปที่แท็บ **Settings**
   - เมนูด้านซ้ายเลือก **Secrets and variables** ➜ **Actions**
   - คลิก **New repository secret** และเพิ่ม 3 ตัวแปร:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`
3. จากนั้น ทุกครั้งที่คุณ `git push` การแก้ไขงานใหม่ GitHub Actions จะทำการทดสอบและ Deploy ขึ้น Vercel ทันที!

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Icons**: Lucide Icons
- **Design System**: Apple iOS 18 Design Aesthetics (Human Interface Guidelines inspired)
- **Data Architecture**: File-based Local Persistence & JSON Data Engine
- **CI/CD & Hosting**: GitHub Actions & Vercel
