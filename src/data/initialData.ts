import { PRRequest, PRServiceType, PRStaff, PRTaskStatus, PRUrgency, LineNotificationSettings } from '../types';

export const PR_SERVICES_CONFIG: Record<
  PRServiceType,
  {
    label: string;
    sublabel: string;
    iconName: string;
    colorLight: string;
    colorDark: string;
    badgeBg: string;
    badgeText: string;
    accentColor: string;
    estimatedDays: number;
    description: string;
  }
> = {
  poster: {
    label: 'ออกแบบโปสเตอร์ / กราฟิก',
    sublabel: 'Poster & Infographic Design',
    iconName: 'Palette',
    colorLight: 'bg-rose-50 text-rose-600 border-rose-200',
    colorDark: 'dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    accentColor: '#f43f5e',
    estimatedDays: 3,
    description: 'โปสเตอร์ประชาสัมพันธ์หลักสูตร, แบนเนอร์สื่อสารกิจกรรมคณะ, อินโฟกราฟิกความรู้สุขภาพ',
  },
  photo: {
    label: 'ถ่ายภาพนิ่ง / กิจกรรม',
    sublabel: 'Event Photography & Studio',
    iconName: 'Camera',
    colorLight: 'bg-amber-50 text-amber-600 border-amber-200',
    colorDark: 'dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    accentColor: '#f59e0b',
    estimatedDays: 2,
    description: 'บันทึกภาพพิธีมอบหมวกและเข็มพยาบาล, พิธีการคณะ, กิจกรรมบริการวิชาการ, ภาพผู้บริหารและอาจารย์',
  },
  facebook: {
    label: 'ลงข่าวประชาสัมพันธ์ Facebook',
    sublabel: 'FB News & Social Post',
    iconName: 'Share2',
    colorLight: 'bg-blue-50 text-blue-600 border-blue-200',
    colorDark: 'dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    accentColor: '#3b82f6',
    estimatedDays: 1,
    description: 'ร่างบทความข่าวประชาสัมพันธ์เพจคณะพยาบาลศาสตร์, แคปชัน Facebook, ตรวจทานเนื้อหาและกำหนดเวลาเผยแพร่',
  },
  press: {
    label: 'งานแถลงข่าว / สื่อมวลชน',
    sublabel: 'Press Release & Media Relations',
    iconName: 'Newspaper',
    colorLight: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    colorDark: 'dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    accentColor: '#6366f1',
    estimatedDays: 4,
    description: 'ส่งข่าวแจกสื่อมวลชน (Press Release), ข่าวผลงานวิจัยทางการพยาบาลและบริการวิชาการสู่สาธารณะ',
  },
  video_edit: {
    label: 'ถ่ายทำ & ตัดต่อวิดีโอ',
    sublabel: 'Video Production & Reels/TikTok',
    iconName: 'Video',
    colorLight: 'bg-purple-50 text-purple-600 border-purple-200',
    colorDark: 'dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    accentColor: '#a855f7',
    estimatedDays: 5,
    description: 'วิดีโอแนะนำหลักสูตรพยาบาล, วิดีโอสรุปกิจกรรม (Highlight), วิดีโอให้ความรู้การดูแลสุขภาพ TikTok/Reels',
  },
  print_media: {
    label: 'สื่อสิ่งพิมพ์ / ไวนิล / สูจิบัตร',
    sublabel: 'Print Media & Exhibition',
    iconName: 'Printer',
    colorLight: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    colorDark: 'dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    accentColor: '#10b981',
    estimatedDays: 4,
    description: 'ป้ายไวนิลฉากเวทีสัมมนาวิชาการ, แผ่นพับหลักสูตร, สูจิบัตรการประชุมวิชาการพยาบาล, ป้าย Roll-up',
  },
};

export const STATUS_CONFIG: Record<
  PRTaskStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    step: number;
    description: string;
  }
