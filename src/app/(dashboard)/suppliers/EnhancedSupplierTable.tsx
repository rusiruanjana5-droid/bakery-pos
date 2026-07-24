'use client'

import { useState } from 'react'
import { deleteSupplier, updateSupplier, createSupplier } from '@/actions/supplier'
import { getSupplierPaymentStatus, getSupplierGRNHistory, getSupplierPaymentLedger, recordSupplierPayment } from '@/actions/supplier-analytics'
import CategorySelector from '@/components/CategorySelector'

interface Supplier {
  id: number
  name: string
  phone: string
  company: string
  category?: string
  categoryId?: number | null
  subCategoryId?: number | null
  email?: string
  address?: string
  outstandingBalance?: number
  creditLimit?: number
  creditPeriod?: number
  contactPerson?: string
}

interface SupplierTableProps {
  suppliers: Supplier[]
  categories: any[]
  analytics: {
    totalSuppliers: number
    totalOutstandingBalance: number
    overduePaymentsCount: number
  }
}

export default function EnhancedSupplierTable({ suppliers, categories, analytics }: SupplierTableProps) {
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null)
  const [activeTab, setActiveTab] = useState<'grn' | 'payments'>('grn')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    category: 'Bakery Raw Materials',
    email: '',
    address: '',
    contactPerson: '',
    creditLimit: '',
    creditPeriod: '30'
  })

  // Modal data states
  const [grnHistory, setGrnHistory] = useState<any[]>([])
  const [paymentLedger, setPaymentLedger] = useState<any[]>([])
  const [paymentStatus, setPaymentStatus] = useState<string>('Pending')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [supplierPaymentStatuses, setSupplierPaymentStatuses] = useState<{ [key: number]: string }>({})

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setSelectedCategoryId(supplier.categoryId || null)
    setSelectedSubCategoryId(supplier.subCategoryId || null)
    setFormData({
      name: supplier.name,
      phone: supplier.phone,
      company: supplier.company,
      category: supplier.category || 'Bakery Raw Materials',
      email: supplier.email || '',
      address: supplier.address || '',
      contactPerson: supplier.contactPerson || '',
      creditLimit: supplier.creditLimit?.toString() || '',
      creditPeriod: supplier.creditPeriod?.toString() || '30'
    })
  }

  const handleCancel = () => {
    setEditingSupplier(null)
    setShowAddModal(false)
    setViewSupplier(null)
    setShowPaymentForm(false)
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setFormData({ name: '', phone: '', company: '', category: 'Bakery Raw Materials', email: '', address: '', contactPerson: '', creditLimit: '', creditPeriod: '30' })
    setPaymentAmount('')
    setPaymentMethod('Cash')
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      const result = await deleteSupplier(id)
      if (!result.success) {
        alert(result.error)
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSupplier) return

    const formDataToSend = new FormData()
    formDataToSend.append('id', editingSupplier.id.toString())
    formDataToSend.append('name', formData.name)
    formDataToSend.append('phone', formData.phone)
    formDataToSend.append('company', formData.company)
    formDataToSend.append('categoryId', selectedCategoryId?.toString() || '')
    formDataToSend.append('subCategoryId', selectedSubCategoryId?.toString() || '')
    formDataToSend.append('email', formData.email)
    formDataToSend.append('address', formData.address)
    formDataToSend.append('contactPerson', formData.contactPerson)
    formDataToSend.append('creditLimit', formData.creditLimit)
    formDataToSend.append('creditPeriod', formData.creditPeriod)

    await updateSupplier(formDataToSend)
    setEditingSupplier(null)
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setFormData({ name: '', phone: '', company: '', category: 'Bakery Raw Materials', email: '', address: '', contactPerson: '', creditLimit: '', creditPeriod: '30' })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('phone', formData.phone)
    formDataToSend.append('company', formData.company)
    formDataToSend.append('categoryId', selectedCategoryId?.toString() || '')
    formDataToSend.append('subCategoryId', selectedSubCategoryId?.toString() || '')
    formDataToSend.append('email', formData.email)
    formDataToSend.append('address', formData.address)
    formDataToSend.append('contactPerson', formData.contactPerson)
    formDataToSend.append('creditLimit', formData.creditLimit)
    formDataToSend.append('creditPeriod', formData.creditPeriod)

    await createSupplier(formDataToSend)
    setShowAddModal(false)
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setFormData({ name: '', phone: '', company: '', category: 'Bakery Raw Materials', email: '', address: '', contactPerson: '', creditLimit: '', creditPeriod: '30' })
  }

  const handleView = async (supplier: Supplier) => {
    setViewSupplier(supplier)
    setActiveTab('grn')
    setShowPaymentForm(false)
    
    // Load GRN history
    const grnData = await getSupplierGRNHistory(supplier.id)
    setGrnHistory(grnData)
    
    // Load payment ledger
    const ledgerData = await getSupplierPaymentLedger(supplier.id)
    setPaymentLedger(ledgerData)
    
    // Get payment status
    const status = await getSupplierPaymentStatus(supplier.id)
    setPaymentStatus(status || 'Pending')
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!viewSupplier || !paymentAmount) return

    const result = await recordSupplierPayment(
      viewSupplier.id,
      parseFloat(paymentAmount),
      paymentMethod
    )

    if (result.success) {
      alert('Payment recorded successfully!')
      setShowPaymentForm(false)
      setPaymentAmount('')
      
      // Refresh data
      const ledgerData = await getSupplierPaymentLedger(viewSupplier.id)
      setPaymentLedger(ledgerData)
      
      const status = await getSupplierPaymentStatus(viewSupplier.id)
      setPaymentStatus(status || 'Pending')
    } else {
      alert(result.error || 'Failed to record payment')
    }
  }

  const handleExportStatement = async (supplier: Supplier) => {
    // Placeholder for export functionality
    alert(`Exporting statement for ${supplier.name}... (PDF/Excel export to be implemented)`)
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || (supplier.category || 'Bakery Raw Materials') === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Suppliers</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{analytics.totalSuppliers}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm">🏢</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Balance</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                Rs. {analytics.totalOutstandingBalance.toFixed(2)}
              </p>
            </div>
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-sm">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Payments</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{analytics.overduePaymentsCount}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-sm">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editingSupplier && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3.5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Edit Supplier</h2>
          <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Supplier Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-8"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-8"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Credit Limit (LKR)</label>
              <input
                type="number"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-8"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Credit Period (Days)</label>
              <input
                type="number"
                value={formData.creditPeriod}
                onChange={(e) => setFormData({ ...formData, creditPeriod: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-8"
              />
            </div>
            <div className="flex-1 min-w-[300px]">
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Supply Category</label>
              <CategorySelector
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                selectedSubCategoryId={selectedSubCategoryId}
                onCategoryChange={setSelectedCategoryId}
                onSubCategoryChange={setSelectedSubCategoryId}
              />
            </div>
            <div className="flex items-end gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium h-8"
              >
                Update Supplier
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium h-8"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-8 px-3 text-xs font-medium text-white bg-primary rounded-lg shadow-sm"
        >
          + Add Supplier
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)]">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">ID</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Name</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Contact Person</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Email</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Company</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Credit Limit</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Credit Period</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Outstanding Balance</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Payment Status</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-6 text-center text-xs text-slate-500">
                    No suppliers found. Add your first supplier!
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-xs text-slate-800">{supplier.id}</td>
                    <td className="px-3 py-2 text-xs text-slate-800 font-medium">{supplier.name}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{supplier.contactPerson || '-'}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{supplier.email || '-'}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{supplier.company}</td>
                    <td className="px-3 py-2 text-xs text-slate-800 font-medium">
                      {supplier.creditLimit ? `Rs. ${supplier.creditLimit.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">{supplier.creditPeriod || 30} days</td>
                    <td className="px-3 py-2 text-xs text-slate-800 font-medium">
                      Rs. {(supplier.outstandingBalance || 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPaymentStatusBadge(supplierPaymentStatuses[supplier.id] || 'Pending')}`}>
                        {supplierPaymentStatuses[supplier.id] || 'Pending'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1 flex-wrap">
                        <button
                          onClick={() => handleView(supplier)}
                          className="px-2 py-0.5 text-[11px] font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="px-2 py-0.5 text-[11px] font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="px-2 py-0.5 text-[11px] font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-4 lg:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Add New Supplier</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credit Limit (LKR)</label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credit Period (Days)</label>
                  <input
                    type="number"
                    value={formData.creditPeriod}
                    onChange={(e) => setFormData({ ...formData, creditPeriod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supply Category</label>
                  <CategorySelector
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    selectedSubCategoryId={selectedSubCategoryId}
                    onCategoryChange={setSelectedCategoryId}
                    onSubCategoryChange={setSelectedSubCategoryId}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg transition-colors font-medium"
                >
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Supplier Modal */}
      {viewSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 lg:p-6 flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">{viewSupplier.name}</h2>
                <p className="text-amber-100 mb-3 text-sm lg:text-base">{viewSupplier.company}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                    {viewSupplier.category || 'Bakery Raw Materials'}
                  </span>
                  <span className="text-white font-semibold text-sm lg:text-base">
                    Outstanding: Rs. {(viewSupplier.outstandingBalance || 0).toFixed(2)}
                  </span>
                  <span className={`text-white px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusBadge(paymentStatus)}`}>
                    {paymentStatus}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportStatement(viewSupplier)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors flex items-center gap-1"
                  title="Export Statement"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm">Export</span>
                </button>
                <button
                  onClick={() => setViewSupplier(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Supplier Profile Info */}
            <div className="bg-gray-50 p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Supplier Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p className="font-medium text-gray-800">{viewSupplier.contactPerson || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{viewSupplier.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{viewSupplier.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Credit Limit</p>
                  <p className="font-medium text-gray-800">{viewSupplier.creditLimit ? `Rs. ${viewSupplier.creditLimit.toFixed(2)}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Credit Period</p>
                  <p className="font-medium text-gray-800">{viewSupplier.creditPeriod || 30} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">{viewSupplier.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4 lg:mb-6">
                <button
                  onClick={() => setActiveTab('grn')}
                  className={`px-4 lg:px-6 py-3 font-medium transition-colors text-sm lg:text-base ${
                    activeTab === 'grn'
                      ? 'text-amber-600 border-b-2 border-amber-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Purchase History (GRN)
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-4 lg:px-6 py-3 font-medium transition-colors text-sm lg:text-base ${
                    activeTab === 'payments'
                      ? 'text-amber-600 border-b-2 border-amber-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Payment Ledger
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'grn' ? (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">GRN #</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Item Name</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Qty</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Unit Price</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {grnHistory.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No GRN history found</td>
                          </tr>
                        ) : (
                          grnHistory.map((grn, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="px-4 py-3 text-sm text-gray-800">{new Date(grn.date).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{grn.grnNumber}</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{grn.itemName}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{grn.quantity}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">Rs. {grn.unitCost.toFixed(2)}</td>
                              <td className="px-4 py-3 text-sm text-gray-800 font-medium">Rs. {grn.totalAmount.toFixed(2)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Record Payment Button */}
                  <div className="mb-4 flex justify-end">
                    <button
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      {showPaymentForm ? 'Cancel' : '+ Record Payment'}
                    </button>
                  </div>

                  {/* Payment Form */}
                  {showPaymentForm && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Record Payment</h4>
                      <form onSubmit={handleRecordPayment} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (LKR)</label>
                          <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                            max={viewSupplier.outstandingBalance}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                          >
                            Submit Payment
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Payment Ledger Table */}
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[500px]">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-600">Receipt #</th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-600">Paid Amount</th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-600">Payment Method</th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-600">Remaining Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paymentLedger.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No payment history found</td>
                            </tr>
                          ) : (
                            paymentLedger.map((entry, index) => (
                              <tr key={index} className="hover:bg-gray-100">
                                <td className="px-4 py-3 text-sm text-gray-800">{new Date(entry.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-sm text-gray-800">{entry.receiptNumber}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 font-medium">Rs. {entry.paidAmount.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{entry.paymentMethod}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 font-medium">Rs. {entry.remainingBalance.toFixed(2)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 lg:p-6 flex justify-end">
              <button
                onClick={() => setViewSupplier(null)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
