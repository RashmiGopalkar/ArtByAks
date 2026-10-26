Add-Type -AssemblyName System.Drawing

function Create-AppIcon([int]$size, [string]$path) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background: Deep warm stone #1c1917
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 28, 25, 23))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)

    # Inner Gold Circle Border #c28e5b
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 194, 142, 91), [Math]::Max(2, $size / 40))
    $margin = $size * 0.08
    $g.DrawEllipse($borderPen, $margin, $margin, $size - ($margin * 2), $size - ($margin * 2))

    # Inner Terracotta Accent Circle
    $innerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 41, 37, 36))
    $innerMargin = $size * 0.11
    $g.FillEllipse($innerBrush, $innerMargin, $innerMargin, $size - ($innerMargin * 2), $size - ($innerMargin * 2))

    # Draw "AKS" Monogram Text
    $fontSize = $size * 0.28
    $font = New-Object System.Drawing.Font("Georgia", $fontSize, [System.Drawing.FontStyle]::Bold)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 240, 235))
    
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $textRect = New-Object System.Drawing.RectangleF(0, ($size * 0.25), $size, ($size * 0.35))
    $g.DrawString("AKS", $font, $goldBrush, $textRect, $sf)

    # Subtitle: "ART STUDIO"
    $subFontSize = [Math]::Max(7, ($size * 0.065))
    $subFont = New-Object System.Drawing.Font("Arial", $subFontSize, [System.Drawing.FontStyle]::Regular)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 194, 142, 91))
    $subRect = New-Object System.Drawing.RectangleF(0, ($size * 0.58), $size, ($size * 0.18))
    $g.DrawString("ART STUDIO", $subFont, $subBrush, $subRect, $sf)

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

Create-AppIcon 512 "public\icon-512.png"
Create-AppIcon 192 "public\icon-192.png"
Write-Output "Generated icon-512.png and icon-192.png successfully"
