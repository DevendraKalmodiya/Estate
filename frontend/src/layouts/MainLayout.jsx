import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

export default function MainLayout() {
  const { user, loading, authError, signOut } = useAuth()
  const userRole = user?.app_metadata?.role || user?.user_metadata?.role
  const [logoutError, setLogoutError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setLogoutError('')
    setLoggingOut(true)

    try {
      const { error } = await signOut()
      if (error) {
        setLogoutError(error.message)
        return
      }
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Unable to sign out.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            EstateAI
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-5">
            <Link to="/" className="font-medium text-slate-600 hover:text-primary">
              Home
            </Link>
            {(userRole === 'seller' || userRole === 'admin') && (
              <Link
                to="/seller/add-property"
                className="font-medium text-slate-600 hover:text-primary"
              >
                Add Property
              </Link>
            )}
            {loading ? (
              <span className="text-sm text-slate-500">Loading session...</span>
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="font-medium text-slate-600 hover:text-red-600 disabled:opacity-60"
                >
                  {loggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="font-medium text-slate-600 hover:text-primary">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        {(authError || logoutError) && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {logoutError || authError}
          </div>
        )}
        <Outlet />
      </main>

      <footer className="mt-auto bg-slate-900 py-8 text-center text-slate-300">
        <p>&copy; {new Date().getFullYear()} EstateAI. All rights reserved.</p>
      </footer>
    </div>
  )
}
