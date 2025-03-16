import { Router, NextFunction, Request, Response } from 'express'
import BadRequestError from '../errors/bad-request-error'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody } from '../middlewares/validations'
import { doubleCsrfProtection } from '../middlewares/csrf-protect' // Добавляем CSRF-защиту
import { Role } from '../models/user'

const orderRouter = Router()

const checkQueryOnObject = async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    const keys = Object.keys(req.query)
    for (let i = 0; i < keys.length; i += 1) {
        if (typeof req.query[keys[i]] === 'object') {
            next(
                new BadRequestError('Входной параметр не может быть объектом!')
            )
        }
    }
    next()
}

// Создание заказа
orderRouter.post('/', auth, validateOrderBody, createOrder)

// Получение списка всех заказов (только для администраторов)
orderRouter.get(
    '/all',
    auth,
    roleGuardMiddleware(Role.Admin), // Добавляем проверку ролей
    checkQueryOnObject, // Добавляем проверку параметров запроса
    getOrders
)

// Получение списка заказов текущего пользователя
orderRouter.get('/all/me', auth, getOrdersCurrentUser)

// Получение заказа по номеру (только для администраторов)
orderRouter.get(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    getOrderByNumber
)

// Получение заказа текущего пользователя по номеру
orderRouter.get('/me/:orderNumber', auth, getOrderCurrentUserByNumber)

// Обновление заказа (только для администраторов)
orderRouter.patch(
    '/:orderNumber',
    auth,
    doubleCsrfProtection, // Добавляем CSRF-защиту
    roleGuardMiddleware(Role.Admin),
    updateOrder
)

// Удаление заказа (только для администраторов)
orderRouter.delete(
    '/:id',
    auth,
    doubleCsrfProtection, // Добавляем CSRF-защиту
    roleGuardMiddleware(Role.Admin),
    deleteOrder
)

export default orderRouter