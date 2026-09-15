import React from 'react';
import { 
  Layers, 
  Palette, 
  Camera, 
  Share2, 
  Newspaper, 
  Video, 
  Printer 
} from 'lucide-react';
import { PRServiceType, PRRequest } from '../types';
import { PR_SERVICES_CONFIG } from '../data/initialData';

interface ServiceFilterPillsProps {
  selectedService: string;
  setSelectedService: (service: string) => void;
  requests: PRRequest[];
}

const SERVICE_ICONS: Record<string, React.ElementType> = {
  poster: Palette,
  photo: Camera,
  facebook: Share2,
  press: Newspaper,
  video_edit: Video,
  print_media: Printer,
};

export const ServiceFilterPills: React.FC<ServiceFilterPillsProps> = ({
  selectedService,
  setSelectedService,
  requests,
}) => {
  const serviceCounts: Record<string, number> = { all: requests.length };
  (Object.keys(PR_SERVICES_CONFIG) as PRServiceType[]).forEach((type) => {
    serviceCounts[type] = requests.filter((r) => r.serviceType === type).length;
  });

  const filterOptions = [
    { id: 'all', label: 'บริการทั้งหมด', icon: Layers },
    { id: 'poster', label: 'โปสเตอร์ & กราฟิก', icon: Palette },
    { id: 'photo', label: 'ถ่ายภาพกิจกรรม', icon: Camera },
    { id: 'facebook', label: 'ข่าว FB & โซเชียล', icon: Share2 },
    { id: 'video_edit', label: 'วิดีโอ & Reels', icon: Video },
    { id: 'print_media', label: 'สื่อสิ่งพิมพ์ & ไวนิล', icon: Printer },
    { id: 'press', label: 'งานแถลงข่าว / สื่อ', icon: Newspaper },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none py-1">
      {filterOptions.map((opt) => {
        const isSelected = selectedService === opt.id;
        const Icon = opt.icon;
        const count = serviceCounts[opt.id] || 0;

        return (
          <button
            key={opt.id}
            id={`filter-pill-${opt.id}`}
            onClick={() => setSelectedService(opt.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              isSelected
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/60'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{opt.label}</span>
            <span
              className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                isSelected
                  ? 'bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
