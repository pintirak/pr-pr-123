import React, { useState } from 'react';
import { 
  BellRing, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Trash2, 
  RefreshCw, 
  Copy, 
  Check, 
  HelpCircle,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { LineNotificationSettings, NotificationLog } from '../types';
import { dispatchLineNotification, formatLineMessage } from '../utils/lineNotify';

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
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key: keyof LineNotificationSettings) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestPing = async () => {
    setTestStatus('sending');
    const result = await dispatchLineNotification('test', formData);
    onAddLog(result.log);
    setTestStatus('success');
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  const previewMessage = formatLineMessage('new_request', {
    id: 'PR-2025-EXAMPLE',
    title: 'ตัวอย่าง: ออกแบบโปสเตอร์ประชาสัมพันธ์งานสัปดาห์วิทยาศาสตร์',
    serviceType: 'poster',
    status: 'pending',
    urgency: 'urgent',
    department: 'คณะวิทยาศาสตร์และเทคโนโลยี',
    requesterName: 'คุณสุดารัตน์ พัฒนา',
    requesterPosition: 'หัวหน้างานประชาสัมพันธ์',
    requesterPhone: '081-234-5678',
    requesterEmail: 'sudarat.p@org.ac.th',
    neededDate: '2025-10-15',
    neededTime: '09:00',
    eventLocation: 'หอประชุมใหญ่',
    description: 'ต้องการโปสเตอร์ขนาด A3',
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              ระบบแจ้งเตือนผ่าน LINE (LINE Notification Integration)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              แจ้งเตือนเรียลไทม์เมื่อมีคำขอใหม่, อัปเดตสถานะงาน, หรือส่งมอบงานเสร็จสมบูรณ์
            </p>
          </div>
        </div>

        <button
          onClick={handleTestPing}
          disabled={testStatus === 'sending'}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>{testStatus === 'sending' ? 'กำลังส่ง...' : testStatus === 'success' ? 'ทดสอบสำเร็จ! 🎉' : 'ทดสอบส่งแจ้งเตือน (Test Ping)'}</span>
        </button>
      </div>

      {/* Two Column Grid: Settings Form & iPhone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  เปิดใช้งานระบบแจ้งเตือน LINE
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  ส่งการแจ้งเตือนไปยังผู้ดูแลระบบและผู้ขอรับบริการ
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

            {/* Token Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    LINE Notify Token หรือ Channel Access Token
                  </label>
                  <a
                    href="https://notify-bot.line.me/my/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>สร้าง Token จาก LINE</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  placeholder="ใส่ LINE Notify Token หรือใช้ค่า Default Demo"
                  value={formData.lineNotifyToken}
                  onChange={(e) => setFormData({ ...formData, lineNotifyToken: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  * หากใช้ Token เดโม ระบบจะจำลองและบันทึกประวัติข้อความใน Log ให้เห็นทันที
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  คำนำหน้าข้อความแจ้งเตือน (Custom Prefix)
                </label>
                <input
                  type="text"
                  placeholder="เช่น 📢 [PR SYSTEM การประชาสัมพันธ์]"
                  value={formData.customPrefix}
                  onChange={(e) => setFormData({ ...formData, customPrefix: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Event Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                เลือกเหตุการณ์ที่ต้องการให้แจ้งเตือน
              </label>

              {[
                { key: 'notifyOnNewRequest', title: 'เมื่อมีคำขอบริการใหม่', desc: 'แจ้งเตือนเข้ากลุ่มงาน PR ทันทีเมื่อผู้ขอยื่นแบบฟอร์ม' },
                { key: 'notifyOnStatusChange', title: 'เมื่อมีการเปลี่ยนสถานะงาน', desc: 'เช่น มอบหมายงานแล้ว, เริ่มผลิต, ส่งแบบร่าง' },
                { key: 'notifyOnDelivery', title: 'เมื่อส่งมอบชิ้นงานสำเร็จ', desc: 'แจ้งเตือนพร้อมแนบลิงก์ดาวน์โหลดผลงานให้ผู้ขอ' },
                { key: 'notifyOnUrgent', title: 'แจ้งเตือนพิเศษสำหรับงานด่วน/ด่วนพิเศษ', desc: 'ติดแท็ก 🚨 และไฮไลต์ความเร่งด่วนเป็นกรณีพิเศษ' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
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

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {saveSuccess && '✓ บันทึกการตั้งค่าเรียบร้อยแล้ว'}
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all"
              >
                บันทึกการตั้งค่า
              </button>
            </div>

          </form>
        </div>

        {/* iPhone Style LINE Message Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  LINE Preview (มุมมองบนมือถือ)
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

            {/* Chat Bubble Container (iOS LINE Look) */}
            <div className="flex-1 bg-slate-800/70 p-3.5 rounded-2xl border border-slate-700/60 overflow-y-auto max-h-96">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 text-xs font-bold">
                  PR
                </div>
                <div className="flex-1 bg-white text-slate-900 rounded-2xl rounded-tl-sm p-3.5 text-xs shadow-md space-y-1.5 whitespace-pre-line leading-relaxed font-sans">
                  {previewMessage}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 text-center">
              * ข้อความนี้จะถูกจัดรูปแบบและส่งไปยังห้องแชต LINE Notify หรือ LINE Official อัตโนมัติ
            </p>
          </div>
        </div>

      </div>

      {/* Notification Logs History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BellRing className="w-4 h-4 text-blue-600" />
              <span>ประวัติการส่งแจ้งเตือน (Notification Logs)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              บันทึกทุกการแจ้งเตือนที่เกิดขึ้นในระบบ
            </p>
          </div>

          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
                <div className="space-y-0.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      #{log.taskId}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {log.recipient}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ● {log.status === 'sent' ? 'ส่งจริง (LINE)' : 'จำลองสำเร็จ (Simulated)'}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-1">
                    {log.message.split('\n')[0]}
                  </p>
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
