import { login } from '@/actions/auth'
import { getStoreSettings } from '@/actions/store'
import StoreLogo from '@/components/StoreLogo'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const storeSettings = await getStoreSettings()
  const storeName = storeSettings?.shopName || 'Bakery POS'
  const logoUrl = storeSettings?.logoUrl

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-slate-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100/50">
          {/* Branding Header */}
          <div className="text-center mb-8">
            {/* Store Logo with Fallback */}
            <StoreLogo logoUrl={logoUrl} storeName={storeName} />
            
            {/* Store Name */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              {storeName}
            </h1>
            <p className="text-slate-500 text-sm">Sign in to access your dashboard</p>
          </div>

          <form action={login} className="space-y-5">
            {/* Username Input */}
            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-slate-400"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-slate-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Secure login powered by RAK System
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
