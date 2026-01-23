import { put, del, list } from "@vercel/blob";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN environment variable is not set");
}

export async function uploadFile(file: File, pathname: string): Promise<string> {
  const blob = await put(pathname, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });
  return blob.url;
}

export async function deleteFile(url: string): Promise<void> {
  await del(url, {
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });
}

export async function listFiles(prefix?: string) {
  return list({
    prefix,
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });
}
