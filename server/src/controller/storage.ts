import { Request, Response } from 'express';
import fse from 'fs-extra';
import { StorageDB } from '../constant';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../helpers/logger';
import { Cloudinary } from '../services';

export const storage = {
    create: async (req: Request, res: Response) => {
        try {
            const { storage_name, cloud_storage, ...configure } = req.body;

            if (
                cloud_storage !== 'cloudinary' &&
                cloud_storage !== 'amazons3'
            ) {
                res.status(400).json({
                    message: 'Unsupported cloud storage type',
                    success: false,
                });
            }

            let data = []; // Khởi tạo data là một đối tượng trống

            // Kiểm tra xem file đã tồn tại chưa và đọc dữ liệu cũ
            if (fse.existsSync(StorageDB)) {
                const rawData = fse.readFileSync(StorageDB, 'utf8');
                try {
                    data = JSON.parse(rawData);
                } catch (e) {
                    logger.error('Dữ liệu cũ không hợp lệ!');
                }
            }

            let storage_id = uuidv4();
            const newStorage = {
                id: storage_id,
                storage_name,
                cloud_storage,
                configure,
            };
            data.push(newStorage);

            // Ghi lại toàn bộ dữ liệu vào file
            fse.writeFileSync(
                StorageDB,
                JSON.stringify(data, null, 2), // Dữ liệu đã cập nhật
                'utf8'
            );

            res.status(201).json({
                data: newStorage,
                message: `Created configuration for ${storage_name}`,
                success: true,
            });
        } catch (e: unknown) {
            handleError(res, e);
        }
    },
    read: async (req: Request, res: Response) => {
        try {
            const { storage_name } = req.params;
            const rawData = fse.readFileSync(StorageDB, 'utf8');
            const data = JSON.parse(rawData);
            res.status(200).json({
                data: data,
                success: true,
            });
        } catch (e: unknown) {
            handleError(res, e);
        }
    },
    readById: async (req: Request, res: Response) => {
        try {
            const { storage_id } = req.params;
            const rawData = fse.readFileSync(StorageDB, 'utf8');
            const storages = JSON.parse(rawData);
            const index = storages.findIndex(
                (item: any) => item.id === storage_id
            );
            if (index !== -1) {
                res.status(200).json({
                    data: storages[index],
                    success: true,
                });
            } else {
                res.status(404).json({
                    message: `No configuration found for '${storage_id}'`,
                    success: false,
                });
            }
        } catch (e: unknown) {
            handleError(res, e);
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const { storage_id } = req.params;
            const { storage_name, ...configure } = req.body;

            const rawData = fse.readFileSync(StorageDB, 'utf8');
            const data = JSON.parse(rawData);
            const index = data.findIndex((item: any) => item.id === storage_id);
            if (index !== -1) {
                data[index] = { ...data[index], storage_name, configure };

                fse.writeFileSync(
                    StorageDB,
                    JSON.stringify(data, null, 2),
                    'utf8'
                );

                res.status(200).json({
                    data: data[index],
                    message: `Updated configuration for '${storage_id}'`,
                    success: true,
                });
            } else {
                res.status(404).json({
                    message: `No configuration found for '${storage_id}'`,
                    success: false,
                });
            }
        } catch (e: unknown) {
            handleError(res, e);
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const { storage_id } = req.params;

            const rawData = fse.readFileSync(StorageDB, 'utf8');
            const storages = JSON.parse(rawData);
            const index = storages.findIndex(
                (item: any) => item.id === storage_id
            );
            if (index !== -1) {
                const { storage_name } = storages[index];
                storages.splice(index, 1);
                fse.writeFileSync(
                    StorageDB,
                    JSON.stringify(storages, null, 2),
                    'utf8'
                );

                res.status(200).json({
                    message: `Deleted configuration for '${storage_name}'`,
                    success: true,
                });
            } else {
                res.status(404).json({
                    message: `No configuration found!`,
                    success: false,
                });
            }
        } catch (e: unknown) {
            handleError(res, e);
        }
    },
    ping: async (req: Request, res: Response) => {
        try {
            const { cloud_storage } = req.params;
            const configure = req.body;
            switch (cloud_storage) {
                case 'cloudinary': {
                    const { cloud_name, api_key, api_secret } = configure;

                    const service = new Cloudinary({
                        cloud_name,
                        api_key,
                        api_secret,
                    });

                    // Gọi phương thức ping
                    const notify = await service.ping();
                    res.status(200).json({
                        status: 'success',
                        message: notify.message,
                        data: notify.data,
                        success: true,
                    });
                }

                case 'amazons3':
                    break;

                default:
                    break;
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                res.status(500).json({
                    error: { code: e.name, message: e.message },
                    success: false,
                });
            }
            res.status(500).json({
                error: {
                    code: 'UNKNOWN',
                    message: 'An unknown error occurred',
                },
                success: false,
            });
        }
    },
};

const hashStr = (str: string, alg: string = 'sha256'): string => {
    const hash = crypto.createHash(alg);
    hash.update(str);
    return hash.digest('hex');
};

const handleError = (res: Response, e: unknown) => {
    if (e instanceof Error) {
        res.status(500).json({
            error: { code: e.name, message: e.message },
            success: false,
        });
    } else {
        res.status(500).json({
            error: { code: 'UNKNOWN', message: 'An unknown error occurred' },
            success: false,
        });
    }
};
