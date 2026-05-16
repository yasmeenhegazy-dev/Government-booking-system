# إيقاف كل عمليات الديمو (الـ backend والـ tunnel).

Write-Host "إيقاف Backend و Cloudflared..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1
Write-Host "تم. النوافذ ممكن تقفليها يدوي." -ForegroundColor Green
