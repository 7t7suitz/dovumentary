import React, { useState, useEffect } from 'react';
import { Script, Collaborator, Comment, Reply } from '../types/script';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  User, 
  Send, 
  Check, 
  X, 
  Edit3,
  Share2,
  Lock,
  Unlock,
  History
} from 'lucide-react';

interface ScriptCollaborationProps {
  script: Script;
  currentUser: { id: string; name: string; email: string; avatar?: string };
  onScriptUpdate: (script: Script) => void;
}

export const ScriptCollaboration: React.FC<ScriptCollaborationProps> = ({
  script,
  currentUser,
  onScriptUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'collaborators' | 'comments' | 'history'>('collaborators');
  const [newComment, setNewComment] = useState('');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<any>('viewer');

  useEffect(() => {
    // In a real app, comments would be loaded from a backend
    // This is just a simulation
    setComments([
      {
        id: '1',
        elementId: script.content[0]?.id || '',
        author: 'Jane Smith',
        content: 'I think we should make this opening more dramatic.',
        type: 'suggestion',
        status: 'open',
        replies: [
          {
            id: '1-1',
            author: 'John Doe',
            content: 'Good idea, I\'ll work on it.',
            createdAt: new Date(Date.now() - 3600000)
          }
        ],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        elementId: script.content[2]?.id || '',
        author: 'John Doe',
        content: 'This dialogue feels a bit forced. Can we make it more natural?',
        type: 'comment',
        status: 'open',
        replies: [],
        createdAt: new Date(Date.now() - 43200000),
        updatedAt: new Date(Date.now() - 43200000)
      }
    ]);
  }, [script]);

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedElementId) return;
    
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      elementId: selectedElementId,
      author: currentUser.name,
      content: newComment,
      type: 'comment',
      status: 'open',
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleAddReply = (commentId: string, replyContent: string) => {
    if (!replyContent.trim()) return;
    
    const reply: Reply = {
      id: Math.random().toString(36).substr(2, 9),
      author: currentUser.name,
      content: replyContent,
      createdAt: new Date()
    };
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? 
        { 
          ...comment, 
          replies: [...comment.replies, reply],
          updatedAt: new Date()
        } : 
        comment
    ));
  };

  const handleResolveComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? 
        { ...comment, status: 'resolved', updatedAt: new Date() } : 
        comment
    ));
  };

  const handleInviteCollaborator = () => {
    if (!inviteEmail.trim()) return;
    
    const newCollaborator: Collaborator = {
      id: Math.random().toString(36).substr(2, 9),
      name: inviteEmail.split('@')[0], // Simplified for demo
      email: inviteEmail,
      role: inviteRole,
      permissions: getPermissionsForRole(inviteRole),
      lastActive: new Date(),
      status: 'offline'
    };
    
    onScriptUpdate({
      ...script,
      collaborators: [...script.collaborators, newCollaborator]
    });
    
    setInviteEmail('');
    setShowInviteForm(false);
  };

  const getPermissionsForRole = (role: any): any[] => {
    switch (role) {
      case 'owner':
        return ['read', 'write', 'comment', 'suggest', 'approve', 'export', 'share', 'admin'];
      case 'editor':
        return ['read', 'write', 'comment', 'suggest', 'export'];
      case 'writer':
        return ['read', 'write', 'comment', 'suggest'];
      case 'reviewer':
        return ['read', 'comment', 'suggest'];
      case 'viewer':
      default:
        return ['read'];
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const getRoleColor = (role: any) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'writer':
        return 'bg-green-100 text-green-800';
      case 'reviewer':
        return 'bg-yellow-100 text-yellow-800';
      case 'viewer':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: 'online' | 'offline' | 'away') => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'collaborators', label: 'Collaborators', icon: Users },
              { id: 'comments', label: 'Comments', icon: MessageSquare },
              { id: 'history', label: 'Version History', icon: History }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'comments' && comments.filter(c => c.status === 'open').length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {comments.filter(c => c.status === 'open').length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'collaborators' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Collaborators ({script.collaborators.length})</h3>
              <button
                onClick={() => setShowInviteForm(!showInviteForm)}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                <Users className="w-4 h-4" />
                <span>Invite</span>
              </button>
            </div>
            
            {showInviteForm && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-3">Invite Collaborator</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="colleague@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="viewer">Viewer (can only read)</option>
                      <option value="reviewer">Reviewer (can comment and suggest)</option>
                      <option value="writer">Writer (can edit content)</option>
                      <option value="editor">Editor (can edit and export)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setShowInviteForm(false)}
                      className="px-3 py-1 text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleInviteCollaborator}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Send Invite
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {script.collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {collaborator.avatar ? (
                        <img
                          src={collaborator.avatar}
                          alt={collaborator.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`}></div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900">{collaborator.name}</div>
                      <div className="text-sm text-gray-500">{collaborator.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(collaborator.role)}`}>
                      {collaborator.role}
                    </span>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Active {formatTime(collaborator.lastActive)}</span>
                    </div>
                    
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Collaboration Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Real-time Collaboration</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={script.settings.collaborativeEditing}
                      onChange={(e) => onScriptUpdate({
                        ...script,
                        settings: {
                          ...script.settings,
                          collaborativeEditing: e.target.checked
                        }
                      })}
                      className="sr-only"
                      id="toggle-collab"
                    />
                    <label
                      htmlFor="toggle-collab"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        script.settings.collaborativeEditing ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        script.settings.collaborativeEditing ? 'translate-x-4' : 'translate-x-0'
                      }`}></span>
                    </label>
                  </div>
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Version Control</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={script.settings.versionControl}
                      onChange={(e) => onScriptUpdate({
                        ...script,
                        settings: {
                          ...script.settings,
                          versionControl: e.target.checked
                        }
                      })}
                      className="sr-only"
                      id="toggle-version"
                    />
                    <label
                      htmlFor="toggle-version"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        script.settings.versionControl ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                        script.settings.versionControl ? 'translate-x-4' : 'translate-x-0'
                      }`}></span>
                    </label>
                  </div>
                </label>
                
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <Share2 className="w-4 h-4" />
                    <span>Share Link</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <Lock className="w-4 h-4" />
                    <span>Access Controls</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Comments ({comments.length})</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filter:</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option value="all">All Comments</option>
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Comments Yet</h4>
                <p className="text-gray-600">Select an element in the script to add a comment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`border rounded-lg ${
                      comment.status === 'resolved' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-800 font-medium">{comment.author.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{comment.author}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            comment.type === 'suggestion' ? 'bg-green-100 text-green-800' :
                            comment.type === 'question' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {comment.type}
                          </span>
                          
                          {comment.status === 'open' ? (
                            <button
                              onClick={() => handleResolveComment(comment.id)}
                              className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                              title="Resolve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              Resolved
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      
                      {/* Element reference */}
                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 mb-3">
                        Referring to: "{script.content.find(el => el.id === comment.elementId)?.content.substring(0, 50)}..."
                      </div>
                      
                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="border-t border-gray-100 pt-3 mt-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Replies</h5>
                          <div className="space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-gray-600 text-xs font-medium">{reply.author.charAt(0)}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">{reply.author}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(reply.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Reply form */}
                      {comment.status === 'open' && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-800 font-medium">{currentUser.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                              <textarea
                                placeholder="Add a reply..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={2}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    const textarea = e.currentTarget;
                                    handleAddReply(comment.id, textarea.value);
                                    textarea.value = '';
                                  }
                                }}
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={(e) => {
                                    const textarea = e.currentTarget.parentElement?.parentElement?.querySelector('textarea');
                                    if (textarea) {
                                      handleAddReply(comment.id, textarea.value);
                                      textarea.value = '';
                                    }
                                  }}
                                  className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Reply</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add Comment Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Add Comment</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Element
                  </label>
                  <select
                    value={selectedElementId || ''}
                    onChange={(e) => setSelectedElementId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select an element</option>
                    {script.content.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.type}: {element.content.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your comment or suggestion..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!selectedElementId || !newComment.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Add Comment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
              <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                <History className="w-4 h-4" />
                <span>Create Version</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {script.versions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Versions Yet</h4>
                  <p className="text-gray-600">Create a version to save the current state of your script</p>
                </div>
              ) : (
                script.versions.map((version) => (
                  <div key={version.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{version.name}</h4>
                        <div className="text-sm text-gray-500">
                          Created by {version.createdBy} on {version.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {version.locked ? (
                          <span className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            <Unlock className="w-3 h-3" />
                            <span>Editable</span>
                          </span>
                        )}
                        
                        {version.approved && (
                          <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            <Check className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{version.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                        View
                      </button>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">
                        Restore
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm">
                        Compare
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};