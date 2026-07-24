import { getUsers } from '@/actions/user'
import { createUser } from '@/actions/user'
import { deleteUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import UserTable from './UserTable'

export default async function AdminUsersPage() {
  const users = await getUsers()

  // Convert Date objects to strings for serialization
  const serializedUsers = users.map(user => ({
    ...user,
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
    canUnlockScreen: user.canUnlockScreen ?? false
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Add New User</h2>
        <form action={async (formData: FormData) => {
          'use server'
          const result = await createUser(formData)
          if (!result.success) {
            redirect('/admin/users?error=' + encodeURIComponent(result.error || 'Failed to create user'))
          }
        }} className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="username" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Enter username"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Enter password"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="role" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="CASHIER">Cashier</option>
              <option value="KITCHEN">Kitchen</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="pinCode" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              PIN Code (Optional)
            </label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              maxLength={4}
              pattern="[0-9]{4}"
              className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="4-digit PIN"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="canUnlockScreen" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Can Unlock Screen
            </label>
            <div className="flex items-center h-8">
              <input
                type="checkbox"
                id="canUnlockScreen"
                name="canUnlockScreen"
                value="true"
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
              />
              <span className="ml-2 text-xs text-slate-600">Allow user to unlock locked screens</span>
            </div>
          </div>

          <div className="flex items-end w-full sm:w-auto">
            <button
              type="submit"
              className="h-8 px-3 text-xs font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 shadow-sm"
            >
              Add User
            </button>
          </div>
        </form>
      </div>

      <UserTable users={serializedUsers} />
    </div>
  )
}
