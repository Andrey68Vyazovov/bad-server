import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { DB_ADDRESS } from './config';
import errorHandler from './middlewares/error-handler';
import serveStatic from './middlewares/serverStatic';
import routes from './routes';
import { limiter } from './middlewares/limiter'; // Импортируем лимитер

const { PORT = 3000 } = process.env;
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Разрешить запросы только с этого домена
    credentials: true, // Разрешить передачу кук и заголовков авторизации
}));
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(urlencoded({ extended: true }));
app.use(json());

// Лимитер применяется ко всем маршрутам
app.use(limiter);

// Маршруты
app.options('*', cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(routes);

// Обработка ошибок
app.use(errors());
app.use(errorHandler);

// Запуск сервера и подключение к базе данных
const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS);
        await app.listen(PORT, () => console.log('Сервер запущен на порту', PORT));
    } catch (error) {
        console.error('Ошибка при запуске сервера:', error);
    }
};

bootstrap();