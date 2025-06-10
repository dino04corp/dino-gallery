import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes';
import path from 'path';
import connectMongoDB from './connection/mongodb';
require('dotenv').config({});

const app: Application = express();

// Default headers middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Author', 'hugmahit@gmail.com');
    res.setHeader('X-Copyright', 'DINO');
    res.setHeader('X-XSS-Protection', '1'); // Ensure it's a string
    next();
});

// Disable 'x-powered-by' header
app.disable('x-powered-by');

// Middleware setup
app.use(cors());
app.use(
    express.static(path.join(__dirname, '../client/build'), {
        maxAge: 7 * 24 * 3600 * 1000, // Explicitly use milliseconds
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Main routes
app.use(routes);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    const FAVICON_REGEX =
        /\/(favicon|(apple-)?touch-icon(-i(phone|pad))?(-\d{2,}x\d{2,})?(-precomposed)?)\.(jpe?g|png|ico|gif)$/i;
    if (FAVICON_REGEX.test(req.url)) {
        res.sendStatus(204); // No Content
        return;
    }
    const err: any = new Error(`Not Found: ${req.method} - ${req.originalUrl}`);
    err.status = 404;
    next(err);
});

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[ErrorHandler]', err); // Always log errors for debugging
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

connectMongoDB();

export default app;
