import { PRRequest, LineNotificationSettings, NotificationLog } from '../types';
import { INITIAL_PR_REQUESTS, INITIAL_LINE_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  REQUESTS: 'pr_system_requests_db_v1',
  SETTINGS: 'pr_system_line_settings_v1',
  LOGS: 'pr_system_notification_logs_v1',
  THEME: 'pr_system_theme_v1',
};

// Initial notification sample logs
const INITIAL_LOGS: NotificationLog[] = [
  {
    id: 'log-1',
    timestamp: '2025-09-12T09:15:05Z',
    taskId: 'PR-2025-001',
    taskTitle: 'ออกแบบโปสเตอร์และแบนเนอร์ประชาสัมพันธ์งาน Open House 2025',
    type: 'new_request',
    recipient: 'LINE Group: PR-Team-Noti',
    message: '📌 มีคำขอรับบริการใหม่: ออกแบบโปสเตอร์และแบนเนอร์ประชาสัมพันธ์งาน Open House 2025 จาก กองพัฒนานักศึกษาและกิจกรรม (ด่วน)',
    status: 'sent',
  },
  {
    id: 'log-2',
    timestamp: '2025-09-11T16:00:10Z',
    taskId: 'PR-2025-002',
    taskTitle: 'ถ่ายภาพพิธีลงนามบันทึกความเข้าใจ (MOU)',
    type: 'delivery',
    recipient: 'LINE User: kittisak_mou',
    message: '🎉 ชิ้นงานเสร็จสมบูรณ์แล้ว: อัลบั้มภาพพิธีลงนาม_MOU_2025 ส่งมอบเรียบร้อย พร้อมลิงก์ดาวน์โหลด',
    status: 'sent',
  },
  {
    id: 'log-3',
    timestamp: '2025-09-15T08:30:15Z',
    taskId: 'PR-2025-005',
    taskTitle: 'ออกแบบป้ายไวนิลฉากหลังเวที (Backdrop 6x3 เมตร)',
    type: 'new_request',
    recipient: 'LINE Group: PR-Emergency-Alert',
    message: '🚨 ด่วนพิเศษ (ภายใน 24 ชม.)! คำขอ #PR-2025-005 ป้ายเวทีสัมมนา จาก คณะวิทย์ฯ โปรดตรวจสอบทันที',
    status: 'sent',
  },
];

export const loadRequestsFromStorage = (): PRRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_PR_REQUESTS));
      return INITIAL_PR_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PR_REQUESTS;
  } catch (error) {
    console.warn('Failed to parse requests from storage, reverting to default:', error);
    return INITIAL_PR_REQUESTS;
  }
};

export const saveRequestsToStorage = (requests: PRRequest[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (error) {
    console.error('Failed to save requests to storage:', error);
  }
};

export const loadSettingsFromStorage = (): LineNotificationSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return INITIAL_LINE_SETTINGS;
    return { ...INITIAL_LINE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_LINE_SETTINGS;
  }
};

export const saveSettingsToStorage = (settings: LineNotificationSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadLogsFromStorage = (): NotificationLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOGS;
  }
};

export const saveLogsToStorage = (logs: NotificationLog[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save notification logs:', error);
  }
};

/**
 * File-based JSON Database Export
 * Downloads a structured .json file of the current PR SYSTEM database
 */
export const exportDatabaseJSON = (requests: PRRequest[], settings: LineNotificationSettings, logs: NotificationLog[]) => {
  const exportPayload = {
    appName: 'PR SYSTEM Service Management',
    schemaVersion: '1.0.0',
    exportedAt: new Date().toISOString(),
    totalRecords: requests.length,
    data: {
      requests,
      settings,
      notificationLogs: logs,
    },
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(exportPayload, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `pr-system-database-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * File-based JSON Database Import
 */
export const importDatabaseJSON = (
  fileContent: string
): { success: boolean; requests?: PRRequest[]; settings?: LineNotificationSettings; logs?: NotificationLog[]; error?: string } => {
  try {
    const parsed = JSON.parse(fileContent);
    if (parsed.data && Array.isArray(parsed.data.requests)) {
      saveRequestsToStorage(parsed.data.requests);
      if (parsed.data.settings) saveSettingsToStorage(parsed.data.settings);
      if (parsed.data.notificationLogs) saveLogsToStorage(parsed.data.notificationLogs);
      return {
        success: true,
        requests: parsed.data.requests,
        settings: parsed.data.settings || INITIAL_LINE_SETTINGS,
        logs: parsed.data.notificationLogs || INITIAL_LOGS,
      };
    } else if (Array.isArray(parsed)) {
      saveRequestsToStorage(parsed);
      return {
        success: true,
        requests: parsed,
        settings: INITIAL_LINE_SETTINGS,
        logs: INITIAL_LOGS,
      };
    } else {
      return { success: false, error: 'โครงสร้างไฟล์ JSON ไม่ตรงตามรูปแบบฐานข้อมูล PR SYSTEM' };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `ไม่สามารถประมวลผลไฟล์ JSON ได้: ${message}` };
  }
};

/**
 * Reset to factory seed data
 */
export const resetToSeedData = () => {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_PR_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_LINE_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
  return {
    requests: INITIAL_PR_REQUESTS,
    settings: INITIAL_LINE_SETTINGS,
    logs: INITIAL_LOGS,
  };
};
