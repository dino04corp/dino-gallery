import { NextFunction, Request, Response, Router } from 'express';
import path from 'path';
import v1Routes from './v1';
const router = Router();

router.use('/api/v1', v1Routes);
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(413).send('File too large');
    }
    if (err.message === 'Unexpected end of form') {
        res.status(400).send(
            'Upload did not complete properly. Please try again.'
        );
    }
    res.status(500).send('Server error');
});

router.get('/dashboard', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../dist/dashboard/index.html'));
});
router.get('/ping', (req: Request, res: Response) => {
    res.status(201).json({
        message: 'Hello, world!',
        success: true,
    });
});
router.get('/docs', (req: Request, res: Response) => {
    res.redirect('https://documenter.getpostman.com/view/11424693/2sA3Bj8tca');
});

export default router;
