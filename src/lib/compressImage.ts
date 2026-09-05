/**
 * Client-side image compression utility to resize and compress large images
 * before uploading to prevent HTTP 413 (Payload Too Large) errors and speed up uploads.
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
  maxSizeBytes?: number;
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  // If not an image (e.g. video), skip compression
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // If already a small SVG or GIF, skip to avoid losing animation or vector quality
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  const {
    maxWidth = 2000,
    maxHeight = 2000,
    quality = 0.85,
    mimeType = 'image/webp',
    maxSizeBytes = 2 * 1024 * 1024, // 2MB target max
  } = options;

  // If already under 1MB and not a massive PNG, we can still check or compress
  // Always compress PNGs > 1MB because PNGs are uncompressed bitmaps
  if (file.size < 500 * 1024 && !file.type.includes('png')) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio-preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file); // Fallback to original
        }

        // High quality downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Determine output type (prefer webp, or jpeg if specified)
        const targetMime = mimeType === 'image/webp' || mimeType === 'image/jpeg' 
          ? mimeType 
          : 'image/webp';

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }

            // Only use compressed version if it actually reduced the size
            if (blob.size < file.size) {
              const baseName = file.name.replace(/\.[^/.]+$/, '');
              const ext = targetMime === 'image/webp' ? 'webp' : 'jpg';
              const compressedFile = new File([blob], `${baseName}.${ext}`, {
                type: targetMime,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          targetMime,
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // Fallback on load error
      };
    };

    reader.onerror = () => {
      resolve(file); // Fallback on read error
    };
  });
}
