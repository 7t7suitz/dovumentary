import React, { useState } from 'react';
import { Document, DocumentType, TeamMember, Location, ShootDay, Scene } from '../types/production';
import { 
  FileText, 
  Plus, 
  Download, 
  Share2, 
  Printer, 
  Edit3, 
  Trash2, 
  Eye,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Copy
} from 'lucide-react';

interface DocumentGeneratorProps {
  documents: Document[];
  team: TeamMember[];
  locations: Location[];
  shootDays: ShootDay[];
  scenes: Scene[];
  onDocumentCreate: (document: Document) => void;
  onDocumentUpdate: (document: Document) => void;
  onDocumentDelete: (documentId: string) => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  documents,
  team,
  locations,
  shootDays,
  scenes,
  onDocumentCreate,
  onDocumentUpdate,
  onDocumentDelete
}) => {
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType>('call-sheet');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all'
  });
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: '',
    type: 'call-sheet',
    content: '',
    createdBy: '',
    status: 'draft',
    sharedWith: [],
    notes: ''
  });

  const handleAddDocument = () => {
    if (!newDocument.title || !newDocument.type || !newDocument.createdBy) return;
    
    // Generate content based on document type
    const content = generateDocumentContent(newDocument.type as DocumentType);
    
    const document: Document = {
      id: generateId(),
      title: newDocument.title,
      type: newDocument.type as DocumentType,
      content,
      createdBy: newDocument.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: newDocument.status as 'draft' | 'final' | 'signed' | 'expired',
      sharedWith: newDocument.sharedWith || [],
      notes: newDocument.notes || ''
    };
    
    onDocumentCreate(document);
    
    setNewDocument({
      title: '',
      type: 'call-sheet',
      content: '',
      createdBy: '',
      status: 'draft',
      sharedWith: [],
      notes: ''
    });
    
    setShowAddDocument(false);
  };

  const handleDeleteDocument = (documentId: string) => {
    onDocumentDelete(documentId);
    if (selectedDocument === documentId) {
      setSelectedDocument(null);
    }
    if (previewDocument === documentId) {
      setPreviewDocument(null);
    }
  };

  const generateDocumentContent = (type: DocumentType): string => {
    // In a real implementation, this would generate actual document content
    // based on the selected type and available data
    
    switch (type) {
      case 'call-sheet':
        return generateCallSheet();
      case 'release-form':
        return generateReleaseForm();
      case 'shot-list':
        return generateShotList();
      case 'budget':
        return generateBudget();
      default:
        return 'Document content will be generated here.';
    }
  };

  const generateCallSheet = (): string => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Find the next shoot day
    const nextShootDay = shootDays
      .filter(day => new Date(day.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    if (!nextShootDay) {
      return 'No upcoming shoot days scheduled.';
    }
    
    const location = locations.find(loc => loc.id === nextShootDay.locationId);
    
    return `CALL SHEET
Date: ${formatDate(nextShootDay.date)}

PRODUCTION: ${newDocument.title}

GENERAL CALL TIME: ${nextShootDay.callTime}
ESTIMATED WRAP: ${nextShootDay.wrapTime}

LOCATION: ${location?.name || 'TBD'}
ADDRESS: ${location?.address || 'TBD'}

CREW:
${team.filter(member => nextShootDay.teamMembers.includes(member.id))
  .map(member => `${member.role}: ${member.name} - Call: ${nextShootDay.callTime}`)
  .join('\n')}

SCENES:
${nextShootDay.scenes.map(sceneId => {
  const scene = scenes.find(s => s.id === sceneId);
  return scene ? `Scene ${scene.name}: ${scene.description}` : '';
}).filter(Boolean).join('\n')}

NOTES:
${nextShootDay.notes || 'No additional notes.'}

IMPORTANT CONTACTS:
${team.filter(member => ['Director', 'Producer'].includes(member.role))
  .map(member => `${member.role}: ${member.name} - ${member.phone || member.email}`)
  .join('\n')}
`;
  };

  const generateReleaseForm = (): string => {
    return `APPEARANCE RELEASE FORM

Project Title: ${newDocument.title}
Producer: [Producer Name]

I, __________________________, hereby grant permission to the Producer to use my name, likeness, image, voice, appearance, and performance in this production.

This grant includes without limitation the right to edit, mix, or duplicate and to use or re-use the Product in whole or in parts as Producer may elect. Producer has complete ownership of the Product, including copyright interests.

I confirm that I have the right to enter into this Agreement, that I am not restricted by any commitments to third parties, and that Producer has no financial commitment or obligations to me as a result of this Agreement.

I hereby give all clearances, copyright and otherwise, for the use of my name, likeness, image, voice, appearance, and performance embodied in the Product. I expressly release and indemnify Producer and its officers, employees, agents, and designees from any and all claims known and unknown arising out of, or in any way connected with, the above granted uses and representations.

Signature: __________________________ Date: ______________

Print Name: __________________________

Address: __________________________

Phone: __________________________

Email: __________________________
`;
  };

  const generateShotList = (): string => {
    // Find the next shoot day
    const today = new Date();
    const nextShootDay = shootDays
      .filter(day => new Date(day.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    if (!nextShootDay) {
      return 'No upcoming shoot days scheduled.';
    }
    
    let shotList = `SHOT LIST
Date: ${formatDate(nextShootDay.date)}
Project: ${newDocument.title}

`;
    
    nextShootDay.scenes.forEach(sceneId => {
      const scene = scenes.find(s => s.id === sceneId);
      if (!scene) return;
      
      shotList += `SCENE: ${scene.name}\n`;
      shotList += `Description: ${scene.description}\n\n`;
      
      scene.shotList.forEach(shot => {
        shotList += `Shot ${shot.shotNumber}: ${shot.description}\n`;
        shotList += `Type: ${shot.shotType} | Angle: ${shot.angle}\n`;
        shotList += `Duration: ${shot.duration} minutes\n`;
        shotList += `Status: ${shot.status}\n`;
        if (shot.notes) shotList += `Notes: ${shot.notes}\n`;
        shotList += '\n';
      });
      
      shotList += '---\n\n';
    });
    
    return shotList;
  };

  const generateBudget = (): string => {
    return `BUDGET SUMMARY
Project: ${newDocument.title}
Date: ${new Date().toLocaleDateString()}

TOTAL BUDGET: $0.00

CATEGORIES:
1. Pre-Production: $0.00
2. Production: $0.00
3. Post-Production: $0.00
4. Equipment: $0.00
5. Crew: $0.00
6. Locations: $0.00
7. Travel & Accommodations: $0.00
8. Miscellaneous: $0.00

NOTES:
This is a preliminary budget template. Please update with actual figures.
`;
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

  const getDocumentTypeIcon = (type: DocumentType) => {
    switch (type) {
      case 'contract':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path><path d="M14 3v5h5M18 21v-6M15 18h6"></path></svg>;
      case 'release-form':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14l2 2 4-4"></path></svg>;
      case 'call-sheet':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>;
      case 'shot-list':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="16" x2="16" y2="16"></line><line x1="8" y1="8" x2="16" y2="8"></line></svg>;
      case 'budget':
        return <DollarSign className="w-5 h-5" />;
      case 'permit':
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><polyline points="10 9 9 9 8 9"></polyline></svg>;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getDocumentTypeLabel = (type: DocumentType): string => {
    switch (type) {
      case 'contract':
        return 'Contract';
      case 'release-form':
        return 'Release Form';
      case 'permit':
        return 'Permit';
      case 'call-sheet':
        return 'Call Sheet';
      case 'shot-list':
        return 'Shot List';
      case 'budget':
        return 'Budget';
      case 'schedule':
        return 'Schedule';
      case 'script':
        return 'Script';
      case 'storyboard':
        return 'Storyboard';
      default:
        return 'Other';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'final':
        return 'bg-green-100 text-green-800';
      case 'signed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredDocuments = () => {
    return documents.filter(doc => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(query);
        const matchesNotes = doc.notes.toLowerCase().includes(query);
        const matchesContent = doc.content?.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesNotes && !matchesContent) {
          return false;
        }
      }
      
      // Filter by type
      if (filter.type !== 'all' && doc.type !== filter.type) {
        return false;
      }
      
      // Filter by status
      if (filter.status !== 'all' && doc.status !== filter.status) {
        return false;
      }
      
      return true;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-1">Generate and manage production documents</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={() => setShowAddDocument(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create Document</span>
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
              placeholder="Search documents..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="contract">Contracts</option>
            <option value="release-form">Release Forms</option>
            <option value="permit">Permits</option>
            <option value="call-sheet">Call Sheets</option>
            <option value="shot-list">Shot Lists</option>
            <option value="budget">Budgets</option>
            <option value="schedule">Schedules</option>
          </select>
          
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="final">Final</option>
            <option value="signed">Signed</option>
            <option value="expired">Expired</option>
          </select>
          
          <button
            onClick={() => {/* Export functionality */}}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded ml-auto"
            title="Export Documents"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredDocuments().length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filter.type !== 'all' || filter.status !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first document to get started'}
            </p>
            <button
              onClick={() => setShowAddDocument(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Document
            </button>
          </div>
        ) : (
          getFilteredDocuments().map(document => (
            <div 
              key={document.id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getDocumentTypeIcon(document.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{document.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{getDocumentTypeLabel(document.type)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                          {document.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPreviewDocument(document.id)}
                      className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {/* Edit document */}}
                      className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="text-gray-700">{formatDate(document.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Created By</span>
                    <span className="text-gray-700">{document.createdBy}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="text-gray-700">{formatDate(document.updatedAt)}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <div className="flex items-center space-x-2">
                    {document.sharedWith.length > 0 ? (
                      <div className="flex -space-x-2">
                        {document.sharedWith.slice(0, 3).map((memberId, index) => (
                          <div key={index} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                            {memberId.charAt(0)}
                          </div>
                        ))}
                        {document.sharedWith.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-xs">
                            +{document.sharedWith.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Not shared</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* Download document */}}
                      className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {/* Share document */}}
                      className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {/* Print document */}}
                      className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                      title="Print"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(document.id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Document Modal */}
      {showAddDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Create Document</h2>
                <button
                  onClick={() => setShowAddDocument(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'call-sheet', label: 'Call Sheet' },
                      { type: 'release-form', label: 'Release Form' },
                      { type: 'shot-list', label: 'Shot List' },
                      { type: 'budget', label: 'Budget' },
                      { type: 'contract', label: 'Contract' },
                      { type: 'permit', label: 'Permit' }
                    ].map(item => (
                      <button
                        key={item.type}
                        onClick={() => setNewDocument({ ...newDocument, type: item.type as DocumentType })}
                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${
                          newDocument.type === item.type 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {getDocumentTypeIcon(item.type as DocumentType)}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={newDocument.title}
                    onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., June 15 Call Sheet, Location Release Form"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created By
                  </label>
                  <select
                    value={newDocument.createdBy}
                    onChange={(e) => setNewDocument({ ...newDocument, createdBy: e.target.value })}
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
                    Status
                  </label>
                  <select
                    value={newDocument.status}
                    onChange={(e) => setNewDocument({ ...newDocument, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="final">Final</option>
                    <option value="signed">Signed</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Share With
                  </label>
                  <select
                    multiple
                    value={newDocument.sharedWith || []}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setNewDocument({ ...newDocument, sharedWith: values });
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
                    value={newDocument.notes}
                    onChange={(e) => setNewDocument({ ...newDocument, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this document"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddDocument(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDocument}
                  disabled={!newDocument.title || !newDocument.type || !newDocument.createdBy}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {getDocumentTypeIcon(documents.find(d => d.id === previewDocument)?.type || 'other')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{documents.find(d => d.id === previewDocument)?.title}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{getDocumentTypeLabel(documents.find(d => d.id === previewDocument)?.type || 'other')}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(documents.find(d => d.id === previewDocument)?.status || 'draft')}`}>
                      {documents.find(d => d.id === previewDocument)?.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {/* Download document */}}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* Print document */}}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {/* Copy to clipboard */}}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="Copy"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                {documents.find(d => d.id === previewDocument)?.content}
              </pre>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  Created by {team.find(m => m.id === documents.find(d => d.id === previewDocument)?.createdBy)?.name || 'Unknown'} on {formatDate(documents.find(d => d.id === previewDocument)?.createdAt || new Date())}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {/* Edit document */}}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};