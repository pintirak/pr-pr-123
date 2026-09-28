import React from 'react';
import { 
  Plus, 
  Moon, 
  Sun, 
  LayoutDashboard, 
  BarChart3, 
  BellRing, 
  Sparkles 
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'report' | 'line';
  setActiveTab: (tab: 'dashboard' | 'report' | 'line') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenNewRequest: () => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenNewRequest,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
              id="pr-brand-logo"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    PR SYSTEM
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    คณะพยาบาลศาสตร์ ม.นเรศวร
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                  ระบบบริการงานประชาสัมพันธ์ Faculty of Nursing, Naresuan University
                </p>
              </div>
            </div>
          </div>

          {/* iOS Segmented Navigation (Desktop) */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>แดชบอร์ดงาน</span>
              {pendingCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-amber-500 text-white">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-report"
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'report'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>สรุปผลรายเดือน</span>
            </button>

            <button
              id="nav-tab-line"
              onClick={() => setActiveTab('line')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'line'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>แจ้งเตือน LINE</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Dark / Light Mode Toggle: Single Icon Switch (โหมดกลางวัน/กลางคืน ไอคอนเดียวสลับ) */}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="สลับโหมดกลางวัน/กลางคืน"
              className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-300 active:scale-90 flex items-center justify-center border border-slate-200/70 dark:border-slate-700/70 shadow-xs"
              title={darkMode ? 'คลิกเพื่อสลับเป็นโหมดกลางวัน (Light Mode)' : 'คลิกเพื่อสลับเป็นโหมดกลางคืน (Dark Mode)'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-90 animate-in fade-in zoom-in" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 transition-transform duration-300 hover:-rotate-12 animate-in fade-in zoom-in" />
              )}
            </button>

            {/* Primary Action Button: New Request */}
            <button
              id="new-pr-request-btn"
              onClick={onOpenNewRequest}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">ยื่นขอรับบริการ PR</span>
              <span className="sm:hidden">ยื่นคำขอ</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation (iOS Style) is implemented in App.tsx */}
    </header>
  );
};
