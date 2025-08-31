// src/modules/auth/guards/index.js - Navigation guards setup
export const setupAuthGuards = (router) => {
  router.beforeEach(async (to, from, next) => {
    const { authMiddleware } = await import('../middleware/auth')
    return authMiddleware(to, from, next)
  })
}