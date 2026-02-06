import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
    private s3: S3Client;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.YANDEX_REGION,
            endpoint: "https://storage.yandexcloud.net",
            credentials: {
                accessKeyId: process.env.YANDEX_CLOUD_ACCESS_KEY!,
                secretAccessKey: process.env.YANDEX_CLOUD_SECRET_KEY!,
            },
        })
    }

    async uploadFile(fileBuffer: Buffer, fileName: string, folder: string, contentType: string) {
        const bucketName = process.env.YANDEX_CLOUD_BUCKET_NAME;
        const filePath = `${folder}/${Date.now()}-${fileName}`;

        await this.s3.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: filePath,
                Body: fileBuffer,
                ContentType: contentType,
                ACL: "public-read",
            })
        )

        return `https://storage.yandexcloud.net/${bucketName}/${filePath}`;
    }

    async deleteFile(key: string) {
        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.YANDEX_CLOUD_BUCKET_NAME,
                Key: key,
            })
        );
    }
}