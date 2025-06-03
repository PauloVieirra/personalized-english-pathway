
import { supabase } from './supabase';

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The bucket name to upload to
 * @param path Optional path within the bucket
 * @returns The URL of the uploaded file or null if upload failed
 */
export async function uploadFile(file: File, bucket: string, path?: string): Promise<string | null> {
  try {
    if (!file) return null;
    
    // Generate a unique filename using crypto.randomUUID()
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Upload the file
    console.log(`Uploading file to bucket: ${bucket}, path: ${filePath}`);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data?.path || filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

/**
 * Upload an image to Supabase Storage (specific for images)
 * @param file The image file to upload
 * @param bucket The bucket name to upload to
 * @returns The URL of the uploaded image or null if upload failed
 */
export async function uploadImageToSupabase(file: File, bucket: string): Promise<string | null> {
  return uploadFile(file, bucket, 'images');
}

/**
 * Delete a file from Supabase Storage
 * @param url The URL of the file to delete
 * @param bucket The bucket name
 * @returns Whether the deletion was successful
 */
export async function deleteFile(url: string, bucket: string): Promise<boolean> {
  try {
    if (!url) return false;
    
    // Extract the file path from the URL
    const pathMatch = url.match(new RegExp(`${bucket}/(.*)`));
    if (!pathMatch || !pathMatch[1]) return false;
    
    const filePath = pathMatch[1];
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
      
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}
