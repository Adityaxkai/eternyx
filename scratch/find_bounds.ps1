Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap("y:/Eternyx/public/images/wide-lineup-backup.png")
$width = $bmp.Width
$height = $bmp.Height

$firstRow = -1
$lastRow = -1
$threshold = 45

for ($y = 0; $y -lt $height; $y++) {
    $hasContent = $false
    for ($x = 0; $x -lt $width; $x += 4) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.R -gt $threshold -or $pixel.G -gt $threshold -or $pixel.B -gt $threshold) {
            $hasContent = $true
            break
        }
    }
    if ($hasContent) {
        if ($firstRow -eq -1) {
            $firstRow = $y
        }
        $lastRow = $y
    }
}

Write-Host "For threshold $threshold"
Write-Host "  First row with content: $firstRow"
Write-Host "  Last row with content: $lastRow"

$bmp.Dispose()
