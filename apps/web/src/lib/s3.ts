import { S3Client, PutObjectAclCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * S3 storage module.
 *
 * Centralizes S3 access and presigned-URL generation. Credentials live only in
 * server-side environment variables; the client never sees them. The bucket is
 * private — access happens exclusively through short-lived presigned URLs.
 */

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if(!region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS S3 environment variables");
}

const s3 = new S3Client({
    region,
    credentials:  {accessKeyId, secretAccessKey},
});

const UPLOAD_URL_EXPIRY = 60 // seconds
const DOWNLOAD_URL_EXPIRY = 60 * 60 // 1h

/**
 * Generates a presigned URL the browser can use to upload a file directly to
 * S3, without the file passing through the backend.
 */
export async function createUploadUrl(
    key: string,
    contentType: string
): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
    });
    return getSignedUrl(s3, command, {expiresIn: UPLOAD_URL_EXPIRY});
}

/**
 * Generates a presigned URL to read a private object for a limited time.
 */
export async function createDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key});
    return getSignedUrl(s3, command, { expiresIn: DOWNLOAD_URL_EXPIRY });
}
