import React from 'react';
import { 
  Calendar, 
  Paperclip, 
  CheckCircle, 
  Flame, 
  ArrowRight, 
  Building2,
  Palette,
  Camera,
  Share2,
  Newspaper,
  Video,
  Printer
} from 'lucide-react';
import { PRRequest } from '../types';
import { PR_SERVICES_CONFIG, STATUS_CONFIG, URGENCY_CONFIG } from '../data/initialData';

interface TaskCardProps {
  task: PRRequest;
  onClick: () => void;
  onAdvanceStatus?: (taskId: string) => void;
}

const SERVICE_ICONS: Record<string, React.ElementType> = {
  poster: Palette,
  photo: Camera,
  facebook: Share2,
  press: Newspaper,
  video_edit: Video,
  print_media: Printer,
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onAdvanceStatus }) => {
  const serviceConfig = PR_SERVICES_CONFIG[task.serviceType];
  const statusConfig = STATUS_CONFIG[task.status];
  const urgencyConfig = URGENCY_CONFIG[task.urgency];
  const ServiceIcon = SERVICE_ICONS[task.serviceType] || Palette;

  // Calculate days remaining
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const needed = new Date(task.neededDate);
  needed.setHours(0, 0, 0, 0);
  const diffTime = needed.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let deadlineLabel = '';
  let deadlineColor = 'text-slate-500 dark:text-slate-400';
  if (task.status === 'completed') {
    deadlineLabel = 'ส่งมอบแล้ว';
    deadlineColor = 'text-emerald-600 dark:text-emerald-400';
  } else if (diffDays < 0) {
    deadlineLabel = `เลยกำหนด ${Math.abs(diffDays)} วัน`;
    deadlineColor = 'text-rose-600 dark:text-rose-400 font-bold';
  } else if (diffDays === 0) {
    deadlineLabel = 'กำหนดส่งวันนี้!';
    deadlineColor = 'text-amber-600 dark:text-amber-400 font-bold';
  } else {
    deadlineLabel = `อีก ${diffDays} วัน`;
    deadlineColor = diffDays <= 2 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-slate-500 dark:text-slate-400';
  }

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900/90 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700/60 transition-all cursor-pointer select-none"
    >
      {/* Top Header: Service Tag & Urgency */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold ${serviceConfig.badgeBg} ${serviceConfig.badgeText}`}
        >
          <ServiceIcon className="w-3.5 h-3.5" />
          <span>{serviceConfig.label.split('/')[0]}</span>
        </span>

        <div className="flex items-center gap-1.5">
          {task.urgency === 'express' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
              <Flame className="w-3 h-3" />
              24 ชม.
            </span>
          )}
          <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500">
            #{task.id}
          </span>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {task.title}
      </h4>

      {/* Department & Requester */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
        <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
        <span className="truncate">{task.department}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 my-2.5" />

      {/* Bottom Meta & Staff */}
      <div className="flex items-center justify-between text-xs">
        {/* Date / Deadline */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className={deadlineColor}>{deadlineLabel}</span>
        </div>

        {/* Staff Avatar & Attachment badge */}
        <div className="flex items-center gap-2">
          {task.attachments.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <Paperclip className="w-3 h-3" />
              {task.attachments.length}
            </span>
          )}

          {task.assignedStaff ? (
            <img
              src={task.assignedStaff.avatar}
              alt={task.assignedStaff.name}
              title={`ผู้รับผิดชอบ: ${task.assignedStaff.name}`}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
            />
          ) : (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              รอระบุ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
