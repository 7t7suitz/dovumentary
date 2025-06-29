import React, { useState } from 'react';
import { EquipmentItem } from '../types/production';
import { 
  Camera, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  DollarSign, 
  User, 
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

interface EquipmentManagerProps {
  equipment: EquipmentItem[];
  onEquipmentUpdate: (equipment: EquipmentItem[]) => void;
}

export const EquipmentManager: React.FC<EquipmentManagerProps> = ({
  equipment,
  onEquipmentUpdate
}) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [newEquipment, setNewEquipment] = useState<Partial<EquipmentItem>>({
    name: '',
    category: 'camera',
    description: '',
    serialNumber: '',
    owner: 'owned',
    cost: 0,
    status: 'available',
    notes: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'all',
    owner: 'all'
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

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.category) return;
    
    const item: EquipmentItem = {
      id: generateId(),
      name: newEquipment.name,
      category: newEquipment.category as any,
      description: newEquipment.description || '',
      serialNumber: newEquipment.serialNumber,
      owner: newEquipment.owner as any,
      cost: newEquipment.cost || 0,
      rentalPeriod: newEquipment.owner === 'rented' ? {
        startDate: newEquipment.rentalPeriod?.startDate || new Date(),
        endDate: newEquipment.rentalPeriod?.endDate || new Date(),
        vendor: newEquipment.rentalPeriod?.vendor || ''
      } : undefined,
      status: newEquipment.status as any,
      assignedTo: newEquipment.assignedTo,
      notes: newEquipment.notes || ''
    };
    
    onEquipmentUpdate([...equipment, item]);
    
    setNewEquipment({
      name: '',
      category: 'camera',
      description: '',
      serialNumber: '',
      owner: 'owned',
      cost: 0,
      status: 'available',
      notes: ''
    });
    
    setShowAddEquipment(false);
  };

  const handleDeleteEquipment = (itemId: string) => {
    onEquipmentUpdate(equipment.filter(item => item.id !== itemId));
    if (selectedEquipment === itemId) {
      setSelectedEquipment(null);
    }
  };

  const handleStatusChange = (itemId: string, status: 'available' | 'in-use' | 'maintenance' | 'lost' | 'damaged') => {
    const updatedEquipment = equipment.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status
        };
      }
      return item;
    });
    
    onEquipmentUpdate(updatedEquipment);
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

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const getFilteredEquipment = () => {
    return equipment.filter(item => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDescription = item.description.toLowerCase().includes(query);
        const matchesSerial = item.serialNumber?.toLowerCase().includes(query);
        
        if (!matchesName && !matchesDescription && !matchesSerial) {
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
      
      // Filter by owner
      if (filter.owner !== 'all' && item.owner !== filter.owner) {
        return false;
      }
      
      return true;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'camera':
        return <Camera className="w-5 h-5" />;
      case 'lens':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3"></circle></svg>;
      case 'audio':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>;
      case 'lighting':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M8 2h8l4 10H4L8 2Z"></path><path d="M12 12v6"></path></svg>;
      case 'grip':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>;
      default:
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-use':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'damaged':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOwnerColor = (owner: string): string => {
    switch (owner) {
      case 'owned':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'borrowed':
        return 'bg-yellow-100 text-yellow-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Equipment Management</h1>
            <p className="text-gray-600 mt-1">Track equipment inventory, status, and assignments</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-1 ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                List
              </button>
            </div>
            
            <button
              onClick={() => setShowAddEquipment(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Equipment</span>
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
              placeholder="Search equipment..."
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
            <option value="camera">Camera</option>
            <option value="lens">Lens</option>
            <option value="audio">Audio</option>
            <option value="lighting">Lighting</option>
            <option value="grip">Grip</option>
            <option value="other">Other</option>
          </select>
          
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="lost">Lost</option>
            <option value="damaged">Damaged</option>
          </select>
          
          <select
            value={filter.owner}
            onChange={(e) => setFilter(prev => ({ ...prev, owner: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Ownership</option>
            <option value="owned">Owned</option>
            <option value="rented">Rented</option>
            <option value="borrowed">Borrowed</option>
          </select>
          
          <button
            onClick={() => {/* Export functionality */}}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded ml-auto"
            title="Export Equipment List"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredEquipment().length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Equipment Found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filter.category !== 'all' || filter.status !== 'all' || filter.owner !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first equipment item to get started'}
              </p>
              <button
                onClick={() => setShowAddEquipment(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Equipment
              </button>
            </div>
          ) : (
            getFilteredEquipment().map(item => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getOwnerColor(item.owner)}`}>
                            {item.owner}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleItemExpanded(item.id)}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      >
                        {expandedItems.has(item.id) ? 
                          <ChevronDown className="w-5 h-5" /> : 
                          <ChevronRight className="w-5 h-5" />
                        }
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">{item.description}</div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-700 font-medium">{formatCurrency(item.cost)}</div>
                    {item.serialNumber && (
                      <div className="text-gray-500">S/N: {item.serialNumber}</div>
                    )}
                  </div>
                  
                  {expandedItems.has(item.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {item.owner === 'rented' && item.rentalPeriod && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Rental Information</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">
                                {formatDate(item.rentalPeriod.startDate)} - {formatDate(item.rentalPeriod.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">Vendor: {item.rentalPeriod.vendor}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {item.assignedTo && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Currently Assigned To</h4>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{item.assignedTo}</span>
                          </div>
                        </div>
                      )}
                      
                      {item.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
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
                            <option value="available">Available</option>
                            <option value="in-use">In Use</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="lost">Lost</option>
                            <option value="damaged">Damaged</option>
                          </select>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteEquipment(item.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {/* Edit equipment */}}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {getFilteredEquipment().length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Equipment Found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filter.category !== 'all' || filter.status !== 'all' || filter.owner !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first equipment item to get started'}
              </p>
              <button
                onClick={() => setShowAddEquipment(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Equipment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredEquipment().map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.serialNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{item.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getOwnerColor(item.owner)}`}>
                          {item.owner}
                        </span>
                        {item.owner === 'rented' && item.rentalPeriod && (
                          <div className="text-xs text-gray-500 mt-1">
                            Until {formatDate(item.rentalPeriod.endDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(item.cost)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.assignedTo || 'Not assigned'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {/* View/edit equipment details */}}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEquipment(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
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
      )}

      {/* Add Equipment Modal */}
      {showAddEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Equipment</h2>
                <button
                  onClick={() => setShowAddEquipment(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Sony A7S III, Sennheiser MKH 416"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newEquipment.category}
                    onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="camera">Camera</option>
                    <option value="lens">Lens</option>
                    <option value="audio">Audio</option>
                    <option value="lighting">Lighting</option>
                    <option value="grip">Grip</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEquipment.description}
                    onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the equipment"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number (optional)
                  </label>
                  <input
                    type="text"
                    value={newEquipment.serialNumber || ''}
                    onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Serial number or identifier"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ownership
                  </label>
                  <select
                    value={newEquipment.owner}
                    onChange={(e) => setNewEquipment({ ...newEquipment, owner: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="owned">Owned</option>
                    <option value="rented">Rented</option>
                    <option value="borrowed">Borrowed</option>
                  </select>
                </div>
                
                {newEquipment.owner === 'rented' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rental Start
                        </label>
                        <input
                          type="date"
                          value={newEquipment.rentalPeriod?.startDate ? new Date(newEquipment.rentalPeriod.startDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewEquipment({
                            ...newEquipment,
                            rentalPeriod: {
                              ...newEquipment.rentalPeriod!,
                              startDate: new Date(e.target.value)
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rental End
                        </label>
                        <input
                          type="date"
                          value={newEquipment.rentalPeriod?.endDate ? new Date(newEquipment.rentalPeriod.endDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewEquipment({
                            ...newEquipment,
                            rentalPeriod: {
                              ...newEquipment.rentalPeriod!,
                              endDate: new Date(e.target.value)
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rental Vendor
                      </label>
                      <input
                        type="text"
                        value={newEquipment.rentalPeriod?.vendor || ''}
                        onChange={(e) => setNewEquipment({
                          ...newEquipment,
                          rentalPeriod: {
                            ...newEquipment.rentalPeriod!,
                            vendor: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Rental company or person"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={newEquipment.cost || ''}
                      onChange={(e) => setNewEquipment({ ...newEquipment, cost: parseFloat(e.target.value) })}
                      className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newEquipment.status}
                    onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="in-use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="lost">Lost</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To (optional)
                  </label>
                  <input
                    type="text"
                    value={newEquipment.assignedTo || ''}
                    onChange={(e) => setNewEquipment({ ...newEquipment, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Team member name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newEquipment.notes}
                    onChange={(e) => setNewEquipment({ ...newEquipment, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this equipment"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddEquipment(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEquipment}
                  disabled={!newEquipment.name || !newEquipment.category}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Equipment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};