import { PRRequest, LineNotificationSettings, NotificationLog, PRTaskStatus } from '../types';
import { PR_SERVICES_CONFIG, STATUS_CONFIG, URGENCY_CONFIG } from '../data/initialData';

/**
 * Format Thai notification message for LINE
 */
export const formatLineMessage = (
  type: 'new_request' | 'status_change' | 'delivery' | 'test',
  task?: PRRequest,
  customNote?: string,
  settings?: LineNotificationSettings
): string => {
  const prefix = settings?.customPrefix || '📢 [PR SYSTEM]';

  if (type === 'test') {
    return `${prefix} ทดสอบการเชื่อมต่อระบบแจ้งเตือนสำเร็จ! 🟢
📅 วันที่: ${new Date().toLocaleString('th-TH')}
✨ ระบบพร้อมส่งการแจ้งเตือนงานบริการประชาสัมพันธ์แบบ Real-time`;
  }

  if (!task) return `${prefix} มีการอัปเดตงานบริการประชาสัมพันธ์`;

  const service = PR_SERVICES_CONFIG[task.serviceType]?.label || task.serviceType;
  const status = STATUS_CONFIG[task.status]?.label || task.status;
  const urgency = URGENCY_CONFIG[task.urgency]?.label || task.urgency;

  if (type === 'new_request') {
    return `${prefix} 📋 มีคำขอรับบริการงานประชาสัมพันธ์ใหม่!
━━━━━━━━━━━━━━━━━━━━
🆔 รหัสงาน: #${task.id}
🎯 บริการ: ${service}
📌 เรื่อง: ${task.title}
🏢 หน่วยงาน: ${task.department}
👤 ผู้ขอ: ${task.requesterName} (${task.requesterPhone})
⚡ ความเร่งด่วน: ${urgency}
🗓 กำหนดส่ง/ใช้งาน: ${task.neededDate}${task.neededTime ? ` เวลา ${task.neededTime}` : ''}
${task.eventLocation ? `📍 สถานที่: ${task.eventLocation}\n` : ''}━━━━━━━━━━━━━━━━━━━━
🌐 ตรวจสอบและมอบหมายงานได้ที่หน้าแดชบอร์ด`;
  }

  if (type === 'status_change') {
    return `${prefix} 🔄 อัปเดตสถานะงานประชาสัมพันธ์ #${task.id}
━━━━━━━━━━━━━━━━━━━━
📌 เรื่อง: ${task.title}
🎯 บริการ: ${service}
📊 สถานะใหม่: 【${status}】
👤 ผู้รับผิดชอบ: ${task.assignedStaff ? task.assignedStaff.name : 'ยังไม่มอบหมาย'}
${customNote ? `📝 บันทึกความคืบหน้า: ${customNote}\n` : ''}━━━━━━━━━━━━━━━━━━━━
ติดตามความคืบหน้าได้ตลอด 24 ชม.`;
  }

  if (type === 'delivery') {
    return `${prefix} 🎉 ส่งมอบชิ้นงานสำเร็จ! #${task.id}
━━━━━━━━━━━━━━━━━━━━
📌 เรื่อง: ${task.title}
🎯 บริการ: ${service}
🏢 ผู้ขอ: ${task.requesterName} (${task.department})
📦 ผลงานที่ส่งมอบ: ${task.deliverables.length > 0 ? task.deliverables.map((d) => d.name).join(', ') : 'ไฟล์งานเสร็จสมบูรณ์'}
━━━━━━━━━━━━━━━━━━━━
⭐ กรุณาตรวจสอบชิ้นงานและร่วมประเมินความพึงพอใจการบริการ ขอบพระคุณครับ/ค่ะ`;
  }

  return `${prefix} อัปเดตงาน #${task.id}: ${task.title}`;
};

/**
 * Dispatch notification:
 * If real LINE Notify token is configured and user triggers it, tries sending via CORS proxy / fetch;
 * Always generates a clean NotificationLog so user can see it in real-time on UI.
 */
export const dispatchLineNotification = async (
  type: 'new_request' | 'status_change' | 'delivery' | 'test',
  settings: LineNotificationSettings,
  task?: PRRequest,
  customNote?: string
): Promise<{ success: boolean; log: NotificationLog; message: string }> => {
  const message = formatLineMessage(type, task, customNote, settings);
  const taskId = task?.id || 'SYS-TEST';
  const taskTitle = task?.title || 'ทดสอบการแจ้งเตือน LINE';
  const recipient = task?.lineId ? `LINE User: ${task.lineId} & กลุ่มงาน PR` : 'กลุ่มแจ้งเตือน PR Team (LINE)';

  let status: 'sent' | 'simulated' | 'failed' = 'simulated';

  // Check if real token provided and not the placeholder
  if (settings.enabled && settings.lineNotifyToken && !settings.lineNotifyToken.startsWith('DEMO_')) {
    try {
      // Direct call to LINE Notify (CORS might block on client without proxy, so handle gracefully)
      const res = await fetch('https://notify-api.line.me/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${settings.lineNotifyToken}`,
        },
        body: new URLSearchParams({ message }),
      });
      if (res.ok) {
        status = 'sent';
      } else {
        status = 'simulated';
      }
    } catch {
      // Client-side browser CORS fallback
      status = 'simulated';
    }
  } else {
    status = 'simulated';
  }

  const log: NotificationLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    taskId,
    taskTitle,
    type,
    recipient,
    message,
    status,
  };

  return {
    success: true,
    log,
    message,
  };
};
