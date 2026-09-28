export type PRServiceType = 
  | 'poster'       // ออกแบบโปสเตอร์ / กราฟิก
  | 'photo'        // ถ่ายภาพนิ่ง / กิจกรรม
  | 'facebook'     // ลงข่าวประชาสัมพันธ์ Facebook & สื่อโซเชียล
  | 'press'        // งานแถลงข่าว / สื่อมวลชน
  | 'video_edit'   // บันทึกและตัดต่อวิดีโอ
  | 'print_media'; // สื่อสิ่งพิมพ์ / ป้ายไวนิล / แผ่นพับ

export type PRTaskStatus = 
  | 'pending'      // รอดำเนินการ / ได้รับคำขอ
  | 'in_progress'  // กำลังดำเนินการ
  | 'review'       // รอตรวจรับงาน / รอ Feedback
  | 'revision'     // กำลังแก้ไข
  | 'completed'    // เสร็จสิ้น / ส่งมอบงานแล้ว
  | 'cancelled';   // ยกเลิกคำขอ

export type PRUrgency = 
  | 'normal'       // ปกติ (5-7 วันทำการ)
  | 'urgent'       // ด่วน (2-3 วันทำการ)
  | 'express';     // ด่วนพิเศษ (ภายใน 24 ชม.)

export interface TaskTimelineItem {
  id: string;
  timestamp: string;
  action: string;
  note?: string;
  author: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size?: string;
  url: string;
  type?: string;
}

export interface TaskDeliverable {
  id: string;
  name: string;
  url: string;
  date: string;
  note?: string;
}

export interface PRStaff {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface PRRequest {
  id: string; // e.g. PR-2025-001
  title: string;
  serviceType: PRServiceType;
  status: PRTaskStatus;
  urgency: PRUrgency;
  department: string;
  requesterName: string;
  requesterPosition: string;
  requesterPhone: string;
  requesterEmail: string;
  lineId?: string;
  neededDate: string; // YYYY-MM-DD
  neededTime?: string;
  eventLocation?: string;
  description: string;
  specs: {
    dimensions?: string;
    targetAudience?: string;
    colorTone?: string;
    contentDraft?: string;
    referenceLinks?: string[];
    estimatedShots?: number;
    postScheduleDate?: string;
  };
  attachments: TaskAttachment[];
  assignedStaff?: PRStaff | null;
  timeline: TaskTimelineItem[];
  deliverables: TaskDeliverable[];
  feedback?: {
    rating: number; // 1-5
    comment: string;
    submittedAt: string;
  };
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface LineNotificationSettings {
  enabled: boolean;
  provider?: 'line_notify' | 'line_messaging_api' | 'webhook';
  lineNotifyToken: string;
  webhookUrl: string;
  channelAccessToken: string;
  toUserId?: string;
  targetType?: 'group' | 'personal';
  targetName?: string;
  notifyOnNewRequest: boolean;
  notifyOnStatusChange: boolean;
  notifyOnDelivery: boolean;
  notifyOnUrgent: boolean;
  customPrefix: string;
  lastTestedAt?: string;
  lastTestSuccess?: boolean;
  lastTestMessage?: string;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  taskId: string;
  taskTitle: string;
  type: 'new_request' | 'status_change' | 'delivery' | 'test';
  recipient: string;
  message: string;
  status: 'sent' | 'simulated' | 'failed';
  errorDetail?: string;
  provider?: string;
}

export interface MonthlySummaryData {
  year: number;
  month: number; // 1-12
  monthNameThai: string;
  totalRequests: number;
  completedRequests: number;
  inProgressRequests: number;
  pendingRequests: number;
  onTimeCompletionRate: number; // 0-100%
  averageDurationDays: number;
  byService: Record<PRServiceType, number>;
  byDepartment: Record<string, number>;
  topDemandedService: {
    type: PRServiceType;
    count: number;
    label: string;
  };
  topDepartment: {
    name: string;
    count: number;
  };
  aiStrategicInsights: string[];
}
