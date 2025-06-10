import { Request, Response } from 'express';
import fse from 'fs-extra';
import { ResourceDB, StorageDB } from '../constant';
import { Cloudinary } from '../services';
import BadRequestError from '../helpers/errors';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import https from 'https';
import { logger } from '../helpers/logger';

export const resource = {
    upload: async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                throw new BadRequestError({
                    code: 400,
                    message: 'No file uploaded!',
                    logging: true,
                });
            }

            const { storage_id } = req.params;

            const rawData = fse.readFileSync(StorageDB, 'utf8');
            const dataStorage = JSON.parse(rawData);
            const index = dataStorage.findIndex(
                (item: any) => item.id === storage_id
            );
            const { cloud_storage, configure } = dataStorage[index];

            switch (cloud_storage) {
                case 'cloudinary': {
                    const { cloud_name, api_key, api_secret } = configure;

                    console.log(configure);

                    const service = new Cloudinary({
                        cloud_name,
                        api_key,
                        api_secret,
                    });

                    const result = await service.upload(req.file.path);

                    let resources = []; // Khởi tạo data là một đối tượng trống

                    // Kiểm tra xem file đã tồn tại chưa và đọc dữ liệu cũ
                    if (fse.existsSync(ResourceDB)) {
                        const rawData = fse.readFileSync(ResourceDB, 'utf8');
                        try {
                            resources = JSON.parse(rawData);
                        } catch (e) {
                            logger.error('Dữ liệu cũ không hợp lệ!');
                        }
                    }

                    let resource_id = uuidv4();
                    const newResource = {
                        id: resource_id,
                        storage_id,
                        ...result,
                    };
                    resources.push(newResource);

                    fse.writeFileSync(
                        ResourceDB,
                        JSON.stringify(resources, null, 2),
                        'utf8'
                    );

                    res.status(200).json({
                        status: 'success',
                        message: 'Upload successfully',
                        data: newResource,
                        success: true,
                    });
                }
            }
        } catch (e: unknown) {
            handleError(res, e);
        }
    },
    // upload: async (req: Request, res: Resonse) => {
    //     if (!req.file) {
    //         throw new BadRequestError({code: 400, message: "No file uploaded!", logging: true});
    //     }
    //     try {
    //         const {cloud_storage} = req.params;
    //         const configure = req.body;

    //         switch (cloud_storage) {
    //             case 'cloudinary': {
    //                 const {cloud_name, api_key, api_secret} = configure;

    //                 console.log(configure)

    //                 const service = new Cloudinary({
    //                     cloud_name,
    //                     api_key,
    //                     api_secret,
    //                 });

    //                 // Gọi phương thức ping
    //                 console.log(req.file)
    //                 const result = await service.upload(req.file.path);
    //                 res.status(200).json({
    //                     status: 'success',
    //                     message: 'Upload successfully',
    //                     data: result,
    //                     success: true,
    //                 });
    //             }
    //         }
    //     } catch (e: unknown) {
    //         handleError(res, e);
    //     }
    // },
    read: async (req: Request, res: Response) => {
        try {
            const rawData = fse.readFileSync(ResourceDB, 'utf8');
            const newResource = JSON.parse(rawData);
            res.status(200).json({
                data: newResource,
                success: true,
            });
        } catch (e: unknown) {
            handleError(res, e);
        }
    },
    readByID: async (req: Request, res: Response) => {
        const { resource_id } = req.params;

        const rawData = fse.readFileSync(ResourceDB, 'utf8');
        const resources = JSON.parse(rawData);
        const index = resources.findIndex(
            (item: any) => item.id === resource_id
        );
        if (index !== -1) {
            const {
                public_id,
                secure_url,
                width,
                height,
                format,
                resource_type,
                created_at,
            } = resources[index];
            res.status(200).json({
                data: {
                    public_id,
                    url: secure_url,
                    width,
                    height,
                    format,
                    resource_type,
                    created_at,
                },
                message: 'Get resource successfully',
                success: true,
            });
        } else {
            res.status(404).json({
                message: `Not found resource for '${resource_id}'`,
                success: false,
            });
        }
    },
    //   readByURL: async (req: Request, res: Resonse) => {
    //     const { bucketname, objectpath, filename } = req.params;
    //     // res.redirect(`https://res.cloudinary.com/${cloudinary.config().cloud_name}/${bucketname}/${objectpath}/${filename}`);
    //     // Dont use redirect
    //     const options = {
    //       method: 'GET',
    //     };
    //     const ssl = true;
    //     const transport = ssl ? https : http;
    //     const request = https.request(
    //       `https://res.cloudinary.com/${
    //         cloudinary.config().cloud_name
    //       }/${bucketname}/${objectpath}/${filename}`,
    //       options,
    //       (res) => {
    //         res.set(res.headers);
    //         res.pipe(res);
    //       }
    //     );
    //     request.on('error', (e) => {
    //       console.error(e);
    //     });
    //     request.end();
    //   },
    // list: async (req, res) => {
    //     const bucket = 'dino-gallery';
    //     const data = await storage.list(bucket);
    //     const resonse = [];
    //     for (v of data.resources) {
    //         resonse.push({
    //             asset_id: v.asset_id,
    //             demo_url: 'http://localhost:3000/api/' + v.public_id,
    //             format: v.format,
    //             resource_type: v.resource_type,
    //             bytes: v.bytes,
    //             created_at: v.created_at,
    //         });
    //     }
    //     res.status(200).json({
    //         data: resonse,
    //         message: 'List file in gallery',
    //         success: true,
    //     });
    // },
    delete: async (req: Request, res: Response) => {
        const { resource_id } = req.params;

        const rawResource = fse.readFileSync(ResourceDB, 'utf8');
        const resources = JSON.parse(rawResource);
        const idx_resource = resources.findIndex(
            (item: any) => item.id === resource_id
        );
        if (idx_resource === -1) {
            res.status(404).json({
                message: `Not found resource for '${resource_id}'`,
                success: false,
            });
            return;
        }

        const { public_id, storage_id } = resources[idx_resource];

        const rawStorage = fse.readFileSync(StorageDB, 'utf8');
        const storages = JSON.parse(rawStorage);
        const idx_storage = storages.findIndex(
            (item: any) => item.id === storage_id
        );

        if (idx_storage === -1) {
            res.status(404).json({
                message: `Not found storage for '${resource_id}'`,
                success: false,
            });
            return;
        }
        const { cloud_name, api_key, api_secret } =
            storages[idx_storage].configure;
        console.log('-----------', [public_id], {
            cloud_name,
            api_key,
            api_secret,
        });
        const service = new Cloudinary({
            cloud_name,
            api_key,
            api_secret,
        });

        const result = await service.delete([public_id]);
        console.log('-----------', result);

        resources.splice(idx_resource, 1);
        fse.writeFileSync(
            ResourceDB,
            JSON.stringify(resources, null, 2),
            'utf8'
        );

        res.status(200).json({
            message: `Delete resource '${resource_id}' successfully`,
            success: true,
        });
    },
};

// async function listDirection() {
//     if (!fse.existsSync(localMetadata)) {
//         console.error("Not exits directory: ", localMetadata)
//         fse.writeJsonSync(localMetadata, [])
//     }
//     jsonString = await fse.readFile(localMetadata, "utf8")
//     listImage = JSON.parse(jsonString);
//     return listImage
// }

const handleError = (res: Response, e: any) => {
    if (e instanceof BadRequestError) {
        res.status(e.statusCode || 400).json({
            error: { code: e.name, message: e.message },
            success: false,
        });
    } else if (e instanceof Error) {
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
