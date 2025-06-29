import React, { useState } from 'react';
import { Schedule, ShootDay, Task, Location, TeamMember } from '../types/production';
import { 
  Calendar, 
  Clock, 
  Map, 
  Users, 
  Camera, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Filter,
  Search,
  Download,
  Printer,
  ArrowLeft,
  ArrowRight,
  Check,
  X
} from 'lucide-react';

interface ScheduleManagerProps {
  schedule: Schedule;
  locations: Location[];
  team: TeamMember[];
  onScheduleUpdate: (schedule: Schedule) => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  schedule,
  locations,
  team,
  onScheduleUpdate
}) => {
  const [view, setView] = useState<'calendar' | 'list' | 'gantt'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddShootDay, setShowAddShootDay] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskType, setTaskType] = useState<'pre' | 'post' | 'distribution'>('pre');
  const [newShootDay, setNewShootDay] = useState<Partial<ShootDay>>({
    date: new Date(),
    callTime: '08:00',
    wrapTime: '18:00',
    status: 'scheduled',
    scenes: [],
    teamMembers: [],
    equipment: [],
    notes: ''
  });
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignedTo: [],
    startDate: new Date(),
    dueDate: new Date(),
    status: 'not-started',
    priority: 'medium',
    dependencies: [],
    progress: 0,
    notes: ''
  });
  const [filter, setFilter] = useState({
    status: 'all',
    location: 'all',
    team: 'all'
  });

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ day, date });
    }
    
    return days;
  };

  const getShootDaysForDate = (date: Date) => {
    if (!date) return [];
    
    return schedule.shootDays.filter(shootDay => {
      const shootDate = new Date(shootDay.date);
      return shootDate.getDate() === date.getDate() &&
             shootDate.getMonth() === date.getMonth() &&
             shootDate.getFullYear() === date.getFullYear();
    });
  };

  const getTasksForDate = (date: Date) => {
    if (!date) return [];
    
    const allTasks = [
      ...schedule.preProductionTasks,
      ...schedule.postProductionTasks,
      ...schedule.distributionTasks
    ];
    
    return allTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const handleAddShootDay = () => {
    if (!newShootDay.date || !newShootDay.callTime || !newShootDay.wrapTime || !newShootDay.locationId) return;
    
    const shootDay: ShootDay = {
      id: generateId(),
      date: new Date(newShootDay.date),
      locationId: newShootDay.locationId as string,
      callTime: newShootDay.callTime as string,
      wrapTime: newShootDay.wrapTime as string,
      scenes: newShootDay.scenes || [],
      teamMembers: newShootDay.teamMembers || [],
      equipment: newShootDay.equipment || [],
      status: newShootDay.status as 'scheduled' | 'completed' | 'cancelled' | 'postponed',
      notes: newShootDay.notes || ''
    };
    
    onScheduleUpdate({
      ...schedule,
      shootDays: [...schedule.shootDays, shootDay]
    });
    
    setNewShootDay({
      date: new Date(),
      callTime: '08:00',
      wrapTime: '18:00',
      status: 'scheduled',
      scenes: [],
      teamMembers: [],
      equipment: [],
      notes: ''
    });
    
    setShowAddShootDay(false);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.startDate || !newTask.dueDate) return;
    
    const task: Task = {
      id: generateId(),
      title: newTask.title,
      description: newTask.description || '',
      assignedTo: newTask.assignedTo || [],
      startDate: new Date(newTask.startDate),
      dueDate: new Date(newTask.dueDate),
      status: newTask.status as 'not-started' | 'in-progress' | 'completed' | 'blocked',
      priority: newTask.priority as 'low' | 'medium' | 'high' | 'critical',
      dependencies: newTask.dependencies || [],
      progress: newTask.progress || 0,
      notes: newTask.notes || ''
    };
    
    let updatedSchedule = { ...schedule };
    
    if (taskType === 'pre') {
      updatedSchedule.preProductionTasks = [...updatedSchedule.preProductionTasks, task];
    } else if (taskType === 'post') {
      updatedSchedule.postProductionTasks = [...updatedSchedule.postProductionTasks, task];
    } else {
      updatedSchedule.distributionTasks = [...updatedSchedule.distributionTasks, task];
    }
    
    onScheduleUpdate(updatedSchedule);
    
    setNewTask({
      title: '',
      description: '',
      assignedTo: [],
      startDate: new Date(),
      dueDate: new Date(),
      status: 'not-started',
      priority: 'medium',
      dependencies: [],
      progress: 0,
      notes: ''
    });
    
    setShowAddTask(false);
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'postponed':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Production Schedule</h1>
            <p className="text-gray-600 mt-1">Manage shoot days, tasks, and timelines</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1 ${view === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Calendar
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                List
              </button>
              <button
                onClick={() => setView('gantt')}
                className={`px-3 py-1 ${view === 'gantt' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Gantt
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddShootDay(true)}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                <span>Shoot Day</span>
              </button>
              
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Task</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search schedule..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="postponed">Postponed</option>
          </select>
          
          <select
            value={filter.location}
            onChange={(e) => setFilter(prev => ({ ...prev, location: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
          
          <select
            value={filter.team}
            onChange={(e) => setFilter(prev => ({ ...prev, team: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Team Members</option>
            {team.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => {/* Export functionality */}}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Export Schedule"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {/* Print functionality */}}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Print Schedule"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Today
              </button>
              
              <button
                onClick={handleNextMonth}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-700 py-2">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {generateCalendarDays().map((day, index) => {
              const isToday = day.date && 
                new Date().getDate() === day.date.getDate() &&
                new Date().getMonth() === day.date.getMonth() &&
                new Date().getFullYear() === day.date.getFullYear();
              
              const isSelected = selectedDate && day.date &&
                selectedDate.getDate() === day.date.getDate() &&
                selectedDate.getMonth() === day.date.getMonth() &&
                selectedDate.getFullYear() === day.date.getFullYear();
              
              const shootDays = day.date ? getShootDaysForDate(day.date) : [];
              const tasks = day.date ? getTasksForDate(day.date) : [];
              
              return (
                <div 
                  key={index}
                  className={`min-h-[100px] p-2 border ${
                    day.day ? 'border-gray-200' : 'border-transparent bg-gray-50'
                  } ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => day.date && handleDateClick(day.date)}
                >
                  {day.day && (
                    <>
                      <div className="text-right mb-1">
                        <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                          {day.day}
                        </span>
                      </div>
                      
                      {/* Shoot days */}
                      {shootDays.length > 0 && (
                        <div className="space-y-1 mb-1">
                          {shootDays.map(shootDay => (
                            <div 
                              key={shootDay.id}
                              className="text-xs p-1 bg-green-100 text-green-800 rounded overflow-hidden text-ellipsis whitespace-nowrap"
                              title={`${shootDay.callTime} - ${shootDay.wrapTime}`}
                            >
                              <Camera className="w-3 h-3 inline mr-1" />
                              {locations.find(loc => loc.id === shootDay.locationId)?.name || 'Shoot'}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Tasks */}
                      {tasks.length > 0 && (
                        <div className="space-y-1">
                          {tasks.slice(0, 2).map(task => (
                            <div 
                              key={task.id}
                              className={`text-xs p-1 rounded overflow-hidden text-ellipsis whitespace-nowrap ${
                                task.priority === 'high' || task.priority === 'critical' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                              title={task.title}
                            >
                              {task.title}
                            </div>
                          ))}
                          
                          {tasks.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{tasks.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shoot Days</h2>
            
            {schedule.shootDays.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Shoot Days Scheduled</h3>
                <p className="text-gray-600 mb-4">Add your first shoot day to get started</p>
                <button
                  onClick={() => setShowAddShootDay(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Shoot Day
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Call Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schedule.shootDays
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(shootDay => {
                        const location = locations.find(loc => loc.id === shootDay.locationId);
                        return (
                          <tr key={shootDay.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{formatDate(shootDay.date)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{location?.name || 'Unknown location'}</div>
                              <div className="text-xs text-gray-500">{location?.address.split(',')[0]}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{shootDay.callTime} - {shootDay.wrapTime}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shootDay.status)}`}>
                                {shootDay.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex -space-x-2">
                                {shootDay.teamMembers.slice(0, 3).map(memberId => {
                                  const member = team.find(m => m.id === memberId);
                                  return (
                                    <div key={memberId} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white" title={member?.name}>
                                      {member?.name.charAt(0) || '?'}
                                    </div>
                                  );
                                })}
                                {shootDay.teamMembers.length > 3 && (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                                    +{shootDay.teamMembers.length - 3}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>
            
            <div className="mb-4 flex items-center space-x-2">
              <button
                onClick={() => setTaskType('pre')}
                className={`px-3 py-1 rounded-lg ${taskType === 'pre' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Pre-Production
              </button>
              <button
                onClick={() => setTaskType('post')}
                className={`px-3 py-1 rounded-lg ${taskType === 'post' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Post-Production
              </button>
              <button
                onClick={() => setTaskType('distribution')}
                className={`px-3 py-1 rounded-lg ${taskType === 'distribution' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Distribution
              </button>
            </div>
            
            {(taskType === 'pre' && schedule.preProductionTasks.length === 0) ||
             (taskType === 'post' && schedule.postProductionTasks.length === 0) ||
             (taskType === 'distribution' && schedule.distributionTasks.length === 0) ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Tasks</h3>
                <p className="text-gray-600 mb-4">Add your first task to get started</p>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Task
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(taskType === 'pre' ? schedule.preProductionTasks :
                      taskType === 'post' ? schedule.postProductionTasks :
                      schedule.distributionTasks)
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                      .map(task => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                            <div className="text-xs text-gray-500">{task.description.substring(0, 50)}{task.description.length > 50 ? '...' : ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex -space-x-2">
                              {task.assignedTo.slice(0, 3).map(memberId => {
                                const member = team.find(m => m.id === memberId);
                                return (
                                  <div key={memberId} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white" title={member?.name}>
                                    {member?.name.charAt(0) || '?'}
                                  </div>
                                );
                              })}
                              {task.assignedTo.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                                  +{task.assignedTo.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(task.dueDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-500">{task.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gantt View */}
      {view === 'gantt' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gantt Chart View</h3>
            <p className="text-gray-600">A visual timeline of all production tasks and shoot days</p>
            {/* In a real implementation, this would be a proper Gantt chart */}
            <div className="mt-4 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Gantt chart visualization would be displayed here</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Shoot Day Modal */}
      {showAddShootDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Shoot Day</h2>
                <button
                  onClick={() => setShowAddShootDay(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newShootDay.date ? new Date(newShootDay.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewShootDay({ ...newShootDay, date: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    value={newShootDay.locationId || ''}
                    onChange={(e) => setNewShootDay({ ...newShootDay, locationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Call Time
                    </label>
                    <input
                      type="time"
                      value={newShootDay.callTime}
                      onChange={(e) => setNewShootDay({ ...newShootDay, callTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wrap Time
                    </label>
                    <input
                      type="time"
                      value={newShootDay.wrapTime}
                      onChange={(e) => setNewShootDay({ ...newShootDay, wrapTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newShootDay.status}
                    onChange={(e) => setNewShootDay({ ...newShootDay, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="postponed">Postponed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Members
                  </label>
                  <select
                    multiple
                    value={newShootDay.teamMembers || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setNewShootDay({ ...newShootDay, teamMembers: values });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    size={3}
                  >
                    {team.map(member => (
                      <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newShootDay.notes}
                    onChange={(e) => setNewShootDay({ ...newShootDay, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddShootDay(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddShootDay}
                  disabled={!newShootDay.date || !newShootDay.locationId || !newShootDay.callTime || !newShootDay.wrapTime}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Shoot Day
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Task</h2>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Type
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTaskType('pre')}
                      className={`flex-1 px-3 py-2 rounded-md ${taskType === 'pre' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Pre-Production
                    </button>
                    <button
                      onClick={() => setTaskType('post')}
                      className={`flex-1 px-3 py-2 rounded-md ${taskType === 'post' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Post-Production
                    </button>
                    <button
                      onClick={() => setTaskType('distribution')}
                      className={`flex-1 px-3 py-2 rounded-md ${taskType === 'distribution' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Distribution
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Task description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newTask.startDate ? new Date(newTask.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewTask({ ...newTask, startDate: new Date(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <select
                    multiple
                    value={newTask.assignedTo || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setNewTask({ ...newTask, assignedTo: values });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    size={3}
                  >
                    {team.map(member => (
                      <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress ({newTask.progress || 0}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newTask.progress || 0}
                    onChange={(e) => setNewTask({ ...newTask, progress: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!newTask.title || !newTask.startDate || !newTask.dueDate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};