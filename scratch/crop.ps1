Add-Type -AssemblyName System.Drawing

function Crop-BlackBorders ($imagePath, $outputPath, $threshold) {
    Write-Host "Processing $imagePath with threshold $threshold..."
    $bmp = New-Object System.Drawing.Bitmap($imagePath)
    $width = $bmp.Width
    $height = $bmp.Height
    
    # Find top boundary
    $top = 0
    for ($y = 0; $y -lt $height; $y++) {
        $isRowBlack = $true
        for ($x = 0; $x -lt $width; $x += 4) {
            $pixel = $bmp.GetPixel($x, $y)
            if ($pixel.R -gt $threshold -or $pixel.G -gt $threshold -or $pixel.B -gt $threshold) {
                $isRowBlack = $false
                break
            }
        }
        if (-not $isRowBlack) {
            $top = $y
            break
        }
    }
    
    # Find bottom boundary
    $bottom = $height - 1
    for ($y = $height - 1; $y -ge 0; $y--) {
        $isRowBlack = $true
        for ($x = 0; $x -lt $width; $x += 4) {
            $pixel = $bmp.GetPixel($x, $y)
            if ($pixel.R -gt $threshold -or $pixel.G -gt $threshold -or $pixel.B -gt $threshold) {
                $isRowBlack = $false
                break
            }
        }
        if (-not $isRowBlack) {
            $bottom = $y
            break
        }
    }
    
    Write-Host "  Original: ${width}x${height}, Non-black bounds: top=$top, bottom=$bottom"
    
    # Prevent aggressive cropping, leave a small margin of 2px
    $top = [Math]::Max(0, $top - 2)
    $bottom = [Math]::Min($height - 1, $bottom + 2)
    
    if ($top -lt $bottom -and ($top -gt 0 -or $bottom -lt ($height - 1))) {
        $cropHeight = $bottom - $top + 1
        $croppedBmp = New-Object System.Drawing.Bitmap($width, $cropHeight)
        $g = [System.Drawing.Graphics]::FromImage($croppedBmp)
        
        $srcRect = New-Object System.Drawing.Rectangle(0, $top, $width, $cropHeight)
        $destRect = New-Object System.Drawing.Rectangle(0, 0, $width, $cropHeight)
        
        $g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        
        # Dispose the original bitmap so we can overwrite the file
        $bmp.Dispose()
        
        # Delete original if overwriting
        if ($outputPath -eq $imagePath -or (Test-Path $outputPath)) {
            Remove-Item $outputPath -Force -ErrorAction SilentlyContinue
        }
        
        # Save as PNG
        $croppedBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $croppedBmp.Dispose()
        Write-Host "  Successfully cropped and saved to $outputPath"
    } else {
        $bmp.Dispose()
        Write-Host "  No black borders to crop or already cropped."
    }
}

$publicDir = "y:/Eternyx/public/images"

# Crop wide-lineup using the backup as the source to ensure we have the full image
Crop-BlackBorders "$publicDir/wide-lineup-backup.png" "$publicDir/wide-lineup.png" 42
