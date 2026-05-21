import os
import shutil
from PIL import Image

def backup_and_crop():
    public_dir = "y:/Eternyx/public/images"
    
    # 1. Back up the images first if not already done
    files_to_process = ["wide-lineup.png", "wide-close.png", "wide-abstract.png"]
    for filename in files_to_process:
        src = os.path.join(public_dir, filename)
        backup = os.path.join(public_dir, filename.replace(".png", "-backup.png"))
        if os.path.exists(src) and not os.path.exists(backup):
            shutil.copy2(src, backup)
            print(f"Created backup of {filename} at {backup}")
            
    # 2. Function to crop top and bottom black borders
    def crop_black_borders(img_path, output_path):
        if not os.path.exists(img_path):
            print(f"File not found: {img_path}")
            return
            
        img = Image.open(img_path)
        rgb_img = img.convert('RGB')
        width, height = rgb_img.size
        
        # JPEG compression can introduce noise, so we use a low threshold for black
        threshold = 18
        
        # Find top boundary
        top = 0
        for y in range(height):
            is_row_black = True
            for x in range(0, width, 4): # sample every 4th pixel for speed
                r, g, b = rgb_img.getpixel((x, y))
                if r > threshold or g > threshold or b > threshold:
                    is_row_black = False
                    break
            if not is_row_black:
                top = y
                break
                
        # Find bottom boundary
        bottom = height - 1
        for y in range(height - 1, -1, -1):
            is_row_black = True
            for x in range(0, width, 4):
                r, g, b = rgb_img.getpixel((x, y))
                if r > threshold or g > threshold or b > threshold:
                    is_row_black = False
                    break
            if not is_row_black:
                bottom = y
                break
                
        print(f"Image: {os.path.basename(img_path)}")
        print(f"  Dimensions: {width}x{height}")
        print(f"  Detected non-black boundaries: top={top}, bottom={bottom}")
        
        # Add a small padding of 2 pixels if within bounds to prevent aggressive cropping
        top = max(0, top - 2)
        bottom = min(height - 1, bottom + 2)
        
        if top < bottom and (top > 0 or bottom < height - 1):
            cropped_img = img.crop((0, top, width, bottom + 1))
            cropped_img.save(output_path)
            print(f"  Successfully cropped and saved to {output_path}")
        else:
            print("  No black borders detected to crop.")

    # 3. Process wide-lineup and wide-close
    crop_black_borders(os.path.join(public_dir, "wide-lineup.png"), os.path.join(public_dir, "wide-lineup.png"))
    crop_black_borders(os.path.join(public_dir, "wide-close.png"), os.path.join(public_dir, "wide-close.png"))
    crop_black_borders(os.path.join(public_dir, "wide-abstract.png"), os.path.join(public_dir, "wide-abstract.png"))

if __name__ == "__main__":
    backup_and_crop()
