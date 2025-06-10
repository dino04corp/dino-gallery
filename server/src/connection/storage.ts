const { cloudinary } = require('../config');
const { dataUri } = require('../middleware');
const streamifier = require('streamifier');

const storage = {
    upload: async (bucket, req) => {
        try {
            const now = new Date();
            const objectPath = now.toLocaleDateString('zh-Hans-CN');
            const folder = bucket + '/' + objectPath;
            const { originalname } = req.file;
            const options = {
                folder,
                resource_type: 'auto',
                use_filename: true,
                unique_filename: false,
                filename_override: originalname,
            };
            await cloudinary.api.create_folder(options.folder);
            return process.env.BASE64 !== true
                ? await uploadFromBuffer(req, options)
                : await cloudinary.uploader.upload(
                      dataUri(req).content,
                      options
                  );
        } catch (error) {
            console.log('error===============', error);
        }
    },
    list: async (bucket) => {
        try {
            return await cloudinary.api.resources({
                type: 'upload',
                prefix: bucket, // add your folder
            });
        } catch (error) {
            console.log('error===============', error);
        }
    },
    delete: async (req) => {
        const { asset_id } = req.params;
        try {
            const result =
                await cloudinary.api.resources_by_asset_ids(asset_id);
            return await cloudinary.uploader.destroy(
                result.resources[0].public_id
            );
        } catch (error) {
            console.log('error===============', error);
        }
    },
};

const uploadFromBuffer = (req, options) => {
    return new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
    });
};

module.exports = storage;
