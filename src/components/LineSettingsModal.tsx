import React, { useState } from 'react';
import { 
  BellRing, 
  Send, 
  CheckCircle2, 
  Smartphone, 
  Trash2, 
  Copy, 
  Check, 
  AlertTriangle,
  Info,
  ExternalLink,
  MessageCircle,
  Key,
  Users,
  UserCheck,
  RefreshCw,
  Search
} from 'lucide-react';
import { LineNotificationSettings, NotificationLog } from '../types';
import { dispatchLineNotification, formatLineMessage, DispatchLineResult } from '../utils/lineNotify';

interface LineSettingsModalProps {
  settings: LineNotificationSettings;
  onSaveSettings: (settings: LineNotificationSettings) => void;
  logs: NotificationLog[];
  onClearLogs: () => void;
  onAddLog: (log: NotificationLog) => void;
}

export const LineSettingsModal: React.FC<LineSettingsModalProps> = ({
  settings,
  onSaveSettings,
  logs,
  onClearLogs,
  onAddLog,
}) => {
  const [formData, setFormData] = useState<LineNotificationSettings>({ ...settings });
  const [testResult, setTestResult] = useState<DispatchLineResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  
  // Bot verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [botVerifyResult, setBotVerifyResult] = useState<{
    valid: boolean;
    bot?: { displayName: string; basicId: string; pictureUrl?: string };
    error?: string;
    hint?: string;
    tokenLength?: number;
  } | null>(null);

  const [customTestText, setCustomTestText] = useState('');
  const [showCustomTest, setShowCustomTest] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Check if current token is demo or empty
  const activeToken = (formData.lineNotifyToken || formData.channelAccessToken || '').trim();
  const isDemoMode = !activeToken || activeToken.startsWith('DEMO_');

  const handleToggle = (key: keyof LineNotificationSettings) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Verify token directly with LINE API
  const handleVerifyToken = async () => {
    if (!activeToken || activeToken.startsWith('DEMO_')) {
      setBotVerifyResult({
        valid: false,
        error: 'ยังไม่ได้ใส่ Token จริง (เป็นค่าจำลอง Demo)',
        hint: 'กรุณานำ Channel access token จาก developers.line.biz มาวางในช่องนี้',
        tokenLength: activeToken.length,
      });
      return;
    }

    setIsVerifying(true);
    setBotVerifyResult(null);

    try {
      const res = await fetch('/api/line-bot-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: activeToken }),
      });
      const data = await res.json();
      setBotVerifyResult(data);
      if (data.valid && data.bot) {
        setFormData((prev) => ({
          ...prev,
          targetName: `บอท ${data.bot.displayName} (@${data.bot.basicId})`,
        }));
      }
    } catch (err: any) {
      setBotVerifyResult({
        valid: false,
        error: `ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ตรวจสอบได้: ${err.message}`,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTestPing = async (customMessage?: string) => {
    setIsTesting(true);
    setTestResult(null);

    try {
      let result: DispatchLineResult;
      if (customMessage) {
        result = await dispatchLineNotification('test', formData, undefined, customMessage);
      } else {
        result = await dispatchLineNotification('test', formData);
      }

      setTestResult(result);
      onAddLog(result.log);

      if (result.success && result.isReal) {
        const updated = {
          ...formData,
          lastTestedAt: new Date().toISOString(),
          lastTestSuccess: true,
          lastTestMessage: 'ส่งข้อความเข้า LINE สำเร็จ',
        };
        setFormData(updated);
        onSaveSettings(updated);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const previewMessage = formatLineMessage('new_request', {
    id: 'PR-2025-001',
    title: 'ตัวอย่าง: ออกแบบโปสเตอร์ประชาสัมพันธ์หลักสูตรพยาบาลศาสตรบัณฑิต',
    serviceType: 'poster',
    status: 'pending',
    urgency: 'urgent',
    department: 'หลักสูตรพยาบาลศาสตรบัณฑิต (ปริญญาตรี)',
    requesterName: 'ผศ.ดร. รัตนาภรณ์ มงคลสวัสดิ์',
    requesterPosition: 'ประธานหลักสูตรพยาบาลศาสตรบัณฑิต',
    requesterPhone: '081-987-6543',
    requesterEmail: 'rattanaporn.m@nurse.nu.ac.th',
    neededDate: '2025-10-15',
    neededTime: '09:00',
    eventLocation: 'คณะพยาบาลศาสตร์ ม.นเรศวร',
    description: 'ต้องการโปสเตอร์ขนาด A3 และแบนเนอร์ Facebook',
    specs: {},
    attachments: [],
    timeline: [],
    deliverables: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, undefined, formData);

  const copyPreview = () => {
    navigator.clipboard.writeText(previewMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ระบบแจ้งเตือนผ่าน LINE (LINE Notification Integration)
              </h2>
              {isDemoMode ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="w-3 h-3" />
                  <span>โหมดจำลอง (ยังไม่เชื่อม LINE จริง)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>ใส่รหัส Token แล้ว</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ส่งข้อความแจ้งเตือนอัตโนมัติเข้ากลุ่มหรือแชทส่วนตัว เมื่อมีคำขอใหม่ อัปเดตสถานะ และส่งมอบงาน
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleTestPing()}
            disabled={isTesting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>กำลังส่งไปยัง LINE...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ทดสอบส่งเข้า LINE ทันที</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Test Result Alert */}
      {testResult && (
        <div
          className={`p-4 rounded-3xl border transition-all animate-fadeIn ${
            testResult.isReal && testResult.success
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : testResult.isDemo
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {testResult.isReal && testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              ) : testResult.isDemo ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {testResult.isReal && testResult.success
                    ? '🎉 ส่งเข้า LINE จริงสำเร็จ 100%!'
                    : testResult.isDemo
                    ? '⚠️ แจ้งเตือนในโหมดจำลอง (ยังไม่มีข้อความเข้ามือถือ)'
                    : '❌ ส่งข้อความไปยัง LINE ไม่สำเร็จ'}
                </h4>
                <p className="text-xs mt-1 leading-relaxed">
                  {testResult.isReal && testResult.success ? (
                    <span>
                      {testResult.message} กรุณาเปิดแอป LINE ในโทรศัพท์เพื่อตรวจสอบข้อความ
                    </span>
                  ) : testResult.isDemo ? (
                    <span>
                      {testResult.errorDetail || 'เนื่องจากยังใช้ Demo Token ข้อความจึงแสดงเฉพาะในตารางประวัติด้านล่าง'}
                      <strong className="block mt-1 font-semibold text-amber-800 dark:text-amber-200">
                        👉 กรุณาใส่ Token ที่ได้จาก LINE ในช่องด้านล่าง แล้วบันทึกการตั้งค่า
                      </strong>
                    </span>
                  ) : (
                    <span>
                      <strong>สาเหตุ:</strong> {testResult.errorDetail}
                      {testResult.hint && (
                        <span className="block mt-1 text-rose-800 dark:text-rose-200 font-medium">
                          💡 <strong>คำแนะนำแก้ไข:</strong> {testResult.hint}
                        </span>
                      )}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setTestResult(null)}
              className="text-xs font-bold opacity-60 hover:opacity-100 px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Settings Grid: Configuration & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  เปิดใช้งานระบบแจ้งเตือน LINE
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  ส่งการแจ้งเตือนงาน PR อัตโนมัติไปยังกลุ่มงานหรือผู้ขอรับบริการ
                </span>
              </div>

              {/* iOS Switch */}
              <button
                type="button"
                onClick={() => handleToggle('enabled')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Provider Configuration Inputs */}
            <div className="space-y-4 text-xs">
              
              {/* Token Input with Direct Verify Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-600" />
                    <span>LINE Channel Access Token (จาก LINE Developers)</span>
                  </label>
                  <a
                    href="https://developers.line.biz/console/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>เปิด LINE Developers</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="วาง Channel access token ที่นี่ (ความยาวประมาณ 170+ ตัวอักษร)"
                    value={formData.lineNotifyToken}
                    onChange={(e) => {
                      setFormData({ ...formData, lineNotifyToken: e.target.value });
                      setBotVerifyResult(null);
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyToken}
                    disabled={isVerifying}
                    className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 flex-shrink-0 transition-all active:scale-95"
                  >
                    {isVerifying ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>ตรวจสอบ</span>
                  </button>
                </div>

                {/* Token Verification Result Card */}
                {botVerifyResult && (
                  <div
                    className={`mt-2 p-3 rounded-2xl border text-xs animate-fadeIn ${
                      botVerifyResult.valid
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                    }`}
                  >
                    {botVerifyResult.valid && botVerifyResult.bot ? (
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">
                            ✓ ตรวจพบบอท LINE: "{botVerifyResult.bot.displayName}" (LINE ID: {botVerifyResult.bot.basicId})
                          </p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                            สถานะ Token ถูกต้อง 100%! อย่าลืมค้นหาไอดี <strong>{botVerifyResult.bot.basicId}</strong> ในแอป LINE เพื่อเพิ่มเพื่อน
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">
                            ✗ {botVerifyResult.error}
                          </p>
                          {botVerifyResult.hint && (
                            <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                              คำแนะนำ: {botVerifyResult.hint}
                            </p>
                          )}
                          {botVerifyResult.tokenLength !== undefined && (
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              ความยาวรหัสที่คุณใส่: {botVerifyResult.tokenLength} ตัวอักษร
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isDemoMode && !botVerifyResult && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                    <span>ขณะนี้ใช้ Token จำลองอยู่ ข้อความจึงไม่เข้าโทรศัพท์ กรุณานำ Token จริงมาวางแล้วกด 'ตรวจสอบ'</span>
                  </p>
                )}
              </div>

              {/* Target / Recipient Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ชื่อบอทหรือกลุ่มที่ส่งแจ้งเตือน
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น บอท PR คณะพยาบาลศาสตร์ ม.นเรศวร"
                    value={formData.targetName || ''}
                    onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    คำนำหน้าข้อความ (Custom Prefix)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 📢 [PR คณะพยาบาลศาสตร์ ม.นเรศวร]"
                    value={formData.customPrefix}
                    onChange={(e) => setFormData({ ...formData, customPrefix: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Optional Webhook URL */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Webhook URL สำรอง (Google Apps Script / Make / Zapier) <span className="text-slate-400 font-normal">(ถ้ามี)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/... หรือ https://hook.eu1.make.com/..."
                  value={formData.webhookUrl || ''}
                  onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

            </div>

            {/* Notification Trigger Event Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                เลือกเหตุการณ์ที่ต้องการให้ส่งแจ้งเตือนเข้า LINE
              </label>

              {[
                { key: 'notifyOnNewRequest', title: 'เมื่อมีคำขอบริการใหม่ (New Request)', desc: 'ส่งเข้ากลุ่ม PR ทันทีเมื่อผู้ขอยื่นแบบฟอร์ม' },
                { key: 'notifyOnStatusChange', title: 'เมื่อมีการเปลี่ยนสถานะงาน (Status Change)', desc: 'เช่น มอบหมายงานแล้ว, เริ่มผลิต, ส่งแบบร่างให้ตรวจ' },
                { key: 'notifyOnDelivery', title: 'เมื่อส่งมอบชิ้นงานสำเร็จ (Delivery Complete)', desc: 'ส่งแจ้งเตือนพร้อมแนบลิงก์ผลงานและไฟล์ดาวน์โหลด' },
                { key: 'notifyOnUrgent', title: 'ติดแท็กด่วนพิเศษ (Urgent / Express)', desc: 'ติดสัญลักษณ์ 🚨 แจ้งเตือนด่วนพิเศษภายใน 24 ชม.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.desc}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle(item.key as keyof LineNotificationSettings)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData[item.key as keyof LineNotificationSettings] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData[item.key as keyof LineNotificationSettings] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Message Sandbox */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowCustomTest(!showCustomTest)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{showCustomTest ? '▼ ซ่อนเครื่องมือทดสอบพิมพ์ข้อความเอง' : '▶ ทดสอบพิมพ์ข้อความส่งเข้า LINE เอง (Custom Message)'}</span>
              </button>

              {showCustomTest && (
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    พิมพ์ข้อความทดสอบส่งเข้ามือถือ:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="พิมพ์ เช่น ทดสอบระบบ PR คณะพยาบาลศาสตร์ ม.นเรศวร..."
                      value={customTestText}
                      onChange={(e) => setCustomTestText(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                    />
                    <button
                      type="button"
                      disabled={isTesting || !customTestText.trim()}
                      onClick={() => handleTestPing(customTestText.trim())}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>ยิงเข้า LINE</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit & Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                {saveSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>บันทึกการตั้งค่าเรียบร้อยแล้ว!</span>
                  </span>
                )}
                {formData.lastTestedAt && (
                  <span className="text-[11px] text-slate-400 block">
                    ทดสอบล่าสุด: {new Date(formData.lastTestedAt).toLocaleTimeString('th-TH')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTestPing()}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ทดสอบส่ง</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-md transition-all"
                >
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Right Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  ตัวอย่างข้อความบน LINE (Mobile Preview)
                </span>
              </div>
              <button
                onClick={copyPreview}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อความ'}</span>
              </button>
            </div>

            {/* LINE Mobile Bubble */}
            <div className="flex-1 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 overflow-y-auto max-h-[460px]">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 text-xs font-bold shadow-sm">
                  PR
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {formData.targetName || 'LINE Bot / PR Nurse NU'}
                  </span>
                  <div className="bg-white text-slate-900 rounded-2xl rounded-tl-sm p-3.5 text-xs shadow-md whitespace-pre-line leading-relaxed font-sans">
                    {previewMessage}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-300 space-y-1">
              <span className="font-semibold text-emerald-400 block">⚡ ระบบยิงข้อความแบบ Real-time:</span>
              <p className="text-slate-400">
                เมื่อผู้ขอยื่นแบบฟอร์ม หรือเจ้าหน้าที่ปรับสถานะงาน ข้อความรูปแบบนี้จะถูกส่งเข้าห้องแชท LINE อัตโนมัติทันที
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Notification Logs History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BellRing className="w-4 h-4 text-emerald-600" />
              <span>ประวัติการส่งแจ้งเตือน (Notification Logs History)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              บันทึกสถานะการส่งข้อความทั้งหมด พร้อมแสดงผลตอบกลับจริงจาก LINE
            </p>
          </div>

          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างประวัติ</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-80 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-8 text-center">
              ยังไม่มีประวัติการแจ้งเตือน
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      #{log.taskId}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {log.recipient}
                    </span>

                    {/* Status Badge */}
                    {log.status === 'sent' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>ส่งเข้า LINE สำเร็จจริง</span>
                      </span>
                    ) : log.status === 'simulated' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>โหมดจำลอง (Demo)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>ส่งไม่สำเร็จ ({log.errorDetail || 'Error'})</span>
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-1">
                    {log.message.split('\n')[0]}
                  </p>
                  {log.errorDetail && log.status === 'failed' && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 italic">
                      ⚠️ สาเหตุ: {log.errorDetail}
                    </p>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleString('th-TH')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
