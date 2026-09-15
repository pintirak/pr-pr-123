import React, { useState } from 'react';
import { 
  Github, 
  UploadCloud, 
  Download, 
  FileJson, 
  Check, 
  Copy, 
  RefreshCw, 
  Terminal, 
  ShieldCheck, 
  Server, 
  Workflow, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Database
} from 'lucide-react';
import { PRRequest, LineNotificationSettings, NotificationLog } from '../types';
import { exportDatabaseJSON, importDatabaseJSON, resetToSeedData } from '../utils/storage';

interface DeployModalProps {
  requests: PRRequest[];
  settings: LineNotificationSettings;
  logs: NotificationLog[];
  onDatabaseRestored: (data: { requests: PRRequest[]; settings: LineNotificationSettings; logs: NotificationLog[] }) => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  requests,
  settings,
  logs,
  onDatabaseRestored,
}) => {
  const [activeTab, setActiveTab] = useState<'filebase' | 'github' | 'vercel' | 'cicd'>('filebase');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDatabaseJSON(content);
      if (res.success && res.requests) {
        onDatabaseRestored({
          requests: res.requests,
          settings: res.settings || settings,
          logs: res.logs || logs,
        });
        setImportStatus(`✓ นำเข้าข้อมูลสำเร็จ! พบคำขอทั้งหมด ${res.requests.length} รายการ`);
      } else {
        setImportStatus(`⚠️ เกิดข้อผิดพลาด: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('คุณต้องการรีเซ็ตฐานข้อมูลเป็นข้อมูลตัวอย่างเริ่มต้นใช่หรือไม่?')) {
      const fresh = resetToSeedData();
      onDatabaseRestored(fresh);
      setImportStatus('✓ รีเซ็ตข้อมูลเรียบร้อยแล้ว');
    }
  };

  const gitCommands = `# 1. เข้าโฟลเดอร์โปรเจกต์และเริ่ม Git
git init

# 2. นำไฟล์ทั้งหมดเข้า staging
git add .

# 3. บันทึก commit
git commit -m "feat: ระบบ PR SYSTEM พร้อม deploy บน Vercel และ CI/CD"

# 4. ตั้งชื่อ branch หลักเป็น main
git branch -M main

# 5. เชื่อมต่อไปยัง GitHub Repo ของคุณ (สร้าง repo เปล่าบน github.com ก่อน)
git remote add origin https://github.com/<YOUR_USERNAME>/pr-system.git

# 6. Push ขึ้น GitHub
git push -u origin main`;

  const vercelJsonCode = `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const cicdWorkflowCode = `name: CI/CD Pipeline - PR System to Vercel

on:
  push:
    branches:
      - main
      - master

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ระบบไฟล์เบส, เตรียมขึ้น GitHub, และ Deploy บน Vercel (CI/CD)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                จัดการฐานข้อมูลไฟล์ JSON, ส่งออก-นำเข้า และแนวทางการตั้งค่า Continuous Deployment ครบวงจร
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto border-b border-slate-100 dark:border-slate-800 pb-2">
          {[
            { id: 'filebase', label: '💾 ระบบไฟล์เบส (JSON Storage)', icon: FileJson },
            { id: 'github', label: '🐙 นำขึ้น GitHub', icon: Github },
            { id: 'vercel', label: '▲ Deploy บน Vercel', icon: Server },
            { id: 'cicd', label: '⚡ CI/CD GitHub Actions', icon: Workflow },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: File-based Database Management */}
      {activeTab === 'filebase' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Export JSON Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ดาวน์โหลดฐานข้อมูล JSON (Export Database)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              สำรองข้อมูลคำขอรับบริการทั้งหมด ({requests.length} รายการ), การตั้งค่า LINE และประวัติการแจ้งเตือน เก็บเป็นไฟล์ <code>.json</code> เพื่อนำไปใช้บนเซิร์ฟเวอร์อื่นหรือเป็นไฟล์สำรองประจำเดือน
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">จำนวนคำขอปัจจุบัน:</span>
                <span className="font-bold text-slate-900 dark:text-white">{requests.length} รายการ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">บันทึกแจ้งเตือน:</span>
                <span className="font-bold text-slate-900 dark:text-white">{logs.length} รายการ</span>
              </div>
            </div>

            <button
              onClick={() => exportDatabaseJSON(requests, settings, logs)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-98 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดไฟล์ pr-system-database.json</span>
            </button>
          </div>

          {/* Import JSON Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
              <UploadCloud className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                นำเข้าไฟล์ฐานข้อมูล JSON (Import Database)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              เลือกไฟล์ฐานข้อมูล <code>.json</code> เพื่อกู้คืนหรือนำเข้าข้อมูลคำขอรับบริการกลับเข้ามาในระบบแบบทันที
            </p>

            <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 transition-all">
              <FileJson className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                คลิกเลือกไฟล์ JSON จากเครื่อง
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                รองรับไฟล์นามสกุล .json
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {importStatus && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl">
                {importStatus}
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleResetData}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>รีเซ็ตเป็นข้อมูลตัวอย่างเริ่มต้น</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: GitHub Guide */}
      {activeTab === 'github' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span>ขั้นตอนการนำโปรเจกต์ขึ้น GitHub Repository</span>
            </h3>
            <button
              onClick={() => copyToClipboard('git', gitCommands)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium"
            >
              {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'git' ? 'คัดลอกแล้ว' : 'คัดลอกคำสั่ง Git'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
              {gitCommands}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200 space-y-1">
            <p className="font-bold">💡 คำแนะนำ:</p>
            <p>1. เข้าไปที่ <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="underline font-semibold">github.com/new</a> เพื่อสร้าง Repository เปล่า</p>
            <p>2. นำ URL ของ repository มาแทนที่ในบรรทัด <code>git remote add origin ...</code></p>
            <p>3. ไฟล์ <code>.gitignore</code> ได้ถูกตั้งค่าให้ข้าม node_modules และไฟล์ส่วนเกินเรียบร้อยแล้ว</p>
          </div>
        </div>
      )}

      {/* Tab 3: Vercel Deploy */}
      {activeTab === 'vercel' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-black dark:text-white" />
              <span>การตั้งค่าไฟล์ vercel.json และ Deploy บน Vercel</span>
            </h3>
            <button
              onClick={() => copyToClipboard('vercel', vercelJsonCode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium"
            >
              {copiedKey === 'vercel' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'vercel' ? 'คัดลอกแล้ว' : 'คัดลอก vercel.json'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            โปรเจกต์นี้มีไฟล์ <code>/vercel.json</code> พร้อมในตัว ซึ่งตั้งค่า SPA Rewrites สำหรับรองรับ routing และ build output ของ Vite เรียบร้อยแล้ว:
          </p>

          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto">
            {vercelJsonCode}
          </pre>

          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-slate-900 dark:text-white">🚀 ขั้นตอนการเชื่อมต่อ:</h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>เปิด <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">vercel.com</a> และล็อกอินด้วยบัญชี GitHub</li>
              <li>คลิก <strong>Add New Project</strong> ➜ เลือก repository <strong>pr-system</strong></li>
              <li>Framework Preset ให้เลือก <strong>Vite</strong></li>
              <li>คลิก <strong>Deploy</strong> เว็บจะพร้อมใช้งานได้ภายใน 1-2 นาที</li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab 4: CI/CD GitHub Actions */}
      {activeTab === 'cicd' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Workflow className="w-4 h-4 text-purple-600" />
              <span>การตั้งค่า CI/CD ด้วย GitHub Actions (.github/workflows/deploy.yml)</span>
            </h3>
            <button
              onClick={() => copyToClipboard('cicd', cicdWorkflowCode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium"
            >
              {copiedKey === 'cicd' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'cicd' ? 'คัดลอกแล้ว' : 'คัดลอก Workflow'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            ไฟล์ <code>/.github/workflows/deploy.yml</code> มีอยู่ในโปรเจกต์แล้ว ทุกครั้งที่มีการ push โค้ดใหม่ขึ้น GitHub ระบบจะรัน build ตรวจสอบความถูกต้องและ deploy ขึ้น Vercel อัตโนมัติ:
          </p>

          <pre className="p-4 rounded-2xl bg-slate-950 text-purple-300 font-mono text-xs overflow-x-auto">
            {cicdWorkflowCode}
          </pre>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">🔑 ตัวแปร GitHub Secrets ที่ต้องตั้งค่า:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">VERCEL_TOKEN</span>
                <p className="text-[10px] text-slate-400 mt-0.5">รับจาก Vercel Account Settings &gt; Tokens</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">VERCEL_ORG_ID</span>
                <p className="text-[10px] text-slate-400 mt-0.5">ได้จากการรัน npx vercel link</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">VERCEL_PROJECT_ID</span>
                <p className="text-[10px] text-slate-400 mt-0.5">ได้จาก .vercel/project.json</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
