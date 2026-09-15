import React from 'react';
import { PRRequest, PRTaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { Clock, TrendingUp, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';

interface KanbanBoardProps {
  requests: PRRequest[];
  onSelectTask: (task: PRRequest) => void;
  onAdvanceStatus: (taskId: string) => void;
  onOpenNewRequest: () => void;
}

interface ColumnConfig {
  id: string;
  title: string;
  statuses: PRTaskStatus[];
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  dotClass: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  requests,
  onSelectTask,
  onAdvanceStatus,
  onOpenNewRequest,
}) => {
  const columns: ColumnConfig[] = [
    {
      id: 'pending',
      title: 'รอดำเนินการ',
      statuses: ['pending'],
      icon: Clock,
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
      badgeText: 'text-amber-800 dark:text-amber-300',
      dotClass: 'bg-amber-500',
    },
    {
      id: 'in_progress',
      title: 'กำลังดำเนินการ / แก้ไข',
      statuses: ['in_progress', 'revision'],
      icon: TrendingUp,
      badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
      badgeText: 'text-blue-800 dark:text-blue-300',
      dotClass: 'bg-blue-500',
    },
    {
      id: 'review',
      title: 'รอตรวจรับงาน',
      statuses: ['review'],
      icon: AlertTriangle,
      badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
      badgeText: 'text-purple-800 dark:text-purple-300',
      dotClass: 'bg-purple-500',
    },
    {
      id: 'completed',
      title: 'เสร็จสิ้น & ส่งมอบ',
      statuses: ['completed'],
      icon: CheckCircle2,
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
      badgeText: 'text-emerald-800 dark:text-emerald-300',
      dotClass: 'bg-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
      {columns.map((col) => {
        const colTasks = requests.filter((r) => col.statuses.includes(r.status));
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            className="flex flex-col bg-slate-100/70 dark:bg-slate-900/50 p-3 sm:p-3.5 rounded-3xl border border-slate-200/70 dark:border-slate-800/80 min-h-[420px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dotClass}`} />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {col.title}
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badgeBg} ${col.badgeText}`}
              >
                {colTasks.length}
              </span>
            </div>

            {/* Task Cards in Column */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
              {colTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 my-auto">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    ไม่มีรายการในสถานะนี้
                  </p>
                  {col.id === 'pending' && (
                    <button
                      onClick={onOpenNewRequest}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มคำขอใหม่</span>
                    </button>
                  )}
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onSelectTask(task)}
                    onAdvanceStatus={onAdvanceStatus}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
