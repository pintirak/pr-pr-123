import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Paperclip, 
  Send, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Bell, 
  Trash2,
  ExternalLink,
  ChevronRight,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';
import { PRRequest, PRStaff, PRTaskStatus, TaskDeliverable } from '../types';
import { PR_SERVICES_CONFIG, STATUS_CONFIG, URGENCY_CONFIG, PR_STAFF_LIST } from '../data/initialData';

interface TaskDetailModalProps {
  task: PRRequest | null;
  onClose: () => void;
  onUpdateStatus: (taskId: string, newStatus: PRTaskStatus, note?: string) => void;
  onAssignStaff: (taskId: string, staff: PRStaff | null) => void;
  onAddTimelineNote: (taskId: string, note: string) => void;
  onAddDeliverable: (taskId: string, deliverable: TaskDeliverable) => void;
  onTriggerLineAlert: (task: PRRequest, customNote?: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onUpdateStatus,
  onAssignStaff,
  onAddTimelineNote,
  onAddDeliverable,
  onTriggerLineAlert,
  onDeleteTask,
}) => {
  const [newNote, setNewNote] = useState('');
  const [showDeliverableForm, setShowDeliverableForm] = useState(false);
  const [deliverableName, setDeliverableName] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableNote, setDeliverableNote] = useState('');
  const [lineAlertSuccess, setLineAlertSuccess] = useState(false);

  if (!task) return null;

  const service = PR_SERVICES_CONFIG[task.serviceType];
  const status = STATUS_CONFIG[task.status];
  const urgency = URGENCY_CONFIG[task.urgency];

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddTimelineNote(task.id, newNote.trim());
    setNewNote('');
  };

  const handleDeliverableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableName.trim() || !deliverableUrl.trim()) return;
    onAddDeliverable(task.id, {
      id: `del-${Date.now()}`,
      name: deliverableName.trim(),
      url: deliverableUrl.trim(),
      date: new Date().toISOString().split('T')[0],
      note: deliverableNote.trim() || undefined,
    });
    setDeliverableName('');
    setDeliverableUrl('');
    setDeliverableNote('');
    setShowDeliverableForm(false);
  };

  const handleSendLine = () => {
    onTriggerLineAlert(task, newNote.trim() || undefined);
    setLineAlertSuccess(true);
    setTimeout(() => setLineAlertSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Sheet Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/90 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold ${service.badgeBg} ${service.badgeText}`}>
              {service.label}
            </span>
            <span className="font-mono text-xs font-medium text-slate-400 dark:text-slate-500">
              #{task.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendLine}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                lineAlertSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/50'
              }`}
              title="ส่งข้อความแจ้งเตือนผ่าน LINE ถึงทีมงานและผู้ขอ"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{lineAlertSuccess ? 'ส่ง LINE สำเร็จ!' : 'แจ้งเตือน LINE'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Title & Status Bar */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${urgency.badgeClass}`}>
                {task.urgency === 'express' ? '🔥 ด่วนพิเศษ 24 ชม.' : `ความเร่งด่วน: ${urgency.label}`}
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.badgeClass}`}>
                <span className={`w-2 h-2 rounded-full ${status.dotClass}`} />
                <span>{status.label}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {task.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              ยื่นคำขอเมื่อ {new Date(task.createdAt).toLocaleString('th-TH')} • อัปเดตล่าสุด {new Date(task.updatedAt).toLocaleString('th-TH')}
            </p>
          </div>

          {/* Quick Status Advance Workflow */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              ปรับเปลี่ยนสถานะการดำเนินงาน (Status Workflow)
            </label>
            <div className="flex flex-wrap gap-2">
              {(['pending', 'in_progress', 'review', 'revision', 'completed', 'cancelled'] as PRTaskStatus[]).map((st) => {
                const isCurrent = task.status === st;
                const cfg = STATUS_CONFIG[st];
                return (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(task.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/40'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two Columns: Details & Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Requester & Schedule Info */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  ข้อมูลผู้ขอรับบริการ & กำหนดการ
                </h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{task.requesterName}</span>
                    {task.requesterPosition && (
                      <span className="text-slate-500 dark:text-slate-400">({task.requesterPosition})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">{task.department}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <a href={`tel:${task.requesterPhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {task.requesterPhone}
                    </a>
                    {task.lineId && (
                      <span className="text-slate-400 ml-2">LINE: <strong>{task.lineId}</strong></span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">{task.requesterEmail}</span>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      ต้องการใช้งาน: {new Date(task.neededDate).toLocaleDateString('th-TH')}
                      {task.neededTime ? ` เวลา ${task.neededTime}` : ''}
                    </span>
                  </div>

                  {task.eventLocation && (
                    <div className="text-slate-600 dark:text-slate-400">
                      📍 สถานที่: {task.eventLocation}
                    </div>
                  )}
                </div>
              </div>

              {/* Scope & Description */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  รายละเอียดและวัตถุประสงค์
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {task.description}
                </p>

                {/* Specs */}
                {task.specs && Object.keys(task.specs).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    {task.specs.dimensions && (
                      <div><strong className="text-slate-600 dark:text-slate-400">สเปกขนาด:</strong> {task.specs.dimensions}</div>
                    )}
                    {task.specs.targetAudience && (
                      <div><strong className="text-slate-600 dark:text-slate-400">กลุ่มเป้าหมาย:</strong> {task.specs.targetAudience}</div>
                    )}
                    {task.specs.colorTone && (
                      <div><strong className="text-slate-600 dark:text-slate-400">โทนสี/ธีม:</strong> {task.specs.colorTone}</div>
                    )}
                    {task.specs.contentDraft && (
                      <div><strong className="text-slate-600 dark:text-slate-400">ร่างเนื้อหา/แคปชัน:</strong> {task.specs.contentDraft}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Attachments */}
              {task.attachments.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    ไฟล์แนบจากผู้ขอ ({task.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {task.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{att.name}</span>
                          {att.size && <span className="text-slate-400 text-[10px]">({att.size})</span>}
                        </div>
                        {att.url && att.url !== '#' && (
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 ml-2"
                          >
                            <span>เปิด</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Assigned Staff, Deliverables & Timeline */}
            <div className="space-y-4">
              
              {/* Assign Staff */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ผู้รับผิดชอบงาน PR
                  </h4>
                  {task.assignedStaff && (
                    <button
                      onClick={() => onAssignStaff(task.id, null)}
                      className="text-[11px] text-slate-400 hover:text-rose-500"
                    >
                      ยกเลิกมอบหมาย
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {PR_STAFF_LIST.map((staff) => {
                    const isAssigned = task.assignedStaff?.id === staff.id;
                    return (
                      <button
                        key={staff.id}
                        onClick={() => onAssignStaff(task.id, staff)}
                        className={`relative flex items-center gap-2.5 p-2.5 rounded-2xl text-left transition-all ${
                          isAssigned
                            ? 'bg-blue-50 dark:bg-blue-950/70 border-2 border-blue-500 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 flex-shrink-0"
                        />
                        <div className="overflow-hidden flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {staff.name}
                            </p>
                            {isAssigned && (
                              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.5 rounded-full ml-1">
                                รับผิดชอบ
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {staff.role}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deliverables (ชิ้นงานที่ส่งมอบ) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ชิ้นงานที่ส่งมอบ (Deliverables)
                  </h4>
                  <button
                    onClick={() => setShowDeliverableForm(!showDeliverableForm)}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มผลงาน</span>
                  </button>
                </div>

                {showDeliverableForm && (
                  <form onSubmit={handleDeliverableSubmit} className="p-3 mb-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-2 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        ชื่อไฟล์ / หัวข้อผลงาน
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น ไฟล์โปสเตอร์ Hi-Res หรือ ลิงก์อัลบั้ม Google Drive"
                        value={deliverableName}
                        onChange={(e) => setDeliverableName(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        URL / ลิงก์ดาวน์โหลด
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={deliverableUrl}
                        onChange={(e) => setDeliverableUrl(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowDeliverableForm(false)}
                        className="px-2.5 py-1 text-slate-500"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold"
                      >
                        บันทึกผลงาน
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {task.deliverables.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      ยังไม่มีการส่งมอบไฟล์งาน สามารถเพิ่มลิงก์ Google Drive, Canva, หรือไฟล์สำเร็จได้
                    </p>
                  ) : (
                    task.deliverables.map((del) => (
                      <div
                        key={del.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{del.name}</p>
                            <p className="text-[10px] text-slate-500">ส่งมอบเมื่อ: {del.date}</p>
                          </div>
                        </div>
                        <a
                          href={del.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <span>เปิดดู</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Timeline Notes */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  บันทึกประวัติการทำงาน (Timeline & Notes)
                </h4>

                {/* Add Note Input */}
                <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="พิมพ์บันทึกความคืบหน้า..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>บันทึก</span>
                  </button>
                </form>

                {/* Timeline List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {task.timeline.map((item, idx) => (
                    <div key={item.id} className="relative pl-5 text-xs border-l-2 border-blue-200 dark:border-blue-900 pb-2">
                      <div className="absolute -left-[5px] top-0.5 w-2 h-2 rounded-full bg-blue-500" />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.action}</span>
                        <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleString('th-TH')}</span>
                      </div>
                      {item.note && (
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{item.note}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-0.5">โดย: {item.author}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                if (confirm(`ยืนยันการลบคำขอ #${task.id} (${task.title}) หรือไม่?`)) {
                  onDeleteTask(task.id);
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>ลบรายการนี้</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90"
            >
              ปิดหน้าต่าง
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
