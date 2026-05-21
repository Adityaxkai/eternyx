import os
from PIL import Image

image_dir = r"y:\Eternyx\public\images"
images = ["wide-lineup.png", "wide-close.png", "wide-abstract.png"]

for img_name in images:
    path = os.path.join(image_dir, img_name)
    if os.path.exists(path):
        with Image.open(path) as img:
            print(f"{img_name}: size={img.size}, mode={img.mode}, format={img.format}")
    else:
        print(f"{img_name}: NOT FOUND at {path}")
