'use client'

import { useState } from 'react'
import { deleteUser, updateUser } from '@/actions/user'
import { resetUserPassword } from "@/actions/user"

interface User {
  id: number
  username: string
  role: string
  status: string
  pinCode: string | null
  canUnlockScreen: boolean
  lastLoginAt: string | null
  createdAt: string
}

interface UserTableProps {
  users: User[]
}

export default function UserTable({ users }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    username: '',
    role: 'CASHIER',
    status: 'ACTIVE',
    pinCode: '',
    canUnlockScreen: false
  })

  const handleDelete = async (id: number, username: string) => {
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      await deleteUser(id)
      window.location.reload()
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setEditForm({
      username: user.username,
      role: user.role,
      status: user.status,
      pinCode: user.pinCode || '',
      canUnlockScreen: user.canUnlockScreen
    })
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return

    const result = await updateUser(editingUser.id, {
      username: editForm.username,
      role: editForm.role as any,
      status: editForm.status as any,
      pinCode: editForm.pinCode || null,
      canUnlockScreen: editForm.canUnlockScreen
    })

    if (result.success) {
      setEditingUser(null)
      window.location.reload()
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'MANAGER': return 'bg-green-100 text-green-800'
      case 'CASHIER': return 'bg-blue-100 text-blue-800'
      case 'KITCHEN': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="shadow-sm border border-slate-200 bg-white rounded-lg overflow-hidden">
      {/* Search and Filter */}
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="CASHIER">Cashier</option>
              <option value="KITCHEN">Kitchen</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">ID</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Username</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Role</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">PIN</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Last Login</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-xs text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs text-gray-800">{user.id}</td>
                  <td className="px-3 py-2 text-xs text-gray-800 font-medium">{user.username}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {user.pinCode ? '••••' : 'Not set'}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {formatDate(user.lastLoginAt)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-xs h-7"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          const newPassword = prompt(`Enter new password for ${user.username}:`);
                          if (!newPassword) return;
                          if (newPassword.length < 4) {
                            alert("Password must be at least 4 characters long!");
                            return;
                          }
                          
                          const res = await resetUserPassword(user.id, newPassword);
                          if (res.success) {
                            alert("Password reset successfully!");
                          } else {
                            alert("Something went wrong!");
                          }
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs h-7"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.username)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 h-7"
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-3 w-full max-w-md">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Edit User</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="CASHIER">Cashier</option>
                  <option value="KITCHEN">Kitchen</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">PIN Code (4 digits)</label>
                <input
                  type="text"
                  value={editForm.pinCode}
                  onChange={(e) => setEditForm({ ...editForm, pinCode: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  placeholder="Leave empty to remove PIN"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Can Unlock Screen</label>
                <div className="flex items-center h-8">
                  <input
                    type="checkbox"
                    checked={editForm.canUnlockScreen}
                    onChange={(e) => setEditForm({ ...editForm, canUnlockScreen: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-xs text-slate-600">Allow user to unlock locked screens</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-2 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium h-8"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-2 py-1.5 text-xs bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium h-8"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
