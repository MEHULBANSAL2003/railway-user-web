export function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token)
  if (!decoded?.exp) return true
  // Add 10-second buffer to account for clock skew
  return Date.now() >= (decoded.exp * 1000) - 10000
}
