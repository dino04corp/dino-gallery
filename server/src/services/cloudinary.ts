import { v2 as cloudinary } from 'cloudinary';
import fse from 'fs-extra';

interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
}

class CloudinaryService {
    private readonly cloud_name: string;
    private readonly api_key: string;
    private readonly api_secret: string;

    constructor(configure: CloudinaryConfig) {
        // Kiểm tra cấu hình hợp lệ
        if (
            !configure.cloud_name ||
            !configure.api_key ||
            !configure.api_secret
        ) {
            throw new Error(
                'Missing required Cloudinary configuration values.'
            );
        }

        this.cloud_name = configure.cloud_name;
        this.api_key = configure.api_key;
        this.api_secret = configure.api_secret;

        // Cấu hình Cloudinary
        cloudinary.config({
            cloud_name: this.cloud_name,
            api_key: this.api_key,
            api_secret: this.api_secret,
        });
    }

    // Phương thức ping để kiểm tra kết nối
    async ping() {
        // Gọi một API nào đó từ Cloudinary để kiểm tra kết nối
        return await cloudinary.api.ping();
    }

    async upload(path: string): Promise<any> {
        // Gọi một API nào đó từ Cloudinary để kiểm tra kết nối
        // Tải tệp lên Cloudinary từ buffer
        const options = {
            folder: 'uploads/documents', // Lưu tệp trong thư mục cụ thể
            use_filename: true, // Giữ nguyên tên file gốc
            unique_filename: false, // Không thêm chuỗi ngẫu nhiên vào tên
            overwrite: true, // Cho phép ghi đè file
            resource_type: 'auto', // Tự động xác định loại file
            transformation: [
                {
                    width: 1000,
                    height: 1000,
                    crop: 'limit',
                },
            ],
            tags: ['important', 'upload'], // Gắn tag cho file
            quality: 'auto', // Tối ưu chất lượng
            // format: 'jpg',              // Chuyển đổi định dạng
        };

        const uploadStream = await cloudinary.uploader.upload(path, {
            options,
        });
        fse.unlink(path, (unlinkErr) => {
            if (unlinkErr) console.error('Lỗi xóa file:', unlinkErr);
        });

        return uploadStream;
    }

    async delete(public_ids: string[]): Promise<any> {
        const result = await cloudinary.api.delete_resources(public_ids);
        return result;
    }
}

export default CloudinaryService;
