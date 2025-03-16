import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { doubleCsrfProtection } from '../middlewares/csrf-protect' // Добавляем CSRF-защиту
import { Role } from '../models/user'

const customerRouter = Router()

// Маршруты для получения данных
customerRouter.get('/', auth, roleGuardMiddleware(Role.Admin), getCustomers)
customerRouter.get('/:id', auth, roleGuardMiddleware(Role.Admin), getCustomerById)

// Маршруты для изменения данных (с CSRF-защитой)
customerRouter.patch(
    '/:id',
    doubleCsrfProtection, // Добавляем CSRF-защиту
    auth,
    roleGuardMiddleware(Role.Admin),
    updateCustomer
)
customerRouter.delete(
    '/:id',
    doubleCsrfProtection, // Добавляем CSRF-защиту
    auth,
    roleGuardMiddleware(Role.Admin),
    deleteCustomer
)

export default customerRouter