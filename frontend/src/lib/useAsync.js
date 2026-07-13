import { useEffect, useState } from 'react'
import { subscribe } from '../data/mockDb.js'

// Standardizes the loading / error / empty / data pattern used across every
// data-driven page.
//
// It also subscribes to the shared mock database, so when the admin panel
// publishes or edits something — in this tab or another one — every open page
// refetches on its own. That's what makes "publish in admin, see it on the
// site" work without a backend or a page reload.
export function useAsync(fetcher, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', data: null, error: null })

    fetcher()
      .then((data) => {
        if (cancelled) return
        setState({ status: 'success', data, error: null })
      })
      .catch((error) => {
        if (cancelled) return
        setState({ status: 'error', data: null, error })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  // Refetch whenever the admin panel writes to the shared database.
  useEffect(() => subscribe(() => setAttempt((a) => a + 1)), [])

  const retry = () => setAttempt((a) => a + 1)

  return { ...state, retry }
}
