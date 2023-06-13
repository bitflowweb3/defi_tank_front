export const config = {
  DEBUG: process.env.DEBUG === 'true' ? true : false,
  CHAINID: Number(process.env.CHAINID),

  BACKEND_URL: process.env.REACT_APP_BASE_BACKEND,
  FRONTEND_URL: process.env.REACT_APP_BASE_FRONTEND,
}