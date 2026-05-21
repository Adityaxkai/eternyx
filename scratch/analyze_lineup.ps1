Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap("y:/Eternyx/public/images/wide-lineup-backup.png")
$width = $bmp.Width
$height = $bmp.Height

Write-Host "Analyzing top 40 rows..."
for ($y = 0; $y -lt 40; $y++) {
    $maxR = 0; $maxG = 0; $maxB = 0
    for ($x = 0; $x -lt $width; $x += 10) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.R -gt $maxR) { $maxR = $pixel.R }
        if ($pixel.G -gt $maxG) { $maxG = $pixel.G }
        if ($pixel.B -gt $maxB) { $maxB = $pixel.B }
    }
    Write-Host "Row $y : Max R=$maxR, G=$maxG, B=$maxB"
}

Write-Host "Analyzing bottom 40 rows..."
for ($y = $height - 40; $y -lt $height; $y++) {
    $maxR = 0; $maxG = 0; $maxB = 0
    for ($x = 0; $x -lt $width; $x += 10) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.R -gt $maxR) { $maxR = $pixel.R }
        if ($pixel.G -gt $maxG) { $maxG = $pixel.G }
        if ($pixel.B -gt $maxB) { $maxB = $pixel.B }
    }
    Write-Host "Row $y : Max R=$maxR, G=$maxG, B=$maxB"
}

$bmp.Dispose()
