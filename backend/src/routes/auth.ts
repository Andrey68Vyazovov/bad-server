import { Router } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import { doubleCsrfProtection } from '../middlewares/csrf-protect' // Добавляем CSRF-защиту

const authRouter = Router()

// Маршруты с аутентификацией
authRouter.get('/user', auth, getCurrentUser)
authRouter.patch('/me', doubleCsrfProtection, auth, updateCurrentUser) // Добавляем CSRF-защиту
authRouter.get('/user/roles', auth, getCurrentUserRoles)

// Маршруты без аутентификации
authRouter.post('/login', login)
authRouter.get('/token', refreshAccessToken)
authRouter.get('/logout', logout)
authRouter.post('/register', register)

export default authRouter