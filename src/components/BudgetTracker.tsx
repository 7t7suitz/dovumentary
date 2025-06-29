import React, { useState } from 'react';
import { Budget, BudgetCategory, Expense } from '../types/production';
import { 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  Filter, 
  Search,
  BarChart2,
  PieChart,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  FileText
} from 'lucide-react';

interface BudgetTrackerProps {
  budget: Budget;
  onBudgetUpdate: (budget: Budget) => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  budget,
  onBudgetUpdate
}) => {
  const [view, setView] = useState<'overview' | 'categories' | 'expenses'>('overview');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({
    name: '',
    allocation: 0,
    spent: 0,
    remaining: 0,
    notes: ''
  });
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    categoryId: '',
    description: '',
    amount: 0,
    date: new Date(),
    status: 'pending',
    submittedBy: '',
    notes: ''
  });
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategoryExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    if (!newCategory.name || newCategory.allocation === undefined) return;
    
    const category: BudgetCategory = {
      id: generateId(),
      name: newCategory.name,
      allocation: newCategory.allocation,
      spent: 0,
      remaining: newCategory.allocation,
      notes: newCategory.notes || ''
    };
    
    const updatedBudget: Budget = {
      ...budget,
      categories: [...budget.categories, category],
      allocatedBudget: budget.allocatedBudget + category.allocation,
      remainingBudget: budget.remainingBudget + category.allocation,
      lastUpdated: new Date()
    };
    
    onBudgetUpdate(updatedBudget);
    
    setNewCategory({
      name: '',
      allocation: 0,
      spent: 0,
      remaining: 0,
      notes: ''
    });
    
    setShowAddCategory(false);
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.categoryId || !newExpense.date) return;
    
    const expense: Expense = {
      id: generateId(),
      categoryId: newExpense.categoryId as string,
      description: newExpense.description,
      amount: newExpense.amount,
      date: new Date(newExpense.date),
      receipt: newExpense.receipt,
      status: newExpense.status as 'pending' | 'approved' | 'rejected' | 'reimbursed',
      submittedBy: newExpense.submittedBy || 'Current User', // In a real app, this would be the current user
      approvedBy: newExpense.approvedBy,
      notes: newExpense.notes || ''
    };
    
    // Update the category's spent and remaining amounts
    const updatedCategories = budget.categories.map(category => {
      if (category.id === expense.categoryId) {
        return {
          ...category,
          spent: category.spent + expense.amount,
          remaining: category.remaining - expense.amount
        };
      }
      return category;
    });
    
    const updatedBudget: Budget = {
      ...budget,
      categories: updatedCategories,
      expenses: [...budget.expenses, expense],
      remainingBudget: budget.remainingBudget - expense.amount,
      lastUpdated: new Date()
    };
    
    onBudgetUpdate(updatedBudget);
    
    setNewExpense({
      categoryId: '',
      description: '',
      amount: 0,
      date: new Date(),
      status: 'pending',
      submittedBy: '',
      notes: ''
    });
    
    setShowAddExpense(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = budget.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Check if there are expenses in this category
    const hasExpenses = budget.expenses.some(e => e.categoryId === categoryId);
    if (hasExpenses) {
      alert('Cannot delete category with expenses. Please reassign or delete the expenses first.');
      return;
    }
    
    const updatedBudget: Budget = {
      ...budget,
      categories: budget.categories.filter(c => c.id !== categoryId),
      allocatedBudget: budget.allocatedBudget - category.allocation,
      remainingBudget: budget.remainingBudget - category.remaining,
      lastUpdated: new Date()
    };
    
    onBudgetUpdate(updatedBudget);
  };

  const handleDeleteExpense = (expenseId: string) => {
    const expense = budget.expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    // Update the category's spent and remaining amounts
    const updatedCategories = budget.categories.map(category => {
      if (category.id === expense.categoryId) {
        return {
          ...category,
          spent: category.spent - expense.amount,
          remaining: category.remaining + expense.amount
        };
      }
      return category;
    });
    
    const updatedBudget: Budget = {
      ...budget,
      categories: updatedCategories,
      expenses: budget.expenses.filter(e => e.id !== expenseId),
      remainingBudget: budget.remainingBudget + expense.amount,
      lastUpdated: new Date()
    };
    
    onBudgetUpdate(updatedBudget);
  };

  const handleApproveExpense = (expenseId: string) => {
    const updatedExpenses = budget.expenses.map(expense => {
      if (expense.id === expenseId) {
        return {
          ...expense,
          status: 'approved',
          approvedBy: 'Current User' // In a real app, this would be the current user
        };
      }
      return expense;
    });
    
    const updatedBudget: Budget = {
      ...budget,
      expenses: updatedExpenses,
      lastUpdated: new Date()
    };
    
    onBudgetUpdate(updatedBudget);
  };

  const handleRejectExpense = (expenseId: string) => {
    const expense = budget.expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    // Update the category's spent and remaining amounts
    const updatedCategories = budget.categories.map(category => {
      if (category.id === expense.categoryId) {
        return {
          ...category,
          spent: category.spent - expense.amount,
          remaining: category.remaining + expense.amount
        };
      }
      return category;
    });
    
    const updatedExpenses = budget.expenses.map(e => {
      if (e.id === expenseId) {
        return {
          ...e,
          status: 'rejected',
          approvedBy: 'Current User' // In a real app, this would be the current user
        };
      }
      return e;
    });
    
    const updatedBudget: Budget = {
      ...budget,
      categories: updatedCategories,
      expenses: updatedExpenses,
      remainingBudget: budget.remainingBudget + expense.amount,
      lastUpdated: new Date()
    };
    
    onBudgetUpdate(updatedBudget);
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: budget.currency || 'USD'
    }).format(amount);
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reimbursed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredExpenses = () => {
    return budget.expenses.filter(expense => {
      // Filter by category
      if (filter.category !== 'all' && expense.categoryId !== filter.category) {
        return false;
      }
      
      // Filter by status
      if (filter.status !== 'all' && expense.status !== filter.status) {
        return false;
      }
      
      // Filter by date range
      if (filter.dateFrom) {
        const fromDate = new Date(filter.dateFrom);
        if (new Date(expense.date) < fromDate) {
          return false;
        }
      }
      
      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo);
        if (new Date(expense.date) > toDate) {
          return false;
        }
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesDescription = expense.description.toLowerCase().includes(query);
        const matchesNotes = expense.notes.toLowerCase().includes(query);
        const matchesAmount = expense.amount.toString().includes(query);
        
        if (!matchesDescription && !matchesNotes && !matchesAmount) {
          return false;
        }
      }
      
      return true;
    });
  };

  const calculateCategoryPercentage = (categoryId: string): number => {
    const category = budget.categories.find(c => c.id === categoryId);
    if (!category) return 0;
    
    return Math.round((category.spent / category.allocation) * 100);
  };

  const calculateTotalSpent = (): number => {
    return budget.expenses.reduce((total, expense) => {
      if (expense.status !== 'rejected') {
        return total + expense.amount;
      }
      return total;
    }, 0);
  };

  const calculateBudgetUtilization = (): number => {
    return Math.round((calculateTotalSpent() / budget.totalBudget) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget Tracker</h1>
            <p className="text-gray-600 mt-1">Manage expenses, allocations, and financial reporting</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('overview')}
                className={`px-3 py-1 ${view === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setView('categories')}
                className={`px-3 py-1 ${view === 'categories' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Categories
              </button>
              <button
                onClick={() => setView('expenses')}
                className={`px-3 py-1 ${view === 'expenses' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Expenses
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {/* Export functionality */}}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Export Budget"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {/* Import functionality */}}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Import Budget"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-900">Total Budget</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(budget.totalBudget)}</p>
            <div className="mt-2 text-xs text-gray-500">
              Last updated: {formatDate(budget.lastUpdated)}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Allocated</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(budget.allocatedBudget)}</p>
            <div className="mt-2 text-xs text-gray-500">
              {Math.round((budget.allocatedBudget / budget.totalBudget) * 100)}% of total budget
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <h3 className="font-medium text-gray-900">Spent</h3>
            </div>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(calculateTotalSpent())}</p>
            <div className="mt-2 text-xs text-gray-500">
              {calculateBudgetUtilization()}% of total budget
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-gray-900">Remaining</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(budget.remainingBudget)}</p>
            <div className="mt-2 text-xs text-gray-500">
              {Math.round((budget.remainingBudget / budget.totalBudget) * 100)}% of total budget
            </div>
          </div>
        </div>
      </div>

      {/* Overview View */}
      {view === 'overview' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Bar Chart"
              >
                <BarChart2 className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                title="Pie Chart"
              >
                <PieChart className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Utilization</h3>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-medium text-gray-900">{calculateBudgetUtilization()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${calculateBudgetUtilization()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Category Breakdown</h3>
              <button
                onClick={() => setShowAddCategory(true)}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
            
            {budget.categories.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Budget Categories</h3>
                <p className="text-gray-600 mb-4">Add your first budget category to get started</p>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Category
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {budget.categories.map(category => (
                  <div key={category.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(category.spent)} / {formatCurrency(category.allocation)}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          calculateCategoryPercentage(category.id) > 90 ? 'bg-red-600' :
                          calculateCategoryPercentage(category.id) > 70 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${calculateCategoryPercentage(category.id)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{calculateCategoryPercentage(category.id)}% used</span>
                      <span>{formatCurrency(category.remaining)} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Expenses</h3>
              <button
                onClick={() => setShowAddExpense(true)}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            </div>
            
            {budget.expenses.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Expenses Recorded</h3>
                <p className="text-gray-600 mb-4">Add your first expense to track spending</p>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Expense
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {budget.expenses
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map(expense => {
                        const category = budget.categories.find(c => c.id === expense.categoryId);
                        return (
                          <tr key={expense.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                              <div className="text-xs text-gray-500">{expense.submittedBy}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{category?.name || 'Unknown'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(expense.date)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                                {expense.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories View */}
      {view === 'categories' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Budget Categories</h2>
            <button
              onClick={() => setShowAddCategory(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
          
          {budget.categories.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Budget Categories</h3>
              <p className="text-gray-600 mb-4">Add your first budget category to get started</p>
              <button
                onClick={() => setShowAddCategory(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {budget.categories.map(category => (
                <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleCategoryExpanded(category.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(category.spent)} of {formatCurrency(category.allocation)} ({calculateCategoryPercentage(category.id)}%)
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(category.remaining)} remaining
                      </div>
                      {expandedCategories.has(category.id) ? 
                        <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      }
                    </div>
                  </div>
                  
                  {expandedCategories.has(category.id) && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="mb-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm text-gray-600">Budget Utilization</span>
                          <span className="text-sm font-medium text-gray-900">{calculateCategoryPercentage(category.id)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              calculateCategoryPercentage(category.id) > 90 ? 'bg-red-600' :
                              calculateCategoryPercentage(category.id) > 70 ? 'bg-yellow-600' :
                              'bg-green-600'
                            }`}
                            style={{ width: `${calculateCategoryPercentage(category.id)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {category.notes && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Notes</h5>
                          <p className="text-sm text-gray-600">{category.notes}</p>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Expenses</h5>
                        {budget.expenses.filter(e => e.categoryId === category.id).length === 0 ? (
                          <p className="text-sm text-gray-500 italic">No expenses recorded for this category</p>
                        ) : (
                          <div className="space-y-2">
                            {budget.expenses
                              .filter(e => e.categoryId === category.id)
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .slice(0, 3)
                              .map(expense => (
                                <div key={expense.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                                    <div className="text-xs text-gray-500">{formatDate(expense.date)}</div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                                      {expense.status}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* Edit category */}}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setNewExpense({
                              ...newExpense,
                              categoryId: category.id
                            });
                            setShowAddExpense(true);
                          }}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Expense</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expenses View */}
      {view === 'expenses' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
          
          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expenses..."
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
              {budget.categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="reimbursed">Reimbursed</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={filter.dateFrom}
                onChange={(e) => setFilter(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="From"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={filter.dateTo}
                onChange={(e) => setFilter(prev => ({ ...prev, dateTo: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="To"
              />
            </div>
          </div>
          
          {/* Expenses List */}
          {budget.expenses.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Expenses Recorded</h3>
              <p className="text-gray-600 mb-4">Add your first expense to track spending</p>
              <button
                onClick={() => setShowAddExpense(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Expense
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredExpenses()
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(expense => {
                      const category = budget.categories.find(c => c.id === expense.categoryId);
                      return (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                            {expense.notes && (
                              <div className="text-xs text-gray-500">{expense.notes}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{category?.name || 'Unknown'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(expense.date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                              {expense.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{expense.submittedBy}</div>
                            {expense.approvedBy && (
                              <div className="text-xs text-gray-500">Approved by: {expense.approvedBy}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {expense.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApproveExpense(expense.id)}
                                  className="text-green-600 hover:text-green-900 mr-2"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleRejectExpense(expense.id)}
                                  className="text-red-600 hover:text-red-900 mr-2"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-900"
                            >
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
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Budget Category</h2>
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Equipment Rental, Crew Salaries"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Allocation
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={newCategory.allocation || ''}
                      onChange={(e) => setNewCategory({ ...newCategory, allocation: parseFloat(e.target.value) })}
                      className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">{budget.currency || 'USD'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newCategory.notes}
                    onChange={(e) => setNewCategory({ ...newCategory, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this budget category"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.name || !newCategory.allocation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Camera Rental, Location Fee"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newExpense.categoryId || ''}
                    onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {budget.categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                      className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">{budget.currency || 'USD'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newExpense.date ? new Date(newExpense.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewExpense({ ...newExpense, date: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newExpense.status}
                    onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="reimbursed">Reimbursed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submitted By
                  </label>
                  <input
                    type="text"
                    value={newExpense.submittedBy || ''}
                    onChange={(e) => setNewExpense({ ...newExpense, submittedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newExpense.notes}
                    onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about this expense"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  disabled={!newExpense.description || !newExpense.amount || !newExpense.categoryId || !newExpense.date}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};