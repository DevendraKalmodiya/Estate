import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'

export default function Home() {
  const { user } = useAuth()

  return (
    <section className="mx-auto max-w-4xl py-16 text-center sm:py-24">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Find a place to call home
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
        Your next move starts here.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        Discover a simpler way to explore real estate and get started with EstateAI.
      </p>
      {user ? (
        <p className="mt-8 text-slate-700">
          Welcome back, {user.user_metadata?.full_name || user.email}.
        </p>
      ) : (
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Create an account
          </Link>
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      )}
    </section>
  )
}
