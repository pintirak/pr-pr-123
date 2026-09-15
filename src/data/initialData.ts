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
    description: 'โปสเตอร์ประชาสัมพันธ์, แบนเนอร์ social media, อินโฟกราฟิก, ภาพประกอบบทความ',
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
    description: 'บันทึกภาพพิธีการ, กิจกรรมสัมมนา, ภาพผู้บริหาร, ภาพสตูดิโอบุคลากร',
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
    description: 'ร่างบทความข่าวประชาสัมพันธ์, แคปชัน Facebook, ตั้งเวลาโพสต์, ตรวจสอบความถูกต้อง',
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
    description: 'ส่งข่าวแจกสื่อมวลชน (Press Release), ประสานงานนักข่าวภายนอก, จัดแถลงข่าว',
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
    description: 'วิดีโอสัมภาษณ์, วิดีโอสรุปกิจกรรม (Highlight Reel), วิดีโอสั้น TikTok/Reels',
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
    description: 'ป้ายไวนิลฉากเวที (Backdrop), แผ่นพับประชาสัมพันธ์, สูจิบัตรงานประชุม, ป้าย Roll-up',
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

export const PR_STAFF_LIST: PRStaff[] = [
  {
    id: 'staff-1',
    name: 'กวินทรา สิทธิผล (นุ่น)',
    role: 'หัวหน้างานสื่อสารองค์กร & Creative Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'staff-2',
    name: 'ธนกฤต วรโชติ (บอส)',
    role: 'นักออกแบบกราฟิกอาวุโส (Senior Graphic Designer)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'staff-3',
    name: 'ศิริพร บุญสว่าง (ฝน)',
    role: 'ช่างภาพและตัดต่อวิดีโอ (Photographer & Videographer)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'staff-4',
    name: 'พัชรพล เจริญสุข (ท็อป)',
    role: 'นักประชาสัมพันธ์ & Social Media Editor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

export const DEPARTMENTS_LIST: string[] = [
  'สำนักวิชาการและการจัดการเรียนรู้',
  'กองพัฒนานักศึกษาและกิจกรรม',
  'สำนักงานอธิการบดี / สำนักงานอำนวยการ',
  'คณะบริหารธุรกิจและการบัญชี',
  'คณะวิทยาศาสตร์และเทคโนโลยีสารสนเทศ',
  'คณะมนุษยศาสตร์และสังคมศาสตร์',
  'คณะวิศวกรรมศาสตร์และนวัตกรรม',
  'สถาบันวิจัยและบริการวิชาการ',
  'กองแผนงานและพัฒนาองค์กร',
  'ศูนย์คอมพิวเตอร์และสารสนเทศ',
];

export const INITIAL_LINE_SETTINGS: LineNotificationSettings = {
  enabled: true,
  lineNotifyToken: 'DEMO_LINE_NOTIFY_TOKEN_PR_SYSTEM',
  webhookUrl: 'https://notify-api.line.me/api/notify',
  channelAccessToken: '',
  notifyOnNewRequest: true,
  notifyOnStatusChange: true,
  notifyOnDelivery: true,
  notifyOnUrgent: true,
  customPrefix: '📢 [PR SYSTEM การประชาสัมพันธ์]',
};

export const INITIAL_PR_REQUESTS: PRRequest[] = [
  {
    id: 'PR-2025-001',
    title: 'ออกแบบโปสเตอร์และแบนเนอร์ประชาสัมพันธ์งาน Open House 2025',
    serviceType: 'poster',
    status: 'in_progress',
    urgency: 'urgent',
    department: 'กองพัฒนานักศึกษาและกิจกรรม',
    requesterName: 'ผศ.ดร. นันทิยา เกียรติบูรณ์',
    requesterPosition: 'รองคณบดีฝ่ายพัฒนานักศึกษา',
    requesterPhone: '081-987-6543',
    requesterEmail: 'nantiya.k@organization.ac.th',
    lineId: 'nantiya_k',
    neededDate: '2025-10-05',
    neededTime: '10:00',
    description: 'ต้องการโปสเตอร์ขนาด A3 และรูปภาพสำหรับโปรโมตบน Facebook (1080x1080px) และ Story (1080x1920px) ธีม Modern Technology โทนสีน้ำเงิน-แสด พร้อมคิวอาร์โค้ดลงทะเบียนเข้าร่วมงานล่วงหน้า',
    specs: {
      dimensions: 'A3 (พิมพ์) + 1080x1080px (FB) + 1080x1920px (Story)',
      targetAudience: 'นักเรียนชั้นมัธยมศึกษาตอนปลาย ครูแนะแนว และผู้ปกครอง',
      colorTone: 'น้ำเงิน กรมท่า และส้มสดใส (Corporate Theme)',
      contentDraft: 'หัวข้องาน: OPEN HOUSE 2025 "เปิดประตูสู่อนาคตดิจิทัล" วันที่ 18-19 พ.ย. 2568 ณ อาคารนวัตกรรม 1',
      referenceLinks: ['https://drive.google.com/drive/folders/sample-openhouse-logos'],
    },
    attachments: [
      {
        id: 'att-1',
        name: 'โลโก้องค์กร_vector.png',
        size: '1.4 MB',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        type: 'image/png',
      },
      {
        id: 'att-2',
        name: 'กำหนดการและกิจกรรมย่อย_OpenHouse.pdf',
        size: '340 KB',
        url: '#',
        type: 'application/pdf',
      },
    ],
    assignedStaff: PR_STAFF_LIST[1], // บอส
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2025-09-12T09:15:00Z',
        action: 'ยื่นคำขอรับบริการงานประชาสัมพันธ์',
        note: 'ยื่นคำขอผ่านระบบออนไลน์ พร้อมแนบกำหนดการและโลโก้หลัก',
        author: 'ผศ.ดร. นันทิยา เกียรติบูรณ์',
      },
      {
        id: 'tl-2',
        timestamp: '2025-09-12T10:30:00Z',
        action: 'รับเรื่องและมอบหมายงาน',
        note: 'หัวหน้างาน PR ตรวจสอบรายละเอียดและมอบหมายให้นักออกแบบกราฟิกเริ่มร่างแบบ',
        author: 'กวินทรา สิทธิผล (นุ่น)',
      },
      {
        id: 'tl-3',
        timestamp: '2025-09-13T14:00:00Z',
        action: 'เริ่มออกแบบ Layout ร่างแรก',
        note: 'กำลังวางองค์ประกอบตามธีมสีน้ำเงิน-แสด และสร้าง QR Code ลงทะเบียน',
        author: 'ธนกฤต วรโชติ (บอส)',
      },
    ],
    deliverables: [],
    createdAt: '2025-09-12T09:15:00Z',
    updatedAt: '2025-09-13T14:00:00Z',
  },
  {
    id: 'PR-2025-002',
    title: 'ถ่ายภาพพิธีลงนามบันทึกความเข้าใจ (MOU) ความร่วมมือกับภาคอุตสาหกรรม',
    serviceType: 'photo',
    status: 'completed',
    urgency: 'normal',
    department: 'สำนักวิชาการและการจัดการเรียนรู้',
    requesterName: 'คุณกิตติศักดิ์ มั่นคง',
    requesterPosition: 'หัวหน้างานความร่วมมือวิชาการ',
    requesterPhone: '089-123-4567',
    requesterEmail: 'kittisak.m@organization.ac.th',
    lineId: 'kittisak_mou',
    neededDate: '2025-09-10',
    neededTime: '09:00 - 12:00',
    eventLocation: 'ห้องประชุมเฉลิมพระเกียรติ ชั้น 5 อาคารอำนวยการ',
    description: 'ถ่ายภาพพิธีลงนาม MOU ระหว่างองค์กรกับ 5 บริษัทพันธมิตรชั้นนำ มีผู้บริหารระดับสูง 20 ท่าน ต้องการภาพบรรยากาศพิธีการ ภาพหมู่ และภาพแลกแฟ้มลงนาม',
    specs: {
      estimatedShots: 250,
      targetAudience: 'สื่อมวลชน ผู้บริหาร และรายงานประจำปี',
    },
    attachments: [
      {
        id: 'att-3',
        name: 'ลำดับพิธีการลงนาม_MOU.docx',
        size: '120 KB',
        url: '#',
        type: 'application/msword',
      },
    ],
    assignedStaff: PR_STAFF_LIST[2], // ฝน
    timeline: [
      {
        id: 'tl-4',
        timestamp: '2025-09-08T11:00:00Z',
        action: 'ยื่นคำขอรับบริการถ่ายภาพ',
        author: 'คุณกิตติศักดิ์ มั่นคง',
      },
      {
        id: 'tl-5',
        timestamp: '2025-09-08T13:20:00Z',
        action: 'มอบหมายช่างภาพลงพื้นที่',
        note: 'เตรียมอุปกรณ์กล้อง เลนส์ และแฟลชหัวค้อนสำหรับห้องประชุม',
        author: 'กวินทรา สิทธิผล (นุ่น)',
      },
      {
        id: 'tl-6',
        timestamp: '2025-09-10T12:30:00Z',
        action: 'ถ่ายภาพกิจกรรมเสร็จสิ้น',
        note: 'นำไฟล์เข้าสู่ขั้นตอนคัดเลือกและปรับแต่งโทนสี',
        author: 'ศิริพร บุญสว่าง (ฝน)',
      },
      {
        id: 'tl-7',
        timestamp: '2025-09-11T16:00:00Z',
        action: 'ส่งมอบอัลบั้มภาพคุณภาพสูง',
        note: 'อัปโหลดภาพจำนวน 180 ภาพผ่าน Google Drive พร้อมโฟลเดอร์ Hi-Res และ Web-Size',
        author: 'ศิริพร บุญสว่าง (ฝน)',
      },
    ],
    deliverables: [
      {
        id: 'del-1',
        name: 'อัลบั้มภาพพิธีลงนาม_MOU_2025 (Google Drive Link)',
        url: 'https://drive.google.com/drive/folders/demo-mou-photos',
        date: '2025-09-11',
        note: 'รวม 180 ภาพ คัดและเกรดสีเรียบร้อยแล้ว',
      },
    ],
    feedback: {
      rating: 5,
      comment: 'ช่างภาพตรงต่อเวลา สุภาพ และได้มุมภาพผู้บริหารคมชัดสวยงามมากครับ',
      submittedAt: '2025-09-12T08:30:00Z',
    },
    createdAt: '2025-09-08T11:00:00Z',
    updatedAt: '2025-09-11T16:00:00Z',
  },
  {
    id: 'PR-2025-003',
    title: 'ลงข่าวประชาสัมพันธ์ Facebook และเว็บ: สรุปผลกิจกรรมจิตอาสาพัฒนาชุมชน',
    serviceType: 'facebook',
    status: 'review',
    urgency: 'normal',
    department: 'กองพัฒนานักศึกษาและกิจกรรม',
    requesterName: 'คุณวราภรณ์ สุวรรณเวช',
    requesterPosition: 'เจ้าหน้าที่บริหารงานทั่วไป',
    requesterPhone: '086-456-7890',
    requesterEmail: 'varaporn.s@organization.ac.th',
    lineId: 'vara_pr',
    neededDate: '2025-09-16',
    description: 'ต้องการเผยแพร่ข่าวสรุปผลโครงการ "เยาวชนคนดี ปลูกป่าชายเลนและเก็บขยะชายหาด" มีนักศึกษาเข้าร่วมกว่า 300 คน ต้องการร่างข่าวและคัดภาพ 12 ภาพลงแฟนเพจ',
    specs: {
      contentDraft: 'เมื่อวันที่ 14 ก.ย. กองพัฒนานักศึกษา นำทัพนักศึกษา 300 ชีวิต ปลูกป่าชายเลน 1,500 ต้น ณ ป่าชุมชนบ้านคลองโคน...',
      postScheduleDate: '2025-09-16 18:00',
    },
    attachments: [
      {
        id: 'att-4',
        name: 'ภาพกิจกรรมจิตอาสา_select.zip',
        size: '48 MB',
        url: '#',
        type: 'application/zip',
      },
    ],
    assignedStaff: PR_STAFF_LIST[3], // ท็อป
    timeline: [
      {
        id: 'tl-8',
        timestamp: '2025-09-14T17:00:00Z',
        action: 'ยื่นคำขอลงข่าวประชาสัมพันธ์ Facebook',
        author: 'คุณวราภรณ์ สุวรรณเวช',
      },
      {
        id: 'tl-9',
        timestamp: '2025-09-15T09:00:00Z',
        action: 'ร่างเนื้อหาข่าวและคัดภาพชุด 12 ภาพ',
        note: 'ตรวจทานตัวสะกด ใส่แฮชแท็ก #จิตอาสา #องค์กรสีเขียว และแต่งภาพโทนธรรมชาติ',
        author: 'พัชรพล เจริญสุข (ท็อป)',
      },
      {
        id: 'tl-10',
        timestamp: '2025-09-15T15:00:00Z',
        action: 'ส่งแบบร่างข้อความและรูปภาพให้ผู้ขอตรวจรับ',
        note: 'รอผู้ขอยืนยันเพื่อกำหนดเวลาเผยแพร่บน Facebook Page ทางการ',
        author: 'พัชรพล เจริญสุข (ท็อป)',
      },
    ],
    deliverables: [
      {
        id: 'del-2',
        name: 'Draft_Facebook_Post_จิตอาสา.docx พร้อมไฟล์ชุดรูป 12 ภาพ',
        url: '#',
        date: '2025-09-15',
        note: 'พร้อมกำหนดโพสต์เวลา 18.00 น.',
      },
    ],
    createdAt: '2025-09-14T17:00:00Z',
    updatedAt: '2025-09-15T15:00:00Z',
  },
  {
    id: 'PR-2025-004',
    title: 'ผลิตวิดีโอสัมภาษณ์ศิษย์เก่าดีเด่น ฉลองครบรอบ 30 ปีองค์กร (Shorts/Reels & ยาว 3 นาที)',
    serviceType: 'video_edit',
    status: 'in_progress',
    urgency: 'normal',
    department: 'สำนักงานอธิการบดี / สำนักงานอำนวยการ',
    requesterName: 'ดร. ธีรภัทร ชาญวิทย์',
    requesterPosition: 'ผู้ช่วยอธิการบดีฝ่ายสื่อสารองค์กร',
    requesterPhone: '084-333-2211',
    requesterEmail: 'teerapat.c@organization.ac.th',
    neededDate: '2025-09-28',
    description: 'ถ่ายทำและตัดต่อวิดีโอสัมภาษณ์คุณสมชาย ศิษย์เก่าผู้ก่อตั้งสตาร์ทอัพยูนิคอร์น แบ่งเป็น 2 เวอร์ชัน: เวอร์ชันเต็ม 3-4 นาที สำหรับ YouTube/Website และเวอร์ชันคลิปไฮไลต์ 60 วินาที สำหรับ TikTok/IG Reels',
    specs: {
      dimensions: '16:9 (4K Master) + 9:16 (Full HD Reels)',
      colorTone: 'Cinematic warm & Inspiring tone',
      contentDraft: 'หัวข้อสัมภาษณ์: "จากรั้วการศึกษา สู่เวทีธุรกิจระดับโลก"',
    },
    attachments: [],
    assignedStaff: PR_STAFF_LIST[2], // ฝน
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
        action: 'ถ่ายทำสัมภาษณ์ ณ อาคารสตาร์ทอัพ',
        note: 'ถ่าย 2 กล้อง พร้อมบันทึกเสียงไมค์ไวร์เลสและ B-Roll บรรยากาศการทำงาน',
        author: 'ศิริพร บุญสว่าง (ฝน)',
      },
    ],
    deliverables: [],
    createdAt: '2025-09-11T10:00:00Z',
    updatedAt: '2025-09-13T16:00:00Z',
  },
  {
    id: 'PR-2025-005',
    title: 'ออกแบบป้ายไวนิลฉากหลังเวที (Backdrop 6x3 เมตร) และป้ายต้อนรับงานสัมมนาวิชาการ',
    serviceType: 'print_media',
    status: 'pending',
    urgency: 'express',
    department: 'คณะวิทยาศาสตร์และเทคโนโลยีสารสนเทศ',
    requesterName: 'อ. อัครเดช เมธาพงศ์',
    requesterPosition: 'ประธานคณะกรรมการจัดงานสัมมนา',
    requesterPhone: '085-889-9112',
    requesterEmail: 'akkaradech.m@organization.ac.th',
    lineId: 'akkaradech_sci',
    neededDate: '2025-09-18',
    eventLocation: 'หอประชุมใหญ่ อาคารศูนย์วัฒนธรรม',
    description: 'งานสัมมนาหัวข้อ "AI & Future Economy 2025" มีผู้เชี่ยวชาญจาก 10 มหาวิทยาลัยเข้าร่วม ต้องการไฟล์พิมพ์ป้ายเวทีขนาด 6 x 3 เมตร และป้าย Standee ทางเข้า 2 ป้าย ด่วนมากเนื่องจากร้านพิมพ์ต้องขึ้นโครงล่วงหน้า 3 วัน',
    specs: {
      dimensions: 'Backdrop 600 x 300 cm (300 DPI CMYK), Standee 80 x 200 cm',
      colorTone: 'Cyber Navy Blue & Emerald Green Glow',
      referenceLinks: ['https://drive.google.com/sample/speakers-photo-highres'],
    },
    attachments: [
      {
        id: 'att-5',
        name: 'รายชื่อวิทยากรและหัวข้อบรรยาย_Final.xlsx',
        size: '88 KB',
        url: '#',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
    assignedStaff: null,
    timeline: [
      {
        id: 'tl-13',
        timestamp: '2025-09-15T08:30:00Z',
        action: 'ยื่นคำขอรับบริการ (ด่วนพิเศษ)',
        note: 'ทำเรื่องขอด่วนพิเศษเนื่องจากได้รับรายชื่อวิทยากรหลักกระชั้นชิด',
        author: 'อ. อัครเดช เมธาพงศ์',
      },
    ],
    deliverables: [],
    createdAt: '2025-09-15T08:30:00Z',
    updatedAt: '2025-09-15T08:30:00Z',
  },
  {
    id: 'PR-2025-006',
    title: 'ประสานงานสื่อมวลชนและส่งข่าวแจก (Press Release): การค้นพบนวัตกรรมใหม่จดสิทธิบัตร',
    serviceType: 'press',
    status: 'pending',
    urgency: 'normal',
    department: 'สถาบันวิจัยและบริการวิชาการ',
    requesterName: 'ดร. กฤษณา ปัญญารัตน์',
    requesterPosition: 'ผู้อำนวยการสถาบันวิจัย',
    requesterPhone: '081-445-5667',
    requesterEmail: 'kritsana.p@organization.ac.th',
    neededDate: '2025-09-25',
    description: 'ทีมวิจัยประสบความสำเร็จในการคิดค้นวัสดุชีวภาพย่อยสลายได้จากเปลือกผลไม้ ได้รับการจดสิทธิบัตรแล้ว ต้องการเผยแพร่ข่าวสู่สื่อมวลชนสายเศรษฐกิจ นวัตกรรม และวิทยาศาสตร์ เช่น ไทยรัฐ มติชน Techsauce',
    specs: {
      targetAudience: 'นักข่าวสายเทคโนโลยี นวัตกรรม ผู้ประกอบการ และประชาชนทั่วไป',
    },
    attachments: [],
    assignedStaff: null,
    timeline: [
      {
        id: 'tl-14',
        timestamp: '2025-09-14T11:20:00Z',
        action: 'ยื่นคำขอแถลงข่าวและส่ง Press Release',
        author: 'ดร. กฤษณา ปัญญารัตน์',
      },
    ],
    deliverables: [],
    createdAt: '2025-09-14T11:20:00Z',
    updatedAt: '2025-09-14T11:20:00Z',
  },
];
