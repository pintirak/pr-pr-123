import { PRRequest, LineNotificationSettings, NotificationLog } from '../types';
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
  const prefix = settings?.customPrefix || '📢 [PR SYSTEM คณะพยาบาลศาสตร์ ม.นเรศวร]';

  if (type === 'test') {
    return `${prefix} ทดสอบการเชื่อมต่อระบบแจ้งเตือนสำเร็จ! 🟢
━━━━━━━━━━━━━━━━━━━━
📅 วันที่และเวลา: ${new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'medium' })}
✨ สถานะ: ระบบพร้อมส่งการแจ้งเตือนงานบริการประชาสัมพันธ์แบบ Real-time เข้า LINE แล้ว
🔔 แจ้งเตือน: คำขอใหม่ / ปรับสถานะ / ส่งมอบงาน`;
  }

  if (!task) return `${prefix} มีการอัปเดตงานบริการประชาสัมพันธ์`;

  const service = PR_SERVICES_CONFIG[task.serviceType]?.label || task.serviceType;
  const status = STATUS_CONFIG[task.status]?.label || task.status;
  const urgency = URGENCY_CONFIG[task.urgency]?.label || task.urgency;

  if (type === 'new_request') {
    const isUrgent = task.urgency === 'express' || task.urgency === 'urgent';
    return `${prefix} ${isUrgent ? '🚨 แจ้งเตือนงานด่วนพิเศษ!' : '📋 มีคำขอรับบริการงานประชาสัมพันธ์ใหม่!'}
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
ติดตามความคืบหน้าได้ตลอด 24 ชม. ผ่านระบบ PR SYSTEM`;
  }

  if (type === 'delivery') {
    return `${prefix} 🎉 ส่งมอบชิ้นงานสำเร็จ! #${task.id}
━━━━━━━━━━━━━━━━━━━━
📌 เรื่อง: ${task.title}
🎯 บริการ: ${service}
🏢 ผู้ขอ: ${task.requesterName} (${task.department})
📦 ผลงานที่ส่งมอบ: ${task.deliverables.length > 0 ? task.deliverables.map((d) => d.name).join(', ') : 'ไฟล์งานเสร็จสมบูรณ์'}
━━━━━━━━━━━━━━━━━━━━
⭐ ตรวจสอบชิ้นงานและร่วมประเมินความพึงพอใจการบริการ ขอบพระคุณครับ/ค่ะ`;
  }

  return `${prefix} อัปเดตงาน #${task.id}: ${task.title}`;
};

export interface DispatchLineResult {
  success: boolean;
  isReal: boolean;
  isDemo: boolean;
  status: 'sent' | 'simulated' | 'failed';
  log: NotificationLog;
  message: string;
  errorDetail?: string;
  hint?: string;
}

/**
 * Dispatch notification through backend proxy (/api/line-notify)
 * Avoids browser CORS and ensures real LINE delivery.
 */
export const dispatchLineNotification = async (
  type: 'new_request' | 'status_change' | 'delivery' | 'test',
  settings: LineNotificationSettings,
  task?: PRRequest,
  customNote?: string
): Promise<DispatchLineResult> => {
  const message = formatLineMessage(type, task, customNote, settings);
  const taskId = task?.id || 'SYS-TEST';
  const taskTitle = task?.title || 'ทดสอบการแจ้งเตือน LINE';
  const recipient = settings.targetName
    ? `${settings.targetName} (${settings.provider || 'LINE'})`
    : task?.lineId
    ? `LINE: ${task.lineId} & ทีม PR`
    : 'LINE Notification Group';

  const provider = settings.provider || 'line_notify';
  const token = settings.lineNotifyToken || '';
  const channelAccessToken = settings.channelAccessToken || '';
  const webhookUrl = settings.webhookUrl || '';

  // Determine if token is a demo/unconfigured token
  const activeToken = token || channelAccessToken;
  const isDemo = !activeToken || activeToken.startsWith('DEMO_');

  // If user disabled notifications completely
  if (!settings.enabled) {
    const log: NotificationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      taskId,
      taskTitle,
      type,
      recipient,
      message,
      status: 'simulated',
      errorDetail: 'ระบบแจ้งเตือนถูกปิดอยู่ (Notifications Disabled)',
      provider,
    };
    return {
      success: false,
      isReal: false,
      isDemo: true,
      status: 'simulated',
      log,
      message,
      errorDetail: 'ระบบแจ้งเตือนถูกปิดอยู่ กรุณาเปิดใช้งานในการตั้งค่า',
    };
  }

  // Attempt real delivery via backend API proxy
  try {
    const res = await fetch('/api/line-notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        token,
        channelAccessToken,
        webhookUrl,
        message,
        to: settings.toUserId,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      if (data.simulated) {
        // Backend noted this is a demo simulation
        const log: NotificationLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toISOString(),
          taskId,
          taskTitle,
          type,
          recipient: `${recipient} [โหมดจำลอง Demo]`,
          message,
          status: 'simulated',
          errorDetail: data.warning,
          provider: 'demo',
        };
        return {
          success: true,
          isReal: false,
          isDemo: true,
          status: 'simulated',
          log,
          message,
          errorDetail: data.warning,
          hint: 'คุณยังใช้ Demo Token ข้อความจะไม่ส่งเข้าโทรศัพท์จริง กรุณาใส่ Token ที่ได้จาก LINE ในหน้าตั้งค่า',
        };
      }

      // Truly sent to LINE!
      const log: NotificationLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        taskId,
        taskTitle,
        type,
        recipient,
        message,
        status: 'sent',
        provider,
      };
      return {
        success: true,
        isReal: true,
        isDemo: false,
        status: 'sent',
        log,
        message,
      };
    } else {
      // Server returned an error from LINE (e.g. 401, 400, 502)
      const errorDetail = data.error || `LINE ส่งกลับรหัสข้อผิดพลาด HTTP ${res.status}`;
      const log: NotificationLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        taskId,
        taskTitle,
        type,
        recipient,
        message,
        status: 'failed',
        errorDetail,
        provider,
      };
      return {
        success: false,
        isReal: false,
        isDemo,
        status: 'failed',
        log,
        message,
        errorDetail,
        hint: data.hint || 'โปรดตรวจสอบความถูกต้องของ Token หรือเชิญ LINE Notify เข้ากลุ่ม',
      };
    }
  } catch (err: any) {
    // Network failure reaching /api/line-notify
    const errorDetail = `ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์แจ้งเตือนได้ (${err.message || 'Network Error'})`;
    const log: NotificationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      taskId,
      taskTitle,
      type,
      recipient,
      message,
      status: 'failed',
      errorDetail,
      provider,
    };
    return {
      success: false,
      isReal: false,
      isDemo,
      status: 'failed',
      log,
      message,
      errorDetail,
      hint: 'กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
    };
  }
};
