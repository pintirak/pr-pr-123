import React, { useState, useEffect, useMemo } from 'react';
import { 
  loadRequestsFromStorage, 
  saveRequestsToStorage, 
  loadSettingsFromStorage, 
  saveSettingsToStorage, 
  loadLogsFromStorage, 
  saveLogsToStorage 
} from './utils/storage';
import { PRRequest, PRTaskStatus, PRStaff, TaskDeliverable, LineNotificationSettings, NotificationLog } from './types';
import { Navbar } from './components/Navbar';
import { StatusStats } from './components/StatusStats';
import { ServiceFilterPills } from './components/ServiceFilterPills';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskListView } from './components/TaskListView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { NewRequestModal } from './components/NewRequestModal';
import { MonthlyReportView } from './components/MonthlyReportView';
import { LineSettingsModal } from './components/LineSettingsModal';
import { DeployModal } from './components/DeployModal';
import { dispatchLineNotification } from './utils/lineNotify';
import { 
  Kanban, 
  List, 
  Search, 
  Filter, 
  X, 
  Plus, 
  LayoutDashboard, 
  BarChart3, 
  BellRing, 
  Github, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Theme state: dark / light
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pr_system_theme_v1');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pr_system_theme_v1', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pr_system_theme_v1', 'light');
    }
  }, [darkMode]);

  // Main data states
  const [requests, setRequests] = useState<PRRequest[]>(() => loadRequestsFromStorage());
  const [settings, setSettings] = useState<LineNotificationSettings>(() => loadSettingsFromStorage());
  const [logs, setLogs] = useState<NotificationLog[]>(() => loadLogsFromStorage());

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'line' | 'deploy'>('dashboard');
  
  // Dashboard view toggle: kanban vs list
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filters & search
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedTask, setSelectedTask] = useState<PRRequest | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save requests to storage whenever modified
  useEffect(() => {
    saveRequestsToStorage(requests);
  }, [requests]);

  // Auto-save settings
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  // Auto-save logs
  useEffect(() => {
    saveLogsToStorage(logs);
  }, [logs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    return requests.filter((task) => {
      // Status filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'in_progress' && (task.status === 'in_progress' || task.status === 'revision')) {
          // match
        } else if (task.status !== selectedStatus) {
          return false;
        }
      }

      // Service filter
      if (selectedService !== 'all' && task.serviceType !== selectedService) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchId = task.id.toLowerCase().includes(query);
        const matchDept = task.department.toLowerCase().includes(query);
        const matchReq = task.requesterName.toLowerCase().includes(query);
        if (!matchTitle && !matchId && !matchDept && !matchReq) {
          return false;
        }
      }

      return true;
    });
  }, [requests, selectedStatus, selectedService, searchQuery]);

  // Handler: Create new request
  const handleCreateRequest = async (
    data: Omit<PRRequest, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'deliverables'>
  ) => {
    const nextIndex = requests.length + 1;
    const paddedIndex = String(nextIndex).padStart(3, '0');
    const currentYear = new Date().getFullYear();
    const newId = `PR-${currentYear}-${paddedIndex}`;

    const now = new Date().toISOString();
    const newRequest: PRRequest = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: now,
          action: 'ยื่นคำขอรับบริการงานประชาสัมพันธ์',
          note: `ยื่นคำขอสำเร็จ (${data.urgency === 'express' ? 'ด่วนพิเศษ 24ชม.' : data.urgency === 'urgent' ? 'ด่วน' : 'ปกติ'})`,
          author: data.requesterName,
        },
      ],
      deliverables: [],
    };

    const updated = [newRequest, ...requests];
    setRequests(updated);

    // Trigger LINE Notification
    if (settings.enabled && settings.notifyOnNewRequest) {
      const result = await dispatchLineNotification('new_request', settings, newRequest);
      setLogs((prev) => [result.log, ...prev]);
    }

    showToast(`✓ ยื่นคำขอ #${newId} สำเร็จและส่งแจ้งเตือนผ่าน LINE เรียบร้อย!`);
  };

  // Handler: Update status
  const handleUpdateStatus = async (taskId: string, newStatus: PRTaskStatus, note?: string) => {
    let updatedTaskRef: PRRequest | null = null;
    const now = new Date().toISOString();

    const updated = requests.map((task) => {
      if (task.id === taskId) {
        const actionTitle = 
          newStatus === 'completed'
            ? 'ส่งมอบงานและเสร็จสมบูรณ์'
            : newStatus === 'in_progress'
            ? 'กำลังดำเนินการผลิตสื่อ'
            : newStatus === 'review'
            ? 'ส่งแบบร่างให้ผู้ขอตรวจรับ'
            : newStatus === 'revision'
            ? 'รับข้อเสนอแนะและปรับแก้'
            : `ปรับสถานะเป็น ${newStatus}`;

        const updatedTimeline = [
          ...task.timeline,
          {
            id: `tl-${Date.now()}`,
            timestamp: now,
            action: actionTitle,
            note: note || undefined,
            author: 'เจ้าหน้าที่งานประชาสัมพันธ์',
          },
        ];

        const mod: PRRequest = {
          ...task,
          status: newStatus,
          updatedAt: now,
          timeline: updatedTimeline,
        };
        updatedTaskRef = mod;
        return mod;
      }
      return task;
    });

    setRequests(updated);
    if (selectedTask && selectedTask.id === taskId && updatedTaskRef) {
      setSelectedTask(updatedTaskRef);
    }

    // Trigger LINE Notification for status change
    if (updatedTaskRef && settings.enabled && settings.notifyOnStatusChange) {
      const notiType = newStatus === 'completed' ? 'delivery' : 'status_change';
      const result = await dispatchLineNotification(notiType, settings, updatedTaskRef, note);
      setLogs((prev) => [result.log, ...prev]);
    }

    showToast(`✓ อัปเดตสถานะงาน #${taskId} สำเร็จ`);
  };

  // Handler: Advance status in Kanban
  const handleAdvanceStatus = (taskId: string) => {
    const target = requests.find((r) => r.id === taskId);
    if (!target) return;

    const flow: Record<PRTaskStatus, PRTaskStatus> = {
      pending: 'in_progress',
      in_progress: 'review',
      review: 'completed',
      revision: 'review',
      completed: 'completed',
      cancelled: 'pending',
    };

    const nextStatus = flow[target.status];
    if (nextStatus && nextStatus !== target.status) {
      handleUpdateStatus(taskId, nextStatus);
    }
  };

  // Handler: Assign Staff
  const handleAssignStaff = (taskId: string, staff: PRStaff | null) => {
    const now = new Date().toISOString();
    const updated = requests.map((task) => {
      if (task.id === taskId) {
        const mod: PRRequest = {
          ...task,
          assignedStaff: staff,
          updatedAt: now,
          timeline: [
            ...task.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: now,
              action: staff ? `มอบหมายงานให้: ${staff.name}` : 'ยกเลิกการมอบหมายงาน',
              author: 'หัวหน้างานสื่อสารองค์กร',
            },
          ],
        };
        if (selectedTask?.id === taskId) setSelectedTask(mod);
        return mod;
      }
      return task;
    });
    setRequests(updated);
    showToast(staff ? `✓ มอบหมายงานให้ ${staff.name} เรียบร้อย` : 'ยกเลิกการมอบหมายแล้ว');
  };

  // Handler: Add Timeline Note
  const handleAddTimelineNote = (taskId: string, note: string) => {
    const now = new Date().toISOString();
    const updated = requests.map((task) => {
      if (task.id === taskId) {
        const mod: PRRequest = {
          ...task,
          updatedAt: now,
          timeline: [
            ...task.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: now,
              action: 'บันทึกความคืบหน้า',
              note,
              author: 'เจ้าหน้าที่งานประชาสัมพันธ์',
            },
          ],
        };
        if (selectedTask?.id === taskId) setSelectedTask(mod);
        return mod;
      }
      return task;
    });
    setRequests(updated);
    showToast('✓ บันทึกความคืบหน้าสำเร็จ');
  };

  // Handler: Add Deliverable
  const handleAddDeliverable = async (taskId: string, deliverable: TaskDeliverable) => {
    let updatedTaskRef: PRRequest | null = null;
    const now = new Date().toISOString();

    const updated = requests.map((task) => {
      if (task.id === taskId) {
        const mod: PRRequest = {
          ...task,
          deliverables: [...task.deliverables, deliverable],
          status: 'completed', // Auto-set to completed upon final delivery
          updatedAt: now,
          timeline: [
            ...task.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: now,
              action: `ส่งมอบผลงาน: ${deliverable.name}`,
              note: `ลิงก์ดาวน์โหลด: ${deliverable.url}`,
              author: 'ทีมผลิตสื่อประชาสัมพันธ์',
            },
          ],
        };
        updatedTaskRef = mod;
        if (selectedTask?.id === taskId) setSelectedTask(mod);
        return mod;
      }
      return task;
    });

    setRequests(updated);

    // Send LINE Delivery notification
    if (updatedTaskRef && settings.enabled && settings.notifyOnDelivery) {
      const res = await dispatchLineNotification('delivery', settings, updatedTaskRef);
      setLogs((prev) => [res.log, ...prev]);
    }

    showToast(`✓ ส่งมอบผลงานและแจ้งเตือนผ่าน LINE เรียบร้อย!`);
  };

  // Handler: Manual LINE Alert Trigger
  const handleTriggerLineAlert = async (task: PRRequest, customNote?: string) => {
    const res = await dispatchLineNotification('status_change', settings, task, customNote);
    setLogs((prev) => [res.log, ...prev]);
    showToast(`✓ ส่งแจ้งเตือน LINE สำหรับงาน #${task.id} สำเร็จ!`);
  };

  // Handler: Delete Task
  const handleDeleteTask = (taskId: string) => {
    const updated = requests.filter((r) => r.id !== taskId);
    setRequests(updated);
    showToast(`ลบคำขอ #${taskId} เรียบร้อยแล้ว`);
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenNewRequest={() => setIsNewRequestOpen(true)}
        onOpenDeployGuide={() => setActiveTab('deploy')}
        pendingCount={pendingCount}
      />

      {/* Dynamic Island Inspired Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top KPI Bento Metric Cards */}
            <StatusStats
              requests={requests}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />

            {/* Service Filters & View Switchers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              {/* Category Pills */}
              <div className="flex-1 overflow-hidden">
                <ServiceFilterPills
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                  requests={requests}
                />
              </div>

              {/* Search & View Switcher */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Search Box */}
                <div className="relative w-48 sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่องาน, รหัส, ผู้ขอ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-7 py-1.5 text-xs rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* View Mode Toggle: Kanban vs List (iOS Segmented Control) */}
                <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70">
                  <button
                    id="view-mode-kanban"
                    onClick={() => setViewMode('kanban')}
                    className={`p-1.5 rounded-xl transition-all ${
                      viewMode === 'kanban'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="มุมมอง Kanban Board"
                  >
                    <Kanban className="w-4 h-4" />
                  </button>
                  <button
                    id="view-mode-list"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-xl transition-all ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title="มุมมองตารางรายการ (List View)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Bar (if any applied) */}
            {(selectedStatus !== 'all' || selectedService !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">ตัวกรองที่เลือก:</span>
                {selectedStatus !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    สถานะ: {selectedStatus}
                    <button onClick={() => setSelectedStatus('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedService !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    บริการ: {selectedService}
                    <button onClick={() => setSelectedService('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    ค้นหา: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedService('all');
                    setSearchQuery('');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-2"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}

            {/* Main Views */}
            {viewMode === 'kanban' ? (
              <KanbanBoard
                requests={filteredRequests}
                onSelectTask={(task) => setSelectedTask(task)}
                onAdvanceStatus={handleAdvanceStatus}
                onOpenNewRequest={() => setIsNewRequestOpen(true)}
              />
            ) : (
              <TaskListView
                requests={filteredRequests}
                onSelectTask={(task) => setSelectedTask(task)}
                onQuickStatusChange={handleUpdateStatus}
              />
            )}

          </div>
        )}

        {/* TAB 2: MONTHLY REPORT */}
        {activeTab === 'report' && (
          <MonthlyReportView requests={requests} />
        )}

        {/* TAB 3: LINE NOTIFICATIONS */}
        {activeTab === 'line' && (
          <LineSettingsModal
            settings={settings}
            onSaveSettings={(newSettings) => {
              setSettings(newSettings);
              showToast('✓ บันทึกการตั้งค่า LINE สำเร็จ');
            }}
            logs={logs}
            onClearLogs={() => {
              setLogs([]);
              showToast('ล้างประวัติการแจ้งเตือนแล้ว');
            }}
            onAddLog={(log) => setLogs((prev) => [log, ...prev])}
          />
        )}

        {/* TAB 4: DEPLOY & FILEBASE GUIDE */}
        {activeTab === 'deploy' && (
          <DeployModal
            requests={requests}
            settings={settings}
            logs={logs}
            onDatabaseRestored={(fresh) => {
              setRequests(fresh.requests);
              setSettings(fresh.settings);
              setLogs(fresh.logs);
              showToast('✓ กู้คืนฐานข้อมูลเรียบร้อยแล้ว');
            }}
          />
        )}

      </main>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateStatus={handleUpdateStatus}
          onAssignStaff={handleAssignStaff}
          onAddTimelineNote={handleAddTimelineNote}
          onAddDeliverable={handleAddDeliverable}
          onTriggerLineAlert={handleTriggerLineAlert}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmit={handleCreateRequest}
      />

      {/* Mobile iOS Floating Bottom Bar (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-2 backdrop-blur-2xl bg-white/85 dark:bg-slate-950/85 border-t border-slate-200/80 dark:border-slate-800/80 shadow-lg">
        <div className="flex items-center justify-around">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
              activeTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px]">แดชบอร์ด</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
              activeTab === 'report' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px]">รายงานสรุป</span>
          </button>

          {/* Elevated Plus Button in Center */}
          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="flex items-center justify-center -mt-5 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab('line')}
            className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
              activeTab === 'line' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BellRing className="w-5 h-5" />
            <span className="text-[10px]">แจ้งเตือน</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
              activeTab === 'deploy' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Github className="w-5 h-5" />
            <span className="text-[10px]">Deploy</span>
          </button>

        </div>
      </div>

    </div>
  );
}
