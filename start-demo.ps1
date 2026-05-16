# تشغيل المشروع للعرض على اللجنة.
# دبل-كليك على الملف ده، أو شغّليه من PowerShell:
#   .\start-demo.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "===== Government Booking — Demo Launcher =====" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$cloudflaredPath = Join-Path $projectRoot "cloudflared.exe"
$backendPath = Join-Path $projectRoot "backend"
$distPath = Join-Path $projectRoot "frontend\dist\index.html"

# 0. تأكدي إن cloudflared.exe موجود (لو مش موجود نزّليه)
if (-not (Test-Path $cloudflaredPath)) {
    Write-Host "[0/4] تحميل cloudflared.exe..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile $cloudflaredPath -UseBasicParsing
}

# 1. اقفلي أي عمليات شغّالة من تشغيل سابق
Write-Host "[1/4] تنظيف العمليات السابقة..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# 2. تأكدي إن الـ frontend مبني
if (-not (Test-Path $distPath)) {
    Write-Host "[2/4] بناء الـ frontend (دقيقة واحدة)..." -ForegroundColor Yellow
    Push-Location (Join-Path $projectRoot "frontend")
    npm run build
    Pop-Location
} else {
    Write-Host "[2/4] الـ frontend مبني فعلاً ✓" -ForegroundColor Green
}

# 3. شغّلي الـ backend في نافذة منفصلة
Write-Host "[3/4] تشغيل الـ backend على port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "`$env:NODE_ENV='production'; `$env:ALLOWED_ORIGINS='*'; `$env:PORT='5000'; Remove-Item Env:MONGODB_URI -ErrorAction SilentlyContinue; Set-Location '$backendPath'; node server.js"
)
Start-Sleep -Seconds 12

# 4. شغّلي cloudflared في نافذة منفصلة
Write-Host "[4/4] فتح Cloudflare tunnel..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$projectRoot'; .\cloudflared.exe tunnel --url http://localhost:5000"
)

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "كل حاجة بتشتغل دلوقتي. هتلاقي نافذتين فتحوا:" -ForegroundColor Green
Write-Host "  • نافذة Backend (server.js)" -ForegroundColor White
Write-Host "  • نافذة Cloudflared (tunnel)" -ForegroundColor White
Write-Host ""
Write-Host "في نافذة الـ Cloudflared، استني 5-10 ثواني" -ForegroundColor Yellow
Write-Host "هيظهرلك لينك زي:" -ForegroundColor Yellow
Write-Host "  https://something-something-something.trycloudflare.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "ده اللينك اللي تشاركيه مع اللجنة." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "متقفليش النوافذ ولا الكمبيوتر طول وقت العرض!" -ForegroundColor Red
Write-Host ""

Read-Host "اضغطي Enter لإغلاق هذي النافذة (النوافذ التانية هتفضل شغّالة)"
