import http, { Server } from 'http';
// import https from 'https';
// import fs from 'fs';
// import path from 'path';
import app from './app';

// Start http server
const HTTP_PORT = normalizePort(process.env.PORT ?? 8000);
app.set('port', HTTP_PORT);
const httpServer: http.Server = http.createServer(app);
httpServer.listen(HTTP_PORT, onListening);

// Start https server
// const HTTPS_PORT = normalizePort(process.env.HTTPS_PORT || 443);
// app.set('https_port', HTTPS_PORT);
// const options = {
//     key: fs.readFileSync(path.join(__dirname, 'key')),
//     cert: fs.readFileSync(path.join(__dirname, 'crt')),
//     ca: fs.readFileSync(path.join(__dirname, 'ca')),
// };
// https.createServer(options, app).listen(HTTPS_PORT, onListening);

function onListening(this: Server): void {
    // Specify 'this' as type 'http.Server'
    const addr = this.address();
    const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
    console.info('Web server listening on ' + bind);
}

function normalizePort(val: any): string | number | false {
    // Declare types for the function parameters and return
    const port = parseInt(val, 10);
    if (isNaN(port)) return val; // named pipe
    if (port >= 0) return port; // port number
    return false;
}

const shutdown = (): void => {
    // Declare return type of shutdown function
    console.info('[shutdown]', new Date());
    process.exit(0);
};

// Handle process termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    // Specify 'err' type as 'Error'
    console.error('[uncaughtException]', err, err.stack);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, p: Promise<any>) => {
    // Specify 'reason' as 'any' and 'p' as 'Promise<any>'
    console.warn(
        '[unhandledRejection] ',
        p,
        reason,
        reason ? reason.stack : undefined
    );
});