> = {
  pending: {
    label: 'รอดำเนินการ',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
    dotClass: 'bg-amber-500',
    step: 1,
    description: 'ได้รับแบบฟอร์มคำขอแล้ว รอเจ้าหน้าที่ PR ตรวจสอบและมอบหมายงาน',
  },
  in_progress: {
    label: 'กำลังดำเนินการ',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
    dotClass: 'bg-blue-500 animate-pulse',
    step: 2,
    description: 'ทีม PR กำลังผลิตสื่อ ออกแบบ หรือเตรียมลงพื้นที่ถ่ายภาพ',
  },
  review: {
    label: 'รอตรวจรับงาน',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
    dotClass: 'bg-purple-500',
    step: 3,
    description: 'ส่งมอบชิ้นงานแบบร่าง (Draft) ให้ผู้ขอดำเนินการตรวจสอบ',
  },
  revision: {
    label: 'กำลังแก้ไข',
    badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800/40',
    dotClass: 'bg-orange-500',
    step: 3,
    description: 'กำลังปรับแก้ตามข้อเสนอแนะของผู้ขอรับบริการ',
  },
  completed: {
    label: 'เสร็จสมบูรณ์',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
    dotClass: 'bg-emerald-500',
    step: 4,
    description: 'ส่งมอบไฟล์ต้นฉบับคุณภาพสูงเรียบร้อยแล้ว',
  },
  cancelled: {
    label: 'ยกเลิกคำขอ',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    dotClass: 'bg-slate-400',
    step: 0,
    description: 'ยกเลิกโดยผู้ขอหรือเหตุสุดวิสัย',
  },
};

export const URGENCY_CONFIG: Record<
  PRUrgency,
  {
    label: string;
    badgeClass: string;
    sublabel: string;
  }
> = {
  normal: {
    label: 'ปกติ',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    sublabel: '5-7 วันทำการ',
  },
  urgent: {
    label: 'ด่วน',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    sublabel: '2-3 วันทำการ',
  },
  express: {
    label: 'ด่วนพิเศษ 24ชม.',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 font-semibold animate-pulse',
    sublabel: 'ภายใน 24 ชม.',
  },
};

/**
 * คณะทำงานที่ทำ PR (กำหนด 2 คนตามโครงสร้างงานประชาสัมพันธ์)
 */
