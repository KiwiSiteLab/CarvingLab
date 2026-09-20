@echo off
cd /d "%~dp0website"
echo Kexiang Sculpture Art - local network demo
echo Open http://localhost:3000 on this PC.
call npm.cmd run dev
pause
