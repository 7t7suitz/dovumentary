import React, { useState } from 'react';
import { ProductionProject } from '../types/production';
import { ProductionDashboard } from './ProductionDashboard';
import { ScheduleManager } from './ScheduleManager';
import { BudgetTracker } from './BudgetTracker';
import { TeamManager } from './TeamManager';
import { EquipmentManager } from './EquipmentManager';
import { DocumentGenerator } from './DocumentGenerator';
import { LegalComplianceChecker } from './LegalComplianceChecker';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  Users, 
  Camera, 
  FileText, 
  Shield, 
  Map,
  BarChart2,
  Settings,
  Menu,
  X
} from 'lucide-react';

interface ProductionManagementSystemProps {
  project: ProductionProject;
  onProjectUpdate: (project: ProductionProject) => void;
}

export const ProductionManagementSystem: React.FC<ProductionManagementSystemProps> = ({
  project,
  onProjectUpdate
}) => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const updateSchedule = (schedule: any) => {
    onProjectUpdate({
      ...project,
      schedule,
      updatedAt: new Date()
    });
  };

  const updateBudget = (budget: any) => {
    onProjectUpdate({
      ...project,
      budget,
      updatedAt: new Date()
    });
  };

  const updateTeam = (team: any) => {
    onProjectUpdate({
      ...project,
      team,
      updatedAt: new Date()
    });
  };

  const updateEquipment = (equipment: any) => {
    onProjectUpdate({
      ...project,
      equipment,
      updatedAt: new Date()
    });
  };

  const addDocument = (document: any) => {
    onProjectUpdate({
      ...project,
      documents: [...project.documents, document],
      updatedAt: new Date()
    });
  };

  const updateDocument = (document: any) => {
    onProjectUpdate({
      ...project,
      documents: project.documents.map(doc => doc.id === document.id ? document : doc),
      updatedAt: new Date()
    });
  };

  const deleteDocument = (documentId: string) => {
    onProjectUpdate({
      ...project,
      documents: project.documents.filter(doc => doc.id !== documentId),
      updatedAt: new Date()
    });
  };

  const addComplianceItem = (item: any) => {
    // In a real implementation, this would be a separate array in the project
    // For this demo, we'll just add it to the documents array
    const complianceDocument = {
      id: item.id,
      title: item.title,
      type: 'other' as any,
      content: item.description,
      createdBy: item.assignedTo,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: item.status === 'completed' ? 'final' : 'draft',
      sharedWith: [],
      notes: item.notes
    };
    
    onProjectUpdate({
      ...project,
      documents: [...project.documents, complianceDocument],
      updatedAt: new Date()
    });
  };

  const updateComplianceItem = (item: any) => {
    // In a real implementation, this would update the compliance item
    // For this demo, we'll just update the corresponding document
    onProjectUpdate({
      ...project,
      documents: project.documents.map(doc => 
        doc.id === item.id 
          ? {
              ...doc,
              title: item.title,
              content: item.description,
              status: item.status === 'completed' ? 'final' : 'draft',
              updatedAt: new Date(),
              notes: item.notes
            }
          : doc
      ),
      updatedAt: new Date()
    });
  };

  const deleteComplianceItem = (itemId: string) => {
    // In a real implementation, this would delete the compliance item
    // For this demo, we'll just delete the corresponding document
    onProjectUpdate({
      ...project,
      documents: project.documents.filter(doc => doc.id !== itemId),
      updatedAt: new Date()
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ProductionDashboard project={project} onNavigate={handleNavigate} />;
      case 'schedule':
        return <ScheduleManager schedule={project.schedule} locations={project.locations} team={project.team} onScheduleUpdate={updateSchedule} />;
      case 'budget':
        return <BudgetTracker budget={project.budget} onBudgetUpdate={updateBudget} />;
      case 'team':
        return <TeamManager team={project.team} onTeamUpdate={updateTeam} />;
      case 'equipment':
        return <EquipmentManager equipment={project.equipment} onEquipmentUpdate={updateEquipment} />;
      case 'documents':
        return (
          <DocumentGenerator 
            documents={project.documents} 
            team={project.team} 
            locations={project.locations} 
            shootDays={project.schedule.shootDays}
            scenes={project.schedule.shootDays.flatMap(day => day.scenes)}
            onDocumentCreate={addDocument}
            onDocumentUpdate={updateDocument}
            onDocumentDelete={deleteDocument}
          />
        );
      case 'legal':
        return (
          <LegalComplianceChecker 
            compliance={[]} // In a real implementation, this would be project.compliance
            documents={project.documents}
            team={project.team}
            onComplianceCreate={addComplianceItem}
            onComplianceUpdate={updateComplianceItem}
            onComplianceDelete={deleteComplianceItem}
          />
        );
      default:
        return <ProductionDashboard project={project} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-gray-900">Production Manager</h1>
                <p className="text-xs text-gray-500">v1.0.0</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="py-4">
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'budget', label: 'Budget', icon: DollarSign },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'equipment', label: 'Equipment', icon: Camera },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'legal', label: 'Legal', icon: Shield },
              { id: 'locations', label: 'Locations', icon: Map },
              { id: 'reports', label: 'Reports', icon: BarChart2 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 w-full ${
                    activeSection === item.id 
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-medium">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">John Director</p>
                <p className="text-xs text-gray-500">Project Owner</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};