import React from 'react'

// Simplified — Thai only. `t(str, params)` just returns str with param substitution.
function useT() {
  return React.useCallback((th, params) => {
    let s = th;
    if (params) for (const k in params) s = s.replace(`{${k}}`, params[k]);
    return s;
  }, []);
}

export { useT }
