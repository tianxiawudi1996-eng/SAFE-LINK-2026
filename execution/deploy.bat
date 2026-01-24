@echo off
echo ========================================================
echo SAFE-LINK 배포를 시작합니다! (월요일 화이팅!)
echo ========================================================
cd /d "%~dp0"

echo.
echo [1/3] 최신 상태 확인 중...
cmd /c "npm run build"

echo.
echo [2/3] Vercel로 배포 중... (로그인이 필요할 수 있습니다)
echo 엔터를 누르면 배포가 시작됩니다!
pause
cmd /c "npx vercel --prod"

echo.
echo [3/3] 완료되었습니다! 위 주소를 확인하세요.
pause
