import { useEffect, useRef, useState } from 'react'

// Standardizes the loading / error / empty / data pattern used across every data-driven page.
export function useAsync(fetcher, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const attempt = useRef(0)

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
  }, [...deps, attempt.current])

  const retry = () => {
    attempt.current += 1
    setState({ status: 'loading', data: null, error: null })
  }

  return { ...state, retry }
}
