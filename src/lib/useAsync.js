import { useEffect, useState } from 'react'

// Standardizes the loading / error / empty / data pattern used across every data-driven page.
//
// Cleanup vs the previous version: the retry counter is now real state instead
// of a mutated ref. Previously, retry() bumped a ref and relied on an
// accompanying setState call to force the re-render that made the effect see
// the new deps value — it worked, but only by accident of ordering. With
// useState, bumping the counter is itself what re-runs the effect, and the
// effect owns resetting to 'loading', so there's a single source of truth.
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

  const retry = () => setAttempt((a) => a + 1)

  return { ...state, retry }
}