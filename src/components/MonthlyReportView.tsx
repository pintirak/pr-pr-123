import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2, 
  Layers, 
  Award,
  ChevronLeft,
  ChevronRight,
  Palette,
  Camera,
  Share2,
  Newspaper,
  Video,
  Printer as PrintIcon
} from 'lucide-react';
import { PRRequest, PRServiceType } from '../types';
import { calculateMonthlySummary, exportReportToCSV, getMonthNameThai } from '../utils/reportGenerator';
import { PR_SERVICES_CONFIG } from '../data/initialData';

interface MonthlyReportViewProps {
  requests: PRRequest[];
}

const SERVICE_ICONS: Record<PRServiceType, React.ElementType> = {
  poster: Palette,
  photo: Camera,
  facebook: Share2,
  press: Newspaper,
  video_edit: Video,
  print_media: PrintIcon,
};

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({ requests }) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);

  const summary = calculateMonthlySummary(requests, selectedYear, selectedMonth);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportReportToCSV(summary, requests);
  };

  const buddhistYear = selectedYear + 543;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Top Controls: Month Selector & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm no-print">
        
        {/* Month Picker */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-base font-bold text-slate-900 dark:text-white">
              ประจำเดือน {summary.monthNameThai} พ.ศ. {buddhistYear} ({selectedYear})
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์รายงานสรุป (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[32px] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-2">
              <Award className="w-3.5 h-3.5" />
              รายงานผลการดำเนินงานด้านการบริการประชาสัมพันธ์
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              PR Performance Executive Report
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              สรุปข้อมูลการให้บริการ ประสิทธิภาพการส่งมอบ และตัวชี้วัดความสำเร็จ ประจำเดือน {summary.monthNameThai} {buddhistYear}
            </p>
          </div>

          <div className="text-right md:border-l md:border-white/20 md:pl-6">
            <span className="text-xs uppercase text-blue-200 tracking-wider">คำขอรับบริการทั้งหมด</span>
            <div className="text-4xl sm:text-5xl font-black">{summary.totalRequests}</div>
            <span className="text-xs text-blue-200">รายการในรอบเดือนนี้</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Completed Rate */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              {summary.totalRequests > 0 ? Math.round((summary.completedRequests / summary.totalRequests) * 100) : 0}%
            </span>
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {summary.completedRequests}
          </span>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            งานที่เสร็จสมบูรณ์
          </p>
          <p className="text-[11px] text-slate-400">
            จากทั้งหมด {summary.totalRequests} รายการ
          </p>
        </div>

        {/* Metric 2: On-Time Rate */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
              SLA Goal
            </span>
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {summary.onTimeCompletionRate}%
          </span>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            อัตราส่งมอบตรงเวลา
          </p>
          <p className="text-[11px] text-slate-400">
            ตรงตามกำหนดนัดหมาย
          </p>
        </div>

        {/* Metric 3: Average Duration */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
              Turnaround
            </span>
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {summary.averageDurationDays}
          </span>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            เวลาเฉลี่ยในการผลิต (วัน)
          </p>
          <p className="text-[11px] text-slate-400">
            นับจากยื่นคำขอจนส่งมอบ
          </p>
        </div>

        {/* Metric 4: In Progress & Pending */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <Layers className="w-5 h-5" />
            <span className="text-xs font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {summary.inProgressRequests + summary.pendingRequests}
          </span>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            งานที่กำลังดำเนินการ
          </p>
          <p className="text-[11px] text-slate-400">
            กำลังผลิต {summary.inProgressRequests} • รอเริ่ม {summary.pendingRequests}
          </p>
        </div>

      </div>

      {/* Two Columns: Service Distribution & Top Department Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Service Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>สัดส่วนคำขอแยกตามประเภทบริการ</span>
            </h3>
            <span className="text-xs text-slate-400">
              สูงสุด: {summary.topDemandedService.label.split('/')[0]}
            </span>
          </div>

          <div className="space-y-3">
            {(Object.keys(summary.byService) as PRServiceType[]).map((type) => {
              const count = summary.byService[type];
              const cfg = PR_SERVICES_CONFIG[type];
              const Icon = SERVICE_ICONS[type];
              const percent = summary.totalRequests > 0 ? Math.round((count / summary.totalRequests) * 100) : 0;

              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cfg.label}</span>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {count} งาน ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: cfg.accentColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Rankings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>หน่วยงาน / คณะ ที่ใช้บริการสูงสุด</span>
            </h3>
            <span className="text-xs text-slate-400">
              {Object.keys(summary.byDepartment).length} หน่วยงาน
            </span>
          </div>

          <div className="space-y-2.5">
            {Object.keys(summary.byDepartment).length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">
                ยังไม่มีข้อมูลการใช้บริการในเดือนนี้
              </p>
            ) : (
              Object.entries(summary.byDepartment)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([dept, count], idx) => {
                  const percent = summary.totalRequests > 0 ? Math.round((count / summary.totalRequests) * 100) : 0;
                  return (
                    <div
                      key={dept}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-[11px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{dept}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white">{count} รายการ</span>
                        <span className="text-[10px] text-slate-400 block">{percent}% ของทั้งหมด</span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

      </div>

      {/* Automated Strategic PR Insights */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              บทวิเคราะห์และข้อเสนอแนะเชิงกลยุทธ์การประชาสัมพันธ์ (PR Strategic Insights)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              วิเคราะห์อัตโนมัติจากข้อมูลการปฏิบัติงาน เพื่อยกระดับการสื่อสารองค์กรอย่างต่อเนื่อง
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {summary.aiStrategicInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              {insight}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
