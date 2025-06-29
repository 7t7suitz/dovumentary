import React, { useState } from 'react';
import { ProductionProject, ProductionStatus, Milestone, Task } from '../types/production';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Camera, 
  Clock, 
  CheckSquare, 
  AlertCircle,
  BarChart2,
  FileText,
  Map,
  Settings,
  Plus,
  ChevronRight
} from 'lucide-react';

interface ProductionDashboardProps {
  project: ProductionProject;
  onNavigate: (section: string) => void;
}

export const ProductionDashboard: React.FC<ProductionDashboardProps> = ({
  project,
  onNavigate
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ProductionStatus | 'all'>('all');

  const getStatusColor = (status: ProductionStatus): string => {
    switch (status) {
      case 'pre-production':
        return 'bg-blue-100 text-blue-800';
      case 'production':
        return 'bg-green-100 text-green-800';
      case 'post-production':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status: string): string => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneStatusColor = (status: string): string => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: project.budget.currency || 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (): number => {
    const today = new Date();
    const endDate = new Date(project.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateProgress = (): number => {
    const totalTasks = project.schedule.preProductionTasks.length + 
                      project.schedule.postProductionTasks.length + 
                      project.schedule.distributionTasks.length;
    
    const completedTasks = project.schedule.preProductionTasks.filter(task => task.status === 'completed').length +
                          project.schedule.postProductionTasks.filter(task => task.status === 'completed').length +
                          project.schedule.distributionTasks.filter(task => task.status === 'completed').length;
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getUpcomingTasks = (): Task[] => {
    const today = new Date();
    const allTasks = [
      ...project.schedule.preProductionTasks,
      ...project.schedule.postProductionTasks,
      ...project.schedule.distributionTasks
    ];
    
    return allTasks
      .filter(task => 
        task.status !== 'completed' && 
        new Date(task.dueDate) >= today
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  };

  const getUpcomingMilestones = (): Milestone[] => {
    const today = new Date();
    
    return project.milestones
      .filter(milestone => 
        milestone.status !== 'completed' && 
        new Date(milestone.dueDate) >= today
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  };

  const getUpcomingShootDays = () => {
    const today = new Date();
    
    return project.schedule.shootDays
      .filter(day => 
        day.status !== 'completed' && 
        day.status !== 'cancelled' && 
        new Date(day.date) >= today
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </span>
            
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Timeline</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{calculateDaysRemaining()}</p>
            <p className="text-sm text-gray-600">Days remaining</p>
            <div className="mt-2 text-xs text-gray-500">
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-900">Budget</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(project.budget.remainingBudget)}</p>
            <p className="text-sm text-gray-600">Remaining</p>
            <div className="mt-2 text-xs text-gray-500">
              {formatCurrency(project.budget.allocatedBudget)} allocated
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckSquare className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-gray-900">Progress</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{calculateProgress()}%</p>
            <p className="text-sm text-gray-600">Tasks completed</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-amber-600" />
              <h3 className="font-medium text-gray-900">Team</h3>
            </div>
            <p className="text-2xl font-bold text-amber-600">{project.team.length}</p>
            <p className="text-sm text-gray-600">Team members</p>
            <div className="mt-2 text-xs text-gray-500">
              {project.team.filter(member => member.role === 'Director').length} directors, 
              {project.team.filter(member => member.role === 'Producer').length} producers
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('schedule')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Schedule</h3>
                <p className="text-sm text-gray-600">Manage production timeline</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('budget')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Budget</h3>
                <p className="text-sm text-gray-600">Track expenses and allocations</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div 
          className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('team')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Team</h3>
                <p className="text-sm text-gray-600">Manage crew and assignments</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
          <button
            onClick={() => onNavigate('tasks')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
        </div>
        
        {getUpcomingTasks().length === 0 ? (
          <div className="text-center py-6">
            <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Upcoming Tasks</h3>
            <p className="text-gray-600">All tasks have been completed or no tasks are scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {getUpcomingTasks().map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority).replace('bg-', 'bg-').replace('text-', '')}`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Due: {formatDate(task.dueDate)}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full ${getTaskStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(`task/${task.id}`);
                    }}
                    className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Milestones and Shoot Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milestones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Milestones</h2>
            <button
              onClick={() => onNavigate('milestones')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          
          {getUpcomingMilestones().length === 0 ? (
            <div className="text-center py-6">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Upcoming Milestones</h3>
              <p className="text-gray-600">All milestones have been completed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getUpcomingMilestones().map(milestone => (
                <div key={milestone.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMilestoneStatusColor(milestone.status)}`}>
                      {milestone.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                  <div className="text-xs text-gray-500">Due: {formatDate(milestone.dueDate)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Shoot Days */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Shoot Days</h2>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          
          {getUpcomingShootDays().length === 0 ? (
            <div className="text-center py-6">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Upcoming Shoot Days</h3>
              <p className="text-gray-600">No shoot days are currently scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getUpcomingShootDays().map(day => {
                const location = project.locations.find(loc => loc.id === day.locationId);
                return (
                  <div key={day.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{formatDate(day.date)}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        day.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        day.status === 'completed' ? 'bg-green-100 text-green-800' :
                        day.status === 'postponed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {day.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{day.callTime} - {day.wrapTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Map className="w-4 h-4" />
                      <span>{location?.name || 'Unknown location'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Budget Overview</h2>
          <button
            onClick={() => onNavigate('budget')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View Details
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Budget Utilization</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round((project.budget.allocatedBudget - project.budget.remainingBudget) / project.budget.allocatedBudget * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${Math.round((project.budget.allocatedBudget - project.budget.remainingBudget) / project.budget.allocatedBudget * 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Budget</div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(project.budget.totalBudget)}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Spent</div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(project.budget.allocatedBudget - project.budget.remainingBudget)}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Remaining</div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(project.budget.remainingBudget)}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Top Expense Categories</h3>
          <div className="space-y-2">
            {project.budget.categories
              .sort((a, b) => b.spent - a.spent)
              .slice(0, 3)
              .map(category => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(category.spent)}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button
            onClick={() => {/* View all activity */}}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {/* This would be populated with actual activity data */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">New call sheet created for <span className="font-medium">June 15th shoot</span></p>
              <p className="text-xs text-gray-500">2 hours ago by John Director</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Expense of <span className="font-medium">{formatCurrency(250)}</span> approved for equipment rental</p>
              <p className="text-xs text-gray-500">Yesterday by Sarah Producer</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">New team member <span className="font-medium">Mike Cameraman</span> added to the project</p>
              <p className="text-xs text-gray-500">2 days ago by Sarah Producer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('documents')}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm text-gray-700">Documents</span>
          </button>
          
          <button
            onClick={() => onNavigate('equipment')}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Camera className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm text-gray-700">Equipment</span>
          </button>
          
          <button
            onClick={() => onNavigate('locations')}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Map className="w-6 h-6 text-amber-600 mb-2" />
            <span className="text-sm text-gray-700">Locations</span>
          </button>
          
          <button
            onClick={() => onNavigate('reports')}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BarChart2 className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm text-gray-700">Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};