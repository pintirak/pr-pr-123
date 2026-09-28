import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  Camera, 
  Share2, 
  Newspaper, 
  Video, 
  Printer, 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Paperclip, 
  Sparkles, 
  Flame,
  Send,
  Link2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRRequest, PRServiceType, PRUrgency } from '../types';
import { PR_SERVICES_CONFIG, DEPARTMENTS_LIST, NURSE_NU_DEPARTMENT_GROUPS, URGENCY_CONFIG } from '../data/initialData';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRequest: Omit<PRRequest, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'deliverables'>) => void;
}

const SERVICE_ICONS: Record<PRServiceType, React.ElementType> = {
  poster: Palette,
  photo: Camera,
  facebook: Share2,
  press: Newspaper,
  video_edit: Video,
  print_media: Printer,
};

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [serviceType, setServiceType] = useState<PRServiceType>('poster');
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState<PRUrgency>('normal');
  const [department, setDepartment] = useState(DEPARTMENTS_LIST[0]);
  const [customDept, setCustomDept] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterPosition, setRequesterPosition] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [lineId, setLineId] = useState('');
  const [neededDate, setNeededDate] = useState('');
  const [neededTime, setNeededTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [description, setDescription] = useState('');

  // Specs
  const [dimensions, setDimensions] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [colorTone, setColorTone] = useState('');
  const [contentDraft, setContentDraft] = useState('');
  const [referenceLink, setReferenceLink] = useState('');

  // Attachment names simulated
  const [attachmentName, setAttachmentName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !requesterName.trim() || !neededDate) return;

    const finalDept = department === 'อื่นๆ (ระบุเอง)' ? customDept || 'หน่วยงานทั่วไป' : department;

    const attachments = attachmentName.trim()
      ? [
          {
            id: `att-${Date.now()}`,
            name: attachmentName.trim(),
            url: '#',
            size: 'ไฟล์แนบ',
          },
        ]
      : [];

    onSubmit({
      title: title.trim(),
      serviceType,
      status: 'pending',
      urgency,
      department: finalDept,
      requesterName: requesterName.trim(),
      requesterPosition: requesterPosition.trim(),
      requesterPhone: requesterPhone.trim(),
      requesterEmail: requesterEmail.trim() || `${requesterName.replace(/\s+/g, '').toLowerCase()}@organization.ac.th`,
      lineId: lineId.trim() || undefined,
      neededDate,
      neededTime: neededTime.trim() || undefined,
      eventLocation: eventLocation.trim() || undefined,
      description: description.trim() || `ขอรับบริการ ${PR_SERVICES_CONFIG[serviceType].label}`,
      specs: {
        dimensions: dimensions.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined,
        colorTone: colorTone.trim() || undefined,
        contentDraft: contentDraft.trim() || undefined,
        referenceLinks: referenceLink.trim() ? [referenceLink.trim()] : undefined,
      },
      attachments,
    });

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/90 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                แบบฟอร์มขอรับบริการงานประชาสัมพันธ์
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PR Service Request Form • จัดการงานผลิตและสื่อสารองค์กร
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Step 1: Select Service Category */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              1. เลือกประเภทบริการที่ต้องการ (Service Type)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(PR_SERVICES_CONFIG) as PRServiceType[]).map((type) => {
                const config = PR_SERVICES_CONFIG[type];
                const Icon = SERVICE_ICONS[type];
                const isSelected = serviceType === type;

                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setServiceType(type)}
                    className={`flex flex-col items-start p-3 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-2 border-blue-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mb-2 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {config.label}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                      {config.sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Main Task Information */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              2. รายละเอียดงานและกำหนดส่ง
            </label>

            {/* Task Title */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                หัวข้อ / ชื่องานที่ต้องการประชาสัมพันธ์ *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ออกแบบโปสเตอร์ประชาสัมพันธ์โครงการรับสมัครนักศึกษาใหม่ 2568"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Urgency Picker (iOS Segmented Style) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                ระดับความเร่งด่วน *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'urgent', 'express'] as PRUrgency[]).map((u) => {
                  const cfg = URGENCY_CONFIG[u];
                  const isSelected = urgency === u;
                  return (
                    <button
                      type="button"
                      key={u}
                      onClick={() => setUrgency(u)}
                      className={`p-2.5 rounded-2xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? u === 'express'
                            ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-300'
                            : 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                          : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {u === 'express' && <Flame className="w-3.5 h-3.5" />}
                        {cfg.label}
                      </span>
                      <span className="text-[10px] opacity-80 mt-0.5">{cfg.sublabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Needed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  วันที่ต้องการใช้งาน / วันที่จัดงาน *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={neededDate}
                    onChange={(e) => setNeededDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  เวลา (ถ้ามี เช่น เวลาเริ่มถ่ายภาพ)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="เช่น 09:00 - 12:00 น."
                    value={neededTime}
                    onChange={(e) => setNeededTime(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Location (Optional) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                สถานที่จัดกิจกรรม / หน้างาน (สำหรับการถ่ายภาพหรือลงพื้นที่)
              </label>
              <input
                type="text"
                placeholder="เช่น ห้องประชุมใหญ่ อาคารอำนวยการ หรือ ลานอเนกประสงค์"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                รายละเอียดคำขอ วัตถุประสงค์ และข้อความหลักที่ต้องการสื่อสาร
              </label>
              <textarea
                rows={3}
                placeholder="ระบุข้อความ กำหนดการ หรือสิ่งสำคัญที่ต้องการให้ทีม PR ทราบ..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Step 3: Technical Specs (Dimensions, Tone, Links) */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              3. สเปกงานเพิ่มเติม (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  ขนาดชิ้นงาน (Dimensions)
                </label>
                <input
                  type="text"
                  placeholder="เช่น A4, 1080x1080px, ป้าย 4x2 เมตร"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  โทนสี / ธีมงาน (Color / Mood)
                </label>
                <input
                  type="text"
                  placeholder="เช่น โทนสีทอง-กรมท่า, สดใส วัยรุ่น"
                  value={colorTone}
                  onChange={(e) => setColorTone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  กลุ่มเป้าหมาย (Target Audience)
                </label>
                <input
                  type="text"
                  placeholder="เช่น นักศึกษา, ประชาชนทั่วไป, ผู้บริหาร"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  ลิงก์ไฟล์แนบ / Google Drive / ตัวอย่าง
                </label>
                <div className="relative">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Requester & Department Contact */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              4. ข้อมูลหลักสูตร / หน่วยงาน และผู้ประสานงาน
            </label>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  หลักสูตร / หน่วยงาน / บริการวิชาการ (คณะพยาบาลศาสตร์ ม.นเรศวร) *
                </label>
                <a
                  href="https://www.nurse.nu.ac.th/index.html/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>nurse.nu.ac.th</span>
                </a>
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {NURSE_NU_DEPARTMENT_GROUPS.map((grp) => (
                  <optgroup key={grp.groupName} label={`━━ ${grp.groupName} ━━`} className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-900">
                    {grp.items.map((item) => (
                      <option key={item} value={item} className="font-normal text-slate-800 dark:text-slate-200 py-1 bg-white dark:bg-slate-800">
                        {item}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <optgroup label="━━ อื่นๆ ━━" className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-900">
                  <option value="อื่นๆ (ระบุเอง)" className="font-normal text-slate-800 dark:text-slate-200 py-1 bg-white dark:bg-slate-800">
                    อื่นๆ (ระบุเอง)
                  </option>
                </optgroup>
              </select>
            </div>

            {department === 'อื่นๆ (ระบุเอง)' && (
              <div>
                <input
                  type="text"
                  placeholder="พิมพ์ระบุชื่อหลักสูตร หรือหน่วยงานของคุณ..."
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อ-นามสกุล ผู้ขอรับบริการ *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="เช่น คุณสมศรี เจริญพร"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  ตำแหน่ง
                </label>
                <input
                  type="text"
                  placeholder="เช่น นักวิชาการศึกษา, เจ้าหน้าที่ธุรการ"
                  value={requesterPosition}
                  onChange={(e) => setRequesterPosition(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  เบอร์โทรศัพท์ที่ติดต่อได้ *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="เช่น 081-234-5678"
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  LINE ID (เพื่อรับการแจ้งเตือนความคืบหน้า)
                </label>
                <input
                  type="text"
                  placeholder="เช่น som_sri_pr"
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>ยื่นคำขอรับบริการ (พร้อมส่งแจ้งเตือน LINE)</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
