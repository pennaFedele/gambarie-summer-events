// Utility functions for image optimization
export const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, 'image/webp', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const generateThumbnail = (file: File): Promise<Blob> => {
  return resizeImage(file, 400, 300, 0.7);
};

export const generateOptimizedImage = (file: File): Promise<Blob> => {
  return resizeImage(file, 1200, 800, 0.85);
};

export const uploadImageToSupabase = async (
  file: Blob, 
  eventId: string, 
  type: 'thumbnail' | 'full',
  supabase: any
): Promise<string | null> => {
  try {
    // Get current user ID for secure path structure
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to upload images');
    }

    const fileName = `${eventId}_${type}_${Date.now()}.webp`;
    // Use user ID in path for security (required by new storage policies)
    const filePath = `${user.id}/events/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(filePath, file, {
        contentType: 'image/webp',
        upsert: true
      });
      
    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
    
    const { data: urlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
};