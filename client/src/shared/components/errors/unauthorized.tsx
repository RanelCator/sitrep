import type { JSX } from "react"
import { Link } from "@tanstack/react-router"

import { ShieldX } from "lucide-react"

export function UnauthorizedPage(): JSX.Element {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_45%)]" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
            <ShieldX className="size-10 text-red-400" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
            Unauthorized Access
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Access Denied
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
            You are not authorized to access the SITREP
            system. Please authenticate through the
            official Palarong Pambansa portal.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://pgas.ph/pptfs/"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
            >
              Go to PPTFS Portal
            </a>

            <Link
              to="/scan"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Open Public QR Scanner
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}