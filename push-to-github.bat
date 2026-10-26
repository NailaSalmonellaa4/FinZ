@echo off
title FinZ - Push ke GitHub
echo ========================================================
echo   FinZ - Mengunggah Kode ke GitHub
echo   Repository: https://github.com/NailaSalmonellaa4/FinZ
echo ========================================================
echo.

set "PATH=D:\Program Files\Git\cmd;D:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo Menjalankan git push ke origin main...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   BERHASIL! Kode FinZ telah sukses di-push ke GitHub.
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   Gagal melakukan push. Pastikan Anda telah login ke GitHub.
    echo ========================================================
)

echo.
pause
