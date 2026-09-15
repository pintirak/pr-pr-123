import React from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Flame 
} from 'lucide-react';
import { PRRequest, PRTaskStatus } from '../types';

interface StatusStatsProps {
  requests: PRRequest[];
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export const StatusStats: React.FC<StatusStatsProps> = ({
  requests,
  selectedStatus,
  setSelectedStatus,
}) => {
  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'pending').length;
  const inProgress = requests.filter((r) => r.status === 'in_progress' || r.status === 'revision').length;
  const review = requests.filter((r) => r.status === 'review').length;
  const completed = requests.filter((r) => r.status === 'completed').length;
  const express = requests.filter((r) => r.urgency === 'express' && r.status !== 'completed').length;

  // On-time percentage calculation
  const completedTasks = requests.filter((r) => r.status === 'completed');
  let onTimeCount = 0;
  completedTasks.forEach((t) => {
    const updated = new Date(t.updatedAt).getTime();
    const needed = new Date(t.neededDate).getTime();
    if (updated <= needed + 24 * 60 * 60 * 1000) onTimeCount++;
  });
  const onTimeRate = completedTasks.length > 0 ? Math.round((onTimeCount / completedTasks.length) * 100) : 100;

  const stats = [
    {
      id: 'all',
      label: 'คำขอทั้งหมด',
      count: total,
      sublabel: 'ทุกสถานะในระบบ',
      icon: Inbox,
      activeColor: 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
      iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
    },
    {
      id: 'pending',
      label: 'รอดำเนินการ',
      count: pending,
      sublabel: 'รอตรวจสอบ/มอบหมาย',
      icon: Clock,
      activeColor: 'ring-2 ring-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
    },
    {
      id: 'in_progress',
      label: 'กำลังดำเนินการ',
      count: inProgress,
      sublabel: 'ทีม PR กำลังผลิตสื่อ',
      icon: TrendingUp,
      activeColor: 'ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20',
      iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300',
    },
    {
      id: 'review',
      label: 'รอตรวจรับงาน',
      count: review,
      sublabel: 'ส่งแบบร่างแล้ว',
      icon: AlertTriangle,
      activeColor: 'ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
      iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
    },
    {
      id: 'completed',
      label: 'เสร็จสมบูรณ์',
      count: completed,
      sublabel: `ตรงเวลา ${onTimeRate}%`,
      icon: CheckCircle2,
      activeColor: 'ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((item) => {
        const isSelected = selectedStatus === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            id={`stat-filter-${item.id}`}
            onClick={() => setSelectedStatus(isSelected && item.id !== 'all' ? 'all' : item.id)}
            className={`flex flex-col text-left p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 transition-all hover:shadow-sm active:scale-[0.98] ${
              isSelected ? item.activeColor : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${item.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              {item.id === 'pending' && express > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                  <Flame className="w-3 h-3" />
                  ด่วน {express}
                </span>
              )}
            </div>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {item.count}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
              {item.label}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {item.sublabel}
            </span>
          </button>
        );
      })}
    </div>
  );
};
