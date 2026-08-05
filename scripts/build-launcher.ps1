<#
.SYNOPSIS
  Ricostruisce l'eseguibile Windows del gioco (launcher/CarrieraLauncher) da zero:
  export statico Next.js -> embedded resource nel progetto .NET -> publish single-file -> dist/Carriera.exe.

.DESCRIPTION
  Da rilanciare ogni volta che il gioco cambia e si vuole aggiornare l'exe committato nel repo
  (vedi backlog.md, item "Packaging come eseguibile .exe scaricabile dal repo").
#>

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$launcherProject = Join-Path $repoRoot "launcher/CarrieraLauncher"
$wwwroot = Join-Path $launcherProject "wwwroot"
$publishDir = Join-Path $launcherProject "publish"
$distDir = Join-Path $repoRoot "dist"

Write-Host "==> npm run build (export statico Next.js)" -ForegroundColor Cyan
Push-Location $repoRoot
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build fallito (exit $LASTEXITCODE)" }
} finally {
    Pop-Location
}

Write-Host "==> Copio out/ in launcher/CarrieraLauncher/wwwroot/" -ForegroundColor Cyan
if (Test-Path $wwwroot) { Remove-Item $wwwroot -Recurse -Force }
Copy-Item (Join-Path $repoRoot "out") $wwwroot -Recurse

Write-Host "==> dotnet publish (self-contained, single-file, win-x64)" -ForegroundColor Cyan
if (Test-Path $publishDir) { Remove-Item $publishDir -Recurse -Force }
dotnet publish $launcherProject `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -p:PublishSingleFile=true `
    -p:IncludeNativeLibrariesForSelfExtract=true `
    -p:EnableCompressionInSingleFile=true `
    -o $publishDir
if ($LASTEXITCODE -ne 0) { throw "dotnet publish fallito (exit $LASTEXITCODE)" }

Write-Host "==> Copio l'eseguibile in dist/Carriera.exe" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $distDir | Out-Null
Copy-Item (Join-Path $publishDir "Carriera.exe") (Join-Path $distDir "Carriera.exe") -Force

$exe = Get-Item (Join-Path $distDir "Carriera.exe")
Write-Host "==> Fatto: $($exe.FullName) ($([math]::Round($exe.Length / 1MB, 1)) MB)" -ForegroundColor Green
