import React, { useState } from 'react';
import { LegalCompliance, Document, TeamMember } from '../types/production';
import { 
  Shield, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  FileText, 
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LegalComplianceCheckerProps {
  compliance: LegalCompliance[];
  documents: Document[];
  team: TeamMember[];
  onComplianceCreate: (compliance: LegalCompliance) => void;
  onComplianceUpdate: (compliance: LegalCompliance) => void;
  onComplianceDelete: (complianceId: string) => void;
}

export const LegalComplianceChecker: React.FC<LegalComplianceCheckerProps> = ({
  compliance,
  documents,
  team,
  onComplianceCreate,
  onComplianceUpdate,
  onComplianceDelete
}) => {
  const [showAddCompliance, setShowAddCompliance] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'all'
  });
  const [newCompliance, setNewCompliance] = useState<Partial<LegalCompliance>>({
    title: '',
    description: '',
    category: 'permit',
    status: 'pending',
    assignedTo: '',
    documents: [],
    notes: ''
  });

  const toggleItemExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleAddCompliance = () => {
    if (!newCompliance.title || !newCompliance.category || !newCompliance.assignedTo) return;
    
    const item: LegalCompliance = {
      id: generateId(),
      title: newCompliance.title,
      description: newCompliance.description || '',
      category: newCompliance.category as any,
      status: newCompliance.status as any,
      dueDate: newCompliance.dueDate,
      assignedTo: newCompliance.assignedTo,
      documents: newCompliance.documents || [],
      notes: newCompliance.notes || ''
    };
    
    onComplianceCreate(item);
    
    setNewCompliance({
      title: '',
      description: '',
      category: 'permit',
      status: 'pending',
      assignedTo: '',
      documents: [],
      notes: ''
    });
    
    setShowAddCompliance(false);
  };

  const handleDeleteCompliance = (itemId: string) => {
    onComplianceDelete(itemId);
  };

  const handleStatusChange = (itemId: string, status: 'pending' | 'completed' | 'not-required' | 'issue') => {
    const item = compliance.find(c => c.id === itemId);
    if (!item) return;
    
    onComplianceUpdate({
      ...item,
      status
    });
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const formatDate = (date?: Date): string => {
    if (!date) return 'No date set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'not-required':
        return 'bg-gray-100 text-gray-800';
      case 'issue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'permit':
        return 'bg-blue-100 text-blue-800';
      case 'release':
        return 'bg-green-100 text-green-800';
      case 'copyright':
        return 'bg-purple-100 text-purple-800';
      case 'insurance':
        return 'bg-amber-100 text-amber-800';
      case 'safety':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredCompliance = () => {
    return compliance.filter(item => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDescription = item.description.toLowerCase().includes(query);
        const matchesNotes = item.notes.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesDescription && !matchesNotes) {
          return false;
        }
      }
      
      // Filter by category
      if (filter.category !== 'all' && item.category !== filter.category) {
        return false;
      }
      
      // Filter by status
      if (filter.status !== 'all' && item.status !== filter.status) {
        return false;
      }
      
      return true;
    });
  };

  const calculateComplianceProgress = (): number => {
    const total = compliance.length;
    if (total === 0) return 0;
    
    const completed = compliance.filter(item => item.status === 'completed' || item.status === 'not-required').length;
    return Math.round((completed / total) * 100);
  };

  const getComplianceIssues = (): LegalCompliance[] => {
    return compliance.filter(item => item.status === 'issue');
  };

  const getPendingCompliance = (): LegalCompliance[] => {
    return compliance.filter(item => item.status === 'pending');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Legal Compliance</h1>
            <p className="text-gray-600 mt-1">Manage permits, releases, and legal requirements</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={() => setShowAddCompliance(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Compliance Item</span>
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search compliance items..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <select
            value={filter.category}
            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="permit">Permits</option>
            <option value="release">Releases</option>
            <option value="copyright">Copyright</option>
            <option value="insurance">Insurance</option>
            <option value="safety">Safety</option>
            <option value="other">Other</option>
          </select>
          
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="not-required">Not Required</option>
            <option value="issue">Issue</option>
          </select>
          
          <button
            onClick={() => {/* Export functionality */}}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded ml-auto"
            title="Export Compliance Report"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Compliance Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Overall Compliance</h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-blue-600">{calculateComplianceProgress()}%</div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${calculateComplianceProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-medium text-gray-900">Issues</h3>
            </div>
            <div className="text-2xl font-bold text-red-600">{getComplianceIssues().length}</div>
            <div className="text-sm text-red-700 mt-1">
              {getComplianceIssues().length > 0 
                ? 'Requires immediate attention' 
                : 'No compliance issues detected'}
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-gray-900">Pending Items</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{getPendingCompliance().length}</div>
            <div className="text-sm text-yellow-700 mt-1">
              {getPendingCompliance().length > 0 
                ? `Next due: ${formatDate(getPendingCompliance().sort((a, b) => 
                    (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)
                  )[0]?.dueDate)}` 
                : 'No pending items'}
            </div>
          </div>
        </div>
        
        {/* Category Breakdown */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Compliance by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['permit', 'release', 'copyright', 'insurance', 'safety', 'other'].map(category => {
              const count = compliance.filter(item => item.category === category).length;
              const completed = compliance.filter(item => item.category === category && (item.status === 'completed' || item.status === 'not-required')).length;
              const percentage = count > 0 ? Math.round((completed / count) * 100) : 0;
              
              return (
                <div key={category} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1 capitalize">{category}</div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{completed}/{count}</span>
                    <span className="text-xs font-medium text-gray-700">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Items</h2>
          <button
            onClick={() => setShowAddCompliance(true)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
        
        {getFilteredCompliance().length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance Items Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filter.category !== 'all' || filter.status !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first compliance item to get started'}
            </p>
            <button
              onClick={() => setShowAddCompliance(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Compliance Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredCompliance().map(item => (
              <div 
                key={item.id} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleItemExpanded(item.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.dueDate && (
                      <div className="text-sm text-gray-500">
                        Due: {formatDate(item.dueDate)}
                      </div>
                    )}
                    {expandedItems.has(item.id) ? 
                      <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                </div>
                
                {expandedItems.has(item.id) && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Description</h5>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Assigned To</h5>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {team.find(m => m.id === item.assignedTo)?.name || 'Unassigned'}
                          </span>
                        </div>
                      </div>
                      
                      {item.dueDate && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Due Date</h5>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{formatDate(item.dueDate)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {item.documents.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Related Documents</h5>
                        <div className="space-y-2">
                          {item.documents.map(docId => {
                            const doc = documents.find(d => d.id === docId);
                            return doc ? (
                              <div key={docId} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">{doc.title}</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    /* View document */
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    
                    {item.notes && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Notes</h5>
                        <p className="text-sm text-gray-600">{item.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="not-required">Not Required</option>
                          <option value="issue">Issue</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCompliance(item.id);
                          }}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            /* Edit compliance item */
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Compliance Modal */}
      {showAddCompliance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Compliance Item</h2>
                <button
                  onClick={() => setShowAddCompliance(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newCompliance.title}
                    onChange={(e) => setNewCompliance({ ...newCompliance, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Location Filming Permit, Talent Release Form"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newCompliance.description}
                    onChange={(e) => setNewCompliance({ ...newCompliance, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the compliance requirement"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCompliance.category}
                    onChange={(e) => setNewCompliance({ ...newCompliance, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="permit">Permit</option>
                    <option value="release">Release</option>
                    <option value="copyright">Copyright</option>
                    <option value="insurance">Insurance</option>
                    <option value="safety">Safety</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newCompliance.status}
                    onChange={(e) => setNewCompliance({ ...newCompliance, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="not-required">Not Required</option>
                    <option value="issue">Issue</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date (optional)
                  </label>
                  <input
                    type="date"
                    value={newCompliance.dueDate ? new Date(newCompliance.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewCompliance({ ...newCompliance, dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <select
                    value={newCompliance.assignedTo}
                    onChange={(e) => setNewCompliance({ ...newCompliance, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select team member</option>
                    {team.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Documents
                  </label>
                  <select
                    multiple
                    value={newCompliance.documents || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setNewCompliance({ ...newCompliance, documents: values });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    size={3}
                  >
                    {documents.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newCompliance.notes}
                    onChange={(e) => setNewCompliance({ ...newCompliance, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this compliance item"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddCompliance(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCompliance}
                  disabled={!newCompliance.title || !newCompliance.category || !newCompliance.assignedTo}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Compliance Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};