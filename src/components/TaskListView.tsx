import React, { useState } from 'react';
import { PRRequest, PRTaskStatus } from '../types';
import { PR_SERVICES_CONFIG, STATUS_CONFIG, URGENCY_CONFIG } from '../data/initialData';
import { 
  Building2, 
  Calendar, 
  Flame, 
  ChevronRight,
  ArrowUpDown,
  Search
} from 'lucide-react';

interface TaskListViewProps {
  requests: PRRequest[];
  onSelectTask: (task: PRRequest) => void;
  onQuickStatusChange: (taskId: string, newStatus: PRTaskStatus) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  requests,
  onSelectTask,
  onQuickStatusChange,
}) => {
  const [sortField, setSortField] = useState<'neededDate' | 'createdAt' | 'urgency'>('neededDate');
  const [sortAsc, setSortAsc] = useState(true);

  const sortedRequests = [...requests].sort((a, b) => {
    if (sortField === 'neededDate') {
      return sortAsc
        ? new Date(a.neededDate).getTime() - new Date(b.neededDate).getTime()
        : new Date(b.neededDate).getTime() - new Date(a.neededDate).getTime();
    }
    if (sortField === 'createdAt') {
      return sortAsc
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortField === 'urgency') {
      const rank = { express: 3, urgent: 2, normal: 1 };
      return sortAsc ? rank[a.urgency] - rank[b.urgency] : rank[b.urgency] - rank[a.urgency];
    }
    return 0;
  });

  const toggleSort = (field: 'neededDate' | 'createdAt' | 'urgency') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">
              <th className="py-3.5 px-4">รหัส / บริการ</th>
              <th className="py-3.5 px-4">ชื่องาน & วัตถุประสงค์</th>
              <th className="py-3.5 px-4">หน่วยงาน & ผู้ขอ</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-blue-600" onClick={() => toggleSort('urgency')}>
                <div className="flex items-center gap-1">
                  <span>ความเร่งด่วน</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-blue-600" onClick={() => toggleSort('neededDate')}>
                <div className="flex items-center gap-1">
                  <span>กำหนดส่ง / ใช้งาน</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-4">ผู้รับผิดชอบ</th>
              <th className="py-3.5 px-4">สถานะปัจจุบัน</th>
              <th className="py-3.5 px-4 text-right">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {sortedRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  ไม่พบรายการคำขอตามตัวกรองที่เลือก
                </td>
              </tr>
            ) : (
              sortedRequests.map((task) => {
                const service = PR_SERVICES_CONFIG[task.serviceType];
                const status = STATUS_CONFIG[task.status];
                const urgency = URGENCY_CONFIG[task.urgency];

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectTask(task)}
                  >
                    {/* ID & Service */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                        #{task.id}
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[11px] font-semibold ${service.badgeBg} ${service.badgeText}`}>
                        {service.label.split('/')[0]}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {task.title}
                      </span>
                    </td>

                    {/* Department & Requester */}
                    <td className="py-3.5 px-4 text-xs">
                      <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{task.department}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {task.requesterName}
                      </div>
                    </td>

                    {/* Urgency */}
                    <td className="py-3.5 px-4">
                      {task.urgency === 'express' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                          <Flame className="w-3 h-3" />
                          24ชม.
                        </span>
                      ) : (
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${urgency.badgeClass}`}>
                          {urgency.label}
                        </span>
                      )}
                    </td>

                    {/* Needed Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(task.neededDate).toLocaleDateString('th-TH')}</span>
                      </div>
                      {task.neededTime && (
                        <span className="text-[11px] text-slate-400 block ml-5">
                          เวลา {task.neededTime}
                        </span>
                      )}
                    </td>

                    {/* Staff */}
                    <td className="py-3.5 px-4">
                      {task.assignedStaff ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={task.assignedStaff.avatar}
                            alt={task.assignedStaff.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                            {task.assignedStaff.name.split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">ยังไม่มอบหมาย</span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) => onQuickStatusChange(task.id, e.target.value as PRTaskStatus)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
                      >
                        <option value="pending">รอดำเนินการ</option>
                        <option value="in_progress">กำลังดำเนินการ</option>
                        <option value="review">รอตรวจรับงาน</option>
                        <option value="revision">กำลังแก้ไข</option>
                        <option value="completed">เสร็จสมบูรณ์</option>
                        <option value="cancelled">ยกเลิก</option>
                      </select>
                    </td>

                    {/* Detail Chevron */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
