// eslint-disable-next-line import/no-extraneous-dependencies
import { rateLimit } from 'express-rate-limit'
import { constants } from 'http2'
import { MAX_REQUEST_PER_MINUTE } from '../config'

export const limiter = rateLimit({
    windowMs: 120 * 60 * 1000,
    max: MAX_REQUEST_PER_MINUTE,
    handler: (_req, res) => {
        res.status(constants.HTTP_STATUS_TOO_MANY_REQUESTS).json({
            message: 'Достигнут лимит запросов. Повторите попытку позже.',
        })
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
})