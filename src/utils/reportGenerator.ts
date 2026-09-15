import { PRRequest, MonthlySummaryData, PRServiceType } from '../types';
import { PR_SERVICES_CONFIG } from '../data/initialData';

const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const getMonthNameThai = (monthIndex: number): string => {
  return THAI_MONTHS[monthIndex - 1] || `เดือน ${monthIndex}`;
};

/**
 * Generate monthly PR metrics summary
 */
export const calculateMonthlySummary = (
  requests: PRRequest[],
  year: number,
  month: number
): MonthlySummaryData => {
  // Filter requests belonging to this year & month (based on createdAt or neededDate)
  const monthRequests = requests.filter((req) => {
    const d = new Date(req.createdAt);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const totalRequests = monthRequests.length;
  const completedRequests = monthRequests.filter((r) => r.status === 'completed').length;
  const inProgressRequests = monthRequests.filter((r) => r.status === 'in_progress').length;
  const pendingRequests = monthRequests.filter((r) => r.status === 'pending').length;

  // On-time completion rate
  let onTimeCount = 0;
  let totalDaysSpent = 0;
  let measuredCompleted = 0;

  monthRequests.forEach((req) => {
    if (req.status === 'completed') {
      measuredCompleted++;
      const created = new Date(req.createdAt).getTime();
      const needed = new Date(req.neededDate).getTime();
      const updated = new Date(req.updatedAt).getTime();
      const diffDays = Math.max(1, Math.round((updated - created) / (1000 * 60 * 60 * 24)));
      totalDaysSpent += diffDays;

      if (updated <= needed + 24 * 60 * 60 * 1000) {
        onTimeCount++;
      }
    }
  });

  const onTimeCompletionRate =
    measuredCompleted > 0 ? Math.round((onTimeCount / measuredCompleted) * 100) : 100;
  const averageDurationDays =
    measuredCompleted > 0 ? Number((totalDaysSpent / measuredCompleted).toFixed(1)) : 2.5;

  // Breakdown by service
  const byService: Record<PRServiceType, number> = {
    poster: 0,
    photo: 0,
    facebook: 0,
    press: 0,
    video_edit: 0,
    print_media: 0,
  };

  monthRequests.forEach((req) => {
    if (byService[req.serviceType] !== undefined) {
      byService[req.serviceType]++;
    }
  });

  // Find top demanded service
  let topServiceType: PRServiceType = 'poster';
  let topServiceCount = -1;
  (Object.keys(byService) as PRServiceType[]).forEach((type) => {
    if (byService[type] > topServiceCount) {
      topServiceCount = byService[type];
      topServiceType = type;
    }
  });

  // Breakdown by department
  const byDepartment: Record<string, number> = {};
  monthRequests.forEach((req) => {
    byDepartment[req.department] = (byDepartment[req.department] || 0) + 1;
  });

  let topDeptName = 'ไม่มีข้อมูล';
  let topDeptCount = 0;
  Object.entries(byDepartment).forEach(([dept, count]) => {
    if (count > topDeptCount) {
      topDeptCount = count;
      topDeptName = dept;
    }
  });

  // Generate automated PR strategic analysis & suggestions
  const aiStrategicInsights: string[] = [];
  const completionPercent = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

  if (totalRequests === 0) {
    aiStrategicInsights.push('ยังไม่มีการบันทึกคำขอรับบริการในเดือนนี้ สามารถเริ่มต้นบันทึกคำขอใหม่หรือเลือกดูเดือนก่อนหน้า');
  } else {
    aiStrategicInsights.push(
      `📊 ประสิทธิภาพภาพรวม: มีการยื่นขอรับบริการทั้งสิ้น ${totalRequests} รายการ โดยดำเนินงานเสร็จสิ้น ${completedRequests} รายการ คิดเป็น ${completionPercent}% และมีอัตราส่งมอบตรงเวลาสูงถึง ${onTimeCompletionRate}%`
    );

    if (topServiceCount > 0) {
      const sLabel = PR_SERVICES_CONFIG[topServiceType]?.label || topServiceType;
      aiStrategicInsights.push(
        `🏆 บริการยอดนิยมอันดับ 1 คือ "${sLabel}" (${topServiceCount} รายการ) สะท้อนถึงความต้องการผลิตสื่ออัตลักษณ์องค์กรสูง แนะนำให้จัดสรรทีมกราฟิกและเตรียมเทมเพลตมาตรฐานล่วงหน้า`
      );
    }

    if (topDeptCount > 0) {
      aiStrategicInsights.push(
        `🏛️ หน่วยงานที่มีการประสานงานบ่อยที่สุด คือ "${topDeptName}" (${topDeptCount} รายการ) ควรจัดทำปฏิทินงานร่วมกันเพื่อวางแผนงานระยะยาวและลดคำของานด่วน`
      );
    }

    const urgentCount = monthRequests.filter((r) => r.urgency === 'urgent' || r.urgency === 'express').length;
    if (urgentCount > 0) {
      const urgentRatio = Math.round((urgentCount / totalRequests) * 100);
      aiStrategicInsights.push(
        `⚡ การบริหารงานด่วน: พบคำขอด่วนและด่วนพิเศษจำนวน ${urgentCount} รายการ (${urgentRatio}%) ควรเน้นย้ำแนวปฏิบัติการส่งข้อมูลล่วงหน้าอย่างน้อย 5-7 วันทำการ เพื่อรักษาคุณภาพการผลิตสื่อ`
      );
    }

    aiStrategicInsights.push(
      `📢 ข้อเสนอแนะเชิงกลยุทธ์: สื่อดิจิทัลบน Facebook และวิดีโอสั้นกำลังได้รับความสนใจ แนะนำให้ต่อยอดภาพถ่ายกิจกรรมเป็นภาพชุด Photo Album พร้อมคำบรรยายเชิงเล่าเรื่อง (Storytelling) เพื่อเพิ่มยอด Reach & Engagement ให้แก่องค์กร`
    );
  }

  return {
    year,
    month,
    monthNameThai: getMonthNameThai(month),
    totalRequests,
    completedRequests,
    inProgressRequests,
    pendingRequests,
    onTimeCompletionRate,
    averageDurationDays,
    byService,
    byDepartment,
    topDemandedService: {
      type: topServiceType,
      count: topServiceCount,
      label: PR_SERVICES_CONFIG[topServiceType]?.label || topServiceType,
    },
    topDepartment: {
      name: topDeptName,
      count: topDeptCount,
    },
    aiStrategicInsights,
  };
};

/**
 * Export Monthly Report as CSV
 */
export const exportReportToCSV = (summary: MonthlySummaryData, requests: PRRequest[]) => {
  const monthRequests = requests.filter((req) => {
    const d = new Date(req.createdAt);
    return d.getFullYear() === summary.year && d.getMonth() + 1 === summary.month;
  });

  const header = ['รหัสงาน', 'ชื่องาน', 'ประเภทบริการ', 'หน่วยงาน', 'ผู้ขอ', 'เบอร์โทร', 'สถานะ', 'ความเร่งด่วน', 'วันที่ต้องการ', 'วันที่สร้าง'];
  const rows = monthRequests.map((r) => [
    `"${r.id}"`,
    `"${r.title.replace(/"/g, '""')}"`,
    `"${PR_SERVICES_CONFIG[r.serviceType]?.label || r.serviceType}"`,
    `"${r.department}"`,
    `"${r.requesterName}"`,
    `"${r.requesterPhone}"`,
    `"${r.status}"`,
    `"${r.urgency}"`,
    `"${r.neededDate}"`,
    `"${new Date(r.createdAt).toLocaleDateString('th-TH')}"`,
  ]);

  const csvContent = '\uFEFF' + [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PR_Monthly_Report_${summary.monthNameThai}_${summary.year}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