export const PR_STAFF_LIST: PRStaff[] = [
  {
    id: 'staff-1',
    name: 'กวินทรา สิทธิผล (นุ่น)',
    role: 'นักประชาสัมพันธ์ / งานสื่อสารองค์กร คณะพยาบาลศาสตร์ ม.นเรศวร',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'staff-2',
    name: 'ธนกฤต วรโชติ (บอส)',
    role: 'นักวิชาการโสตทัศนศึกษา / กราฟิกและสื่อดิจิทัล คณะพยาบาลศาสตร์ ม.นเรศวร',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

/**
 * โครงสร้างหน่วยงาน หลักสูตร และบริการวิชาการ
 * อ้างอิงจาก คณะพยาบาลศาสตร์ มหาวิทยาลัยนเรศวร (https://www.nurse.nu.ac.th/)
 */
export interface DepartmentGroup {
  groupName: string;
  items: string[];
}

export const NURSE_NU_DEPARTMENT_GROUPS: DepartmentGroup[] = [
  {
    groupName: 'หลักสูตร (Academic Programs)',
    items: [
      'หลักสูตรพยาบาลศาสตรบัณฑิต (ปริญญาตรี)',
      'หลักสูตรพยาบาลศาสตรมหาบัณฑิต สาขาการพยาบาลผู้ใหญ่และผู้สูงอายุ (ปริญญาโท)',
      'หลักสูตรพยาบาลศาสตรมหาบัณฑิต สาขาการบริหารการพยาบาล (ปริญญาโท)',
      'หลักสูตรพยาบาลศาสตรมหาบัณฑิต สาขาการพยาบาลเวชปฏิบัติชุมชน (ปริญญาโท)',
      'หลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาพยาบาลศาสตร์ (ปริญญาเอก)',
      'โรงเรียนผู้ช่วยพยาบาล (หลักสูตรประกาศนียบัตรผู้ช่วยพยาบาล)',
      'หลักสูตรฝึกอบรมการพยาบาลเฉพาะทาง / อบรมระยะสั้น',
    ],
  },
  {
    groupName: 'บริการวิชาการ & ศูนย์บริการ (Academic Services & Centers)',
    items: [
      'งานบริการวิชาการแก่สังคม',
      'ศูนย์พัฒนาเด็กปฐมวัย คณะพยาบาลศาสตร์ มหาวิทยาลัยนเรศวร',
      'ศูนย์เรียนรู้และฟื้นฟูสุขภาพ คณะพยาบาลศาสตร์',
      'โครงการสัมมนาและการประชุมวิชาการพยาบาล',
    ],
  },
  {
    groupName: 'สำนักงานเลขานุการ & งานสนับสนุนคณะ',
    items: [
      'สำนักงานเลขานุการคณะพยาบาลศาสตร์',
      'งานบริการการศึกษาและพัฒนาหลักสูตร',
      'งานกิจการนิสิตและศิษย์เก่าสัมพันธ์',
      'งานวิจัย นวัตกรรม และบริการวิชาการ',
      'งานนโยบายและแผน',
      'งานบริหารทั่วไปและธุรการ',
      'งานการเงิน บัญชีและพัสดุ',
      'งานห้องปฏิบัติการพยาบาล (Nursing Simulation Lab)',
      'สำนักงานคณบดีและผู้บริหารคณะพยาบาลศาสตร์',
    ],
  },
];

export const DEPARTMENTS_LIST: string[] = NURSE_NU_DEPARTMENT_GROUPS.flatMap((g) => g.items);

export const INITIAL_LINE_SETTINGS: LineNotificationSettings = {
  enabled: true,
  provider: 'line_notify',
  lineNotifyToken: 'DEMO_LINE_NOTIFY_TOKEN_PR_SYSTEM',
  webhookUrl: '',
  channelAccessToken: '',
  targetType: 'group',
  targetName: 'กลุ่มงาน PR คณะพยาบาลศาสตร์ ม.นเรศวร',
  notifyOnNewRequest: true,
  notifyOnStatusChange: true,
  notifyOnDelivery: true,
  notifyOnUrgent: true,
  customPrefix: '📢 [PR SYSTEM คณะพยาบาลศาสตร์ ม.นเรศวร]',
};

export const INITIAL_PR_REQUESTS: PRRequest[] = [
  {
    id: 'PR-2025-001',
    title: 'ออกแบบโปสเตอร์และแบนเนอร์รับสมัครนิสิตใหม่ หลักสูตรพยาบาลศาสตรบัณฑิต 2568',
    serviceType: 'poster',
    status: 'in_progress',
    urgency: 'urgent',
    department: 'หลักสูตรพยาบาลศาสตรบัณฑิต (ปริญญาตรี)',
    requesterName: 'ผศ.ดร. รัตนาภรณ์ มงคลสวัสดิ์',
    requesterPosition: 'ประธานหลักสูตรพยาบาลศาสตรบัณฑิต',
    requesterPhone: '081-987-6543',
    requesterEmail: 'rattanaporn.m@nurse.nu.ac.th',
    lineId: 'rattana_nurse',
    neededDate: '2025-10-05',
    neededTime: '10:00',
    description: 'ต้องการโปสเตอร์ขนาด A3 สำหรับจัดพิมพ์ และรูปภาพโปรโมตลง Facebook เพจคณะ (1080x1080px) และ IG Story (1080x1920px) ธีม Modern Smart Nursing สีเขียวพยาบาล-ฟ้ามหาวิทยาลัยนเรศวร พร้อม QR Code สมัครผ่าน TCAS ม.นเรศวร',
    specs: {
      dimensions: 'A3 (พิมพ์) + 1080x1080px (FB) + 1080x1920px (Story)',
      targetAudience: 'นักเรียนชั้นมัธยมศึกษาปีที่ 6 ครูแนะแนว และผู้ปกครอง',
      colorTone: 'สีเขียวพยาบาล (Nursing Green) และสีส้ม-เทา ม.นเรศวร',
      contentDraft: 'รับสมัครนิสิตใหม่ TCAS รอบที่ 1 Portfolio คณะพยาบาลศาสตร์ มหาวิทยาลัยนเรศวร มุ่งสู่พยาบาลวิชาชีพชั้นนำระดับสากล',
      referenceLinks: ['https://www.nurse.nu.ac.th/index.html/'],
    },
    attachments: [
      {
        id: 'att-1',
        name: 'โลโก้คณะพยาบาลศาสตร์_NU_Vector.png',
        size: '1.2 MB',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        type: 'image/png',
      },
      {
        id: 'att-2',
        name: 'เกณฑ์การรับสมัครTCAS_พยาบาลศาสตร์_มร.pdf',
        size: '420 KB',
        url: '#',
        type: 'application/pdf',
      },
    ],
    assignedStaff: PR_STAFF_LIST[1], // ธนกฤต วรโชติ (บอส)
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2025-09-12T09:15:00Z',
        action: 'ยื่นคำขอรับบริการงานประชาสัมพันธ์',
        note: 'ยื่นคำขอผ่านระบบออนไลน์ พร้อมแนบเกณฑ์การรับสมัครและโลโก้คณะ',
        author: 'ผศ.ดร. รัตนาภรณ์ มงคลสวัสดิ์',
      },
      {
        id: 'tl-2',
        timestamp: '2025-09-12T10:30:00Z',
        action: 'รับเรื่องและมอบหมายงาน',
        note: 'ตรวจสอบรายละเอียดและมอบหมายให้นักออกแบบกราฟิกเริ่มจัดทำแบบร่างแบนเนอร์',
        author: 'กวินทรา สิทธิผล (นุ่น)',
      },
      {
        id: 'tl-3',
        timestamp: '2025-09-13T14:00:00Z',
        action: 'เริ่มออกแบบ Layout ร่างแรก',
        note: 'กำลังจัดวางองค์ประกอบโทนสีเขียวพยาบาลและสร้าง QR Code ลิงก์ระบบรับสมัคร',
        author: 'ธนกฤต วรโชติ (บอส)',
      },
    ],
    deliverables: [],
    createdAt: '2025-09-12T09:15:00Z',
    updatedAt: '2025-09-13T14:00:00Z',
  },
  {
    id: 'PR-2025-002',
    title: 'ถ่ายภาพพิธีมอบหมวกและเข็มวิทยฐานะ นิสิตพยาบาลศาสตร์ ประจำปีการศึกษา 2568',
    serviceType: 'photo',
    status: 'completed',
    urgency: 'normal',
    department: 'งานกิจการนิสิตและศิษย์เก่าสัมพันธ์',
    requesterName: 'คุณกิตติศักดิ์ พรหมทัศน์',
    requesterPosition: 'หัวหน้างานกิจการนิสิต',
    requesterPhone: '089-123-4567',
    requesterEmail: 'kittisak.p@nurse.nu.ac.th',
    lineId: 'kittisak_nu_nurse',
    neededDate: '2025-09-10',
    neededTime: '08:30 - 12:30 น.',
    eventLocation: 'ห้องประชุมเอกาทศรถ คณะพยาบาลศาสตร์ มหาวิทยาลัยนเรศวร',
    description: 'ถ่ายภาพพิธีมอบหมวกและเข็มวิทยฐานะแก่นิสิตพยาบาลชั้นปีที่ 2 มีคณบดี คณาจารย์ และผู้ปกครองเข้าร่วม ต้องการภาพพิธีการ ภาพตอนรับหมวกรายบุคคล ภาพหมู่รุ่น และภาพบรรยากาศแสดงความยินดี',
    specs: {
      estimatedShots: 300,
      targetAudience: 'นิสิต ผู้ปกครอง คณาจารย์ และแฟนเพจคณะพยาบาลศาสตร์',
    },
    attachments: [
      {
        id: 'att-3',
        name: 'กำหนดการพิธีมอบหมวกพยาบาล_2568.pdf',
        size: '210 KB',
        url: '#',
        type: 'application/pdf',
      },
    ],
    assignedStaff: PR_STAFF_LIST[0], // กวินทรา สิทธิผล (นุ่น)
    timeline: [
      {
        id: 'tl-4',
        timestamp: '2025-09-08T11:00:00Z',
        action: 'ยื่นคำขอรับบริการถ่ายภาพ',
        author: 'คุณกิตติศักดิ์ พรหมทัศน์',
      },
      {
        id: 'tl-5',
        timestamp: '2025-09-08T13:20:00Z',
        action: 'มอบหมายช่างภาพลงพื้นที่',
        note: 'เตรียมกล้อง เลนส์พอร์ตเทรต และจัดทีมถ่ายภาพในหอประชุม',
        author: 'กวินทรา สิทธิผล (นุ่น)',
      },
      {
        id: 'tl-6',
        timestamp: '2025-09-10T12:30:00Z',
        action: 'ถ่ายภาพกิจกรรมเสร็จสิ้น',
        note: 'นำไฟล์เข้าสู่ขั้นตอนคัดเลือกและปรับแต่งเกรดสี',
        author: 'กวินทรา สิทธิผล (นุ่น)',
      },
      {
        id: 'tl-7',
        timestamp: '2025-09-11T16:00:00Z',
        action: 'ส่งมอบอัลบั้มภาพคุณภาพสูง',
        note: 'อัปโหลดภาพจำนวน 240 ภาพขึ้น Google Drive จัดแบ่งโฟลเดอร์พิธีการและภาพบรรยากาศ',
        author: 'กวินทรา สิทธิผล (นุ่น)',
      },
    ],
    deliverables: [
      {
        id: 'del-1',
        name: 'อัลบั้มภาพพิธีมอบหมวกพยาบาล_ม.นเรศวร_2568 (Google Drive)',
        url: 'https://drive.google.com/drive/folders/demo-nurse-nu-ceremony',
        date: '2025-09-11',
        note: 'จำนวน 240 ภาพ พร้อมไฟล์ขนาดเต็มและขนาดย่อสำหรับโซเชียล',
      },
    ],
    feedback: {
      rating: 5,
      comment: 'ภาพสวย คมชัด เก็บจังหวะประทับใจของนิสิตและคณาจารย์ได้ครบถ้วนมาก ขอบคุณทีมงาน PR คณะพยาบาลศาสตร์ครับ',
      submittedAt: '2025-09-12T08:30:00Z',
    },
    createdAt: '2025-09-08T11:00:00Z',
    updatedAt: '2025-09-11T16:00:00Z',
  },
  {
    id: 'PR-2025-003',
    title: 'ลงข่าวประชาสัมพันธ์ Facebook: โครงการบริการวิชาการตรวจคัดกรองสุขภาพผู้สูงอายุในชุมชน',
    serviceType: 'facebook',
    status: 'review',
    urgency: 'normal',
    department: 'งานบริการวิชาการแก่สังคม',
    requesterName: 'อ.ดร. นิตยา พิสุทธิ์วงศ์',
    requesterPosition: 'หัวหน้าโครงการบริการวิชาการสุขภาพชุมชน',
    requesterPhone: '086-456-7890',
    requesterEmail: 'nittaya.p@nurse.nu.ac.th',
    lineId: 'nittaya_service',
    neededDate: '2025-09-16',
    description: 'ต้องการเผยแพร่ข่าวสรุปผลโครงการ "พยาบาล ม.นเรศวร ห่วงใยสุขภาพผู้สูงวัย ชุมชนสุขภาพดี" มีอาจารย์และนิสิตร่วมให้บริการตรวจสุขภาพ 250 ราย ต้องการร่างข่าวและคัดเลือกภาพ 12 ภาพลง Facebook',
    specs: {
      contentDraft: 'คณะพยาบาลศาสตร์ มหาวิทยาลัยนเรศวร จัดโครงการบริการวิชาการลงพื้นที่คัดกรองสุขภาพ ป้องกันโรคไม่ติดต่อเรื้อรัง (NCDs) และให้ความรู้การดูแลสุขภาพแก่ผู้สูงอายุในชุมชนตำบลท่าโพธิ์...',
      postScheduleDate: '2025-09-16 18:00',
    },
    attachments: [
      {
        id: 'att-4',
        name: 'ภาพกิจกรรมบริการวิชาการชุมชน_select.zip',
        size: '32 MB',
        url: '#',
        type: 'application/zip',
      },
    ],
    assignedStaff: PR_STAFF_LIST[1], // ธนกฤต วรโชติ (บอส)
    timeline: [
      {
        id: 'tl-8',
        timestamp: '2025-09-14T17:00:00Z',
        action: 'ยื่นคำขอลงข่าวประชาสัมพันธ์ Facebook',
        author: 'อ.ดร. นิตยา พิสุทธิ์วงศ์',
      },
      {
        id: 'tl-9',
        timestamp: '2025-09-15T09:00:00Z',
        action: 'ร่างเนื้อหาข่าวและคัดภาพชุด 12 ภาพ',
        note: 'ตรวจทานตัวสะกด ใส่แฮชแท็ก #พยาบาลมนเรศวร #บริการวิชาการ #สุขภาวะชุมชน และแต่งภาพโทนอบอุ่น',
        author: 'ธนกฤต วรโชติ (บอส)',
      },
      {
        id: 'tl-10',
        timestamp: '2025-09-15T15:00:00Z',
        action: 'ส่งแบบร่างข้อความและรูปภาพให้ผู้ขอตรวจรับ',
        note: 'รอผู้ขอยืนยันเพื่อกำหนดเวลาเผยแพร่บน Facebook Fanpage คณะพยาบาลศาสตร์',
        author: 'ธนกฤต วรโชติ (บอส)',
      },
    ],
    deliverables: [
      {
        id: 'del-2',
        name: 'Draft_Facebook_Post_บริการวิชาการพยาบาล.docx พร้อมรูปภาพ 12 ภาพ',
        url: '#',
        date: '2025-09-15',
        note: 'พร้อมตั้งเวลาโพสต์เวลา 18:00 น.',
      },
    ],
    createdAt: '2025-09-14T17:00:00Z',
    updatedAt: '2025-09-15T15:00:00Z',
  },
  {
    id: 'PR-2025-004',
    title: 'ผลิตวิดีโอแนะนำหลักสูตรพยาบาลศาสตรมหาบัณฑิต (3 สาขาวิชา) สำหรับบัณฑิตศึกษา',
    serviceType: 'video_edit',
    status: 'in_progress',
    urgency: 'normal',
    department: 'หลักสูตรพยาบาลศาสตรมหาบัณฑิต สาขาการพยาบาลผู้ใหญ่และผู้สูงอายุ (ปริญญาโท)',
    requesterName: 'รศ.ดร. กรรณิการ์ สิทธิวงศ์',
    requesterPosition: 'รองคณบดีฝ่ายวิชาการและบัณฑิตศึกษา',
    requesterPhone: '084-333-2211',
    requesterEmail: 'kannikar.s@nurse.nu.ac.th',
    neededDate: '2025-09-28',
    description: 'ผลิตวิดีโอสัมภาษณ์คณาจารย์และศิษย์เก่าปริญญาโท แนะนำจุดเด่น 3 สาขาวิชา: การพยาบาลผู้ใหญ่และผู้สูงอายุ, การบริหารการพยาบาล และการพยาบาลเวชปฏิบัติชุมชน ความยาว 3 นาที และตัดเป็นคลิปสั้น Reels/TikTok 60 วินาที',
    specs: {
      dimensions: '16:9 (4K/Full HD) + 9:16 (Shorts/Reels)',
      colorTone: 'Professional, Warm & Inspiring tone',
      contentDraft: 'เปิดรับสมัครนิสิตระดับบัณฑิตศึกษา คณะพยาบาลศาสตร์ มหาวิทยาลัยนเรศวร พัฒนาสู่ผู้ปฏิบัติการพยาบาลขั้นสูงและผู้นำวิชาชีพ',
    },
    attachments: [],
    assignedStaff: PR_STAFF_LIST[0], // กวินทรา สิทธิผล (นุ่น)
    timeline: [
      {
        id: 'tl-11',
        timestamp: '2025-09-11T10:00:00Z',
        action: 'รับมอบหมายงานผลิตวิดีโอ',
        author: 'กวินทรา สิทธิผล (นุ่น)',
      },
      {
        id: 'tl-12',
        timestamp: '2025-09-13T10:00:00Z',
        action: 'ถ่ายทำบทสัมภาษณ์ ณ ห้องปฏิบัติการพยาบาลเสมือนจริง',
        note: 'บันทึกภาพบรรยากาศการเรียน Simulation Lab และสัมภาษณ์อาจารย์ประจำหลักสูตร',
        author: 'กวินทรา สิทธิผล (นุ่น)',
      },
    ],
    deliverables: [],
    createdAt: '2025-09-11T10:00:00Z',
    updatedAt: '2025-09-13T16:00:00Z',
  },
  {
    id: 'PR-2025-005',
    title: 'ออกแบบป้ายไวนิลเวทีและ Backdrop งานประชุมวิชาการพยาบาลศาสตร์ระดับชาติ 2568',
    serviceType: 'print_media',
    status: 'pending',
    urgency: 'express',
    department: 'โครงการสัมมนาและการประชุมวิชาการพยาบาล',
    requesterName: 'ผศ.ดร. อัจฉรา เมตตาวิสุทธิ์',
    requesterPosition: 'ประธานคณะกรรมการจัดประชุมวิชาการ',
    requesterPhone: '085-889-9112',
    requesterEmail: 'atchara.m@nurse.nu.ac.th',
    lineId: 'atchara_nurse',
    neededDate: '2025-09-18',
    eventLocation: 'หอประชุมมหาราช อาคารศูนย์วัฒนธรรม มหาวิทยาลัยนเรศวร',
    description: 'งานประชุมวิชาการเนื่องในวันพยาบาลแห่งชาติ หัวข้อ "นวัตกรรมและความท้าทายในการพยาบาลยุคดิจิทัล" ต้องการไฟล์ป้ายไวนิลขนาด 6 x 3 เมตร และป้าย Standee ทางเข้า 2 ป้าย ต้องการด่วนเพื่อส่งโรงพิมพ์ขึ้นโครง',
    specs: {
      dimensions: 'Backdrop 600 x 300 cm (300 DPI CMYK), Standee 80 x 200 cm',
      colorTone: 'Royal Blue & Nursing Emerald Green Glow',
      referenceLinks: ['https://www.nurse.nu.ac.th/index.html/'],
    },
    attachments: [
      {
        id: 'att-5',
        name: 'กำหนดการประชุมและรายนามวิทยากร_2568.docx',
        size: '95 KB',
        url: '#',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    ],
    assignedStaff: null,
    timeline: [
      {
        id: 'tl-13',
        timestamp: '2025-09-15T08:30:00Z',
        action: 'ยื่นคำขอรับบริการ (ด่วนพิเศษ 24ชม.)',
        note: 'ขออนุมัติด่วนพิเศษเนื่องจากต้องส่งไฟล์ให้ช่างพิมพ์ล่วงหน้า 3 วัน',
        author: 'ผศ.ดร. อัจฉรา เมตตาวิสุทธิ์',
      },
    ],
    deliverables: [],
    createdAt: '2025-09-15T08:30:00Z',
    updatedAt: '2025-09-15T08:30:00Z',
  },
  {
    id: 'PR-2025-006',
    title: 'ส่งข่าวแจกสื่อมวลชน (Press Release): ผลงานวิจัยนวัตกรรมแผ่นปิดแผลสมุนไพรได้รับรางวัลนวัตกรรมดีเด่น',
    serviceType: 'press',
    status: 'pending',
    urgency: 'normal',
    department: 'งานวิจัย นวัตกรรม และบริการวิชาการ',
    requesterName: 'ดร. กฤษณา ปัญญารัตน์',
    requesterPosition: 'หัวหน้างานวิจัยและนวัตกรรม คณะพยาบาลศาสตร์',
    requesterPhone: '081-445-5667',
    requesterEmail: 'kritsana.p@nurse.nu.ac.th',
    neededDate: '2025-09-25',
    description: 'ทีมคณาจารย์และนิสิตคณะพยาบาลศาสตร์ ม.นเรศวร ได้รับรางวัลนวัตกรรมดีเด่นระดับชาติ จากงานวิจัยแผ่นปิดแผลสมุนไพรธรรมชาติ ต้องการส่งข่าวแจกแก่สื่อมวลชนสายสาธารณสุข การศึกษา และเทคโนโลยี',
    specs: {
      targetAudience: 'สื่อมวลชน นักข่าวสายสาธารณสุข บุคลากรทางการแพทย์ และประชาชนทั่วไป',
    },
    attachments: [],
    assignedStaff: null,
    timeline: [
      {
        id: 'tl-14',
        timestamp: '2025-09-14T11:20:00Z',
        action: 'ยื่นคำขอส่งข่าวแจกสื่อมวลชน',
        author: 'ดร. กฤษณา ปัญญารัตน์',
      },
    ],
    deliverables: [],
    createdAt: '2025-09-14T11:20:00Z',
    updatedAt: '2025-09-14T11:20:00Z',
  },
];
