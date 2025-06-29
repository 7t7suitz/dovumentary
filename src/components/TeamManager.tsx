import React, { useState } from 'react';
import { TeamMember, Availability } from '../types/production';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  DollarSign, 
  Calendar,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  FileText
} from 'lucide-react';

interface TeamManagerProps {
  team: TeamMember[];
  onTeamUpdate: (team: TeamMember[]) => void;
}

export const TeamManager: React.FC<TeamManagerProps> = ({
  team,
  onTeamUpdate
}) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    rate: {
      amount: 0,
      unit: 'daily'
    },
    availability: [],
    skills: [],
    documents: [],
    notes: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    role: 'all',
    availability: 'all'
  });
  const [newSkill, setNewSkill] = useState('');

  const toggleMemberExpanded = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role || !newMember.email) return;
    
    const member: TeamMember = {
      id: generateId(),
      name: newMember.name,
      role: newMember.role,
      email: newMember.email,
      phone: newMember.phone,
      rate: newMember.rate || {
        amount: 0,
        unit: 'daily'
      },
      availability: newMember.availability || [],
      skills: newMember.skills || [],
      documents: newMember.documents || [],
      notes: newMember.notes || ''
    };
    
    onTeamUpdate([...team, member]);
    
    setNewMember({
      name: '',
      role: '',
      email: '',
      phone: '',
      rate: {
        amount: 0,
        unit: 'daily'
      },
      availability: [],
      skills: [],
      documents: [],
      notes: ''
    });
    
    setShowAddMember(false);
  };

  const handleDeleteMember = (memberId: string) => {
    onTeamUpdate(team.filter(member => member.id !== memberId));
    if (selectedMember === memberId) {
      setSelectedMember(null);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    setNewMember({
      ...newMember,
      skills: [...(newMember.skills || []), newSkill]
    });
    
    setNewSkill('');
  };

  const handleRemoveSkill = (index: number) => {
    setNewMember({
      ...newMember,
      skills: newMember.skills?.filter((_, i) => i !== index)
    });
  };

  const handleAddAvailability = (date: string, startTime: string, endTime: string, status: 'available' | 'unavailable' | 'tentative') => {
    const availability: Availability = {
      date: new Date(date),
      startTime,
      endTime,
      status
    };
    
    setNewMember({
      ...newMember,
      availability: [...(newMember.availability || []), availability]
    });
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

  const getFilteredTeam = () => {
    return team.filter(member => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = member.name.toLowerCase().includes(query);
        const matchesRole = member.role.toLowerCase().includes(query);
        const matchesEmail = member.email.toLowerCase().includes(query);
        const matchesSkills = member.skills.some(skill => skill.toLowerCase().includes(query));
        
        if (!matchesName && !matchesRole && !matchesEmail && !matchesSkills) {
          return false;
        }
      }
      
      // Filter by role
      if (filter.role !== 'all' && member.role !== filter.role) {
        return false;
      }
      
      // Filter by availability
      if (filter.availability !== 'all') {
        const today = new Date();
        const hasAvailability = member.availability.some(a => {
          const availDate = new Date(a.date);
          const isToday = availDate.getDate() === today.getDate() &&
                          availDate.getMonth() === today.getMonth() &&
                          availDate.getFullYear() === today.getFullYear();
          
          return isToday && a.status === filter.availability;
        });
        
        if (!hasAvailability) {
          return false;
        }
      }
      
      return true;
    });
  };

  const getUniqueRoles = (): string[] => {
    const roles = new Set<string>();
    team.forEach(member => roles.add(member.role));
    return Array.from(roles);
  };

  const getRoleColor = (role: string): string => {
    const roleColors: Record<string, string> = {
      'Director': 'bg-blue-100 text-blue-800',
      'Producer': 'bg-green-100 text-green-800',
      'Cinematographer': 'bg-purple-100 text-purple-800',
      'Sound Engineer': 'bg-yellow-100 text-yellow-800',
      'Editor': 'bg-pink-100 text-pink-800'
    };
    
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-1">Manage crew members, roles, and availability</p>
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
              onClick={() => setShowAddMember(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team Member</span>
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
              placeholder="Search team members..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <select
            value={filter.role}
            onChange={(e) => setFilter(prev => ({ ...prev, role: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {getUniqueRoles().map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          
          <select
            value={filter.availability}
            onChange={(e) => setFilter(prev => ({ ...prev, availability: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Availability</option>
            <option value="available">Available Today</option>
            <option value="unavailable">Unavailable Today</option>
            <option value="tentative">Tentative Today</option>
          </select>
          
          <button
            onClick={() => {/* Export functionality */}}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded ml-auto"
            title="Export Team"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredTeam().length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members Found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filter.role !== 'all' || filter.availability !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first team member to get started'}
              </p>
              <button
                onClick={() => setShowAddMember(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Team Member
              </button>
            </div>
          ) : (
            getFilteredTeam().map(member => (
              <div 
                key={member.id} 
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800 font-medium text-lg">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleMemberExpanded(member.id)}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      >
                        {expandedMembers.has(member.id) ? 
                          <ChevronDown className="w-5 h-5" /> : 
                          <ChevronRight className="w-5 h-5" />
                        }
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${member.email}`} className="text-blue-600 hover:text-blue-800">
                        {member.email}
                      </a>
                    </div>
                    
                    {member.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <a href={`tel:${member.phone}`} className="text-blue-600 hover:text-blue-800">
                          {member.phone}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        {formatCurrency(member.rate.amount)} per {member.rate.unit}
                      </span>
                    </div>
                  </div>
                  
                  {expandedMembers.has(member.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {member.skills.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {member.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {member.availability.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Availability</h4>
                          <div className="space-y-2">
                            {member.availability
                              .filter(a => new Date(a.date) >= new Date())
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              .slice(0, 3)
                              .map((avail, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">{formatDate(avail.date)}</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    avail.status === 'available' ? 'bg-green-100 text-green-800' :
                                    avail.status === 'unavailable' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {avail.status}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      {member.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{member.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* Edit member */}}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
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
          {getFilteredTeam().length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members Found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filter.role !== 'all' || filter.availability !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first team member to get started'}
              </p>
              <button
                onClick={() => setShowAddMember(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Team Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredTeam().map(member => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-800 font-medium">{member.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-600">{member.email}</div>
                        {member.phone && (
                          <div className="text-sm text-gray-500">{member.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(member.rate.amount)}</div>
                        <div className="text-xs text-gray-500">per {member.rate.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.availability.length > 0 ? (
                          <div className="text-sm text-gray-900">
                            Next: {formatDate(member.availability[0].date)}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              member.availability[0].status === 'available' ? 'bg-green-100 text-green-800' :
                              member.availability[0].status === 'unavailable' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {member.availability[0].status}
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">No availability set</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                              +{member.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {/* View/edit member details */}}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
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

      {/* Add Team Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Team Member</h2>
                <button
                  onClick={() => setShowAddMember(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Director, Cinematographer"
                    list="roles"
                  />
                  <datalist id="roles">
                    <option value="Director" />
                    <option value="Producer" />
                    <option value="Cinematographer" />
                    <option value="Sound Engineer" />
                    <option value="Editor" />
                    <option value="Production Assistant" />
                    <option value="Gaffer" />
                    <option value="Grip" />
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={newMember.phone || ''}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(123) 456-7890"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={newMember.rate?.amount || ''}
                        onChange={(e) => setNewMember({
                          ...newMember,
                          rate: {
                            ...newMember.rate!,
                            amount: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full pl-7 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Unit
                    </label>
                    <select
                      value={newMember.rate?.unit || 'daily'}
                      onChange={(e) => setNewMember({
                        ...newMember,
                        rate: {
                          ...newMember.rate!,
                          unit: e.target.value as any
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="flat">Flat Rate</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Drone Operation, Color Grading"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <button
                      onClick={handleAddSkill}
                      disabled={!newSkill.trim()}
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {newMember.skills?.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(index)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newMember.notes}
                    onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this team member"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  disabled={!newMember.name || !newMember.role || !newMember.email}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Team Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};