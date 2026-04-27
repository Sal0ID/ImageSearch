import { Client } from "minio";

const endpoint = process.env.MINIO_ENDPOINT!;
const port = parseInt(process.env.MINIO_PORT!, 10);
const accessKey = process.env.MINIO_ACCESS_KEY!;
const secretKey = process.env.MINIO_SECRET_KEY!;
const bucket = process.env.MINIO_BUCKET!;

export const minioClient = new Client({
  endPoint: endpoint,
  port,
  useSSL: false,
  accessKey,
  secretKey,
});

export async function getImageStream(objectKey: string) {
  return minioClient.getObject(bucket, objectKey);
}
