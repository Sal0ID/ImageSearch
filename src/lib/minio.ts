import { Client } from "minio";

let client: Client | null = null;

function getMinioClient(): Client {
  if (!client) {
    client = new Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: parseInt(process.env.MINIO_PORT!, 10),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });
  }
  return client;
}

export async function getImageStream(objectKey: string) {
  return getMinioClient().getObject(
    process.env.MINIO_BUCKET!,
    objectKey
  );
}
