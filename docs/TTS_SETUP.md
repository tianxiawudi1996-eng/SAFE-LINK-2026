# Google Cloud TTS API 설정 가이드

## 원어민급 고품질 TTS 음성 활성화 방법

현재 SAFE-LINK는 Google Cloud Text-to-Speech API를 지원합니다.
API 키를 설정하면 원어민 수준의 고품질 음성 출력이 가능합니다.

### 1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성 또는 선택
3. **API 및 서비스 > 라이브러리** 메뉴로 이동
4. "Cloud Text-to-Speech API" 검색 후 **사용 설정**
5. **사용자 인증 정보 > API 키 만들기**

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```
GOOGLE_TTS_API_KEY=발급받은_API_키
```

### 3. 지원 언어 및 음성

| 언어 | 음성 모델 | 품질 |
|------|----------|------|
| 베트남어 | vi-VN-Neural2-A | ⭐⭐⭐⭐⭐ |
| 우즈베크어 | uz-UZ-Standard-A | ⭐⭐⭐⭐ |
| 캄보디아어 | km-KH-Standard-A | ⭐⭐⭐⭐ |
| 몽골어 | mn-MN-Standard-A | ⭐⭐⭐⭐ |
| 영어 | en-US-Neural2-J | ⭐⭐⭐⭐⭐ |
| 중국어 | cmn-CN-Neural2-A | ⭐⭐⭐⭐⭐ |
| 태국어 | th-TH-Neural2-C | ⭐⭐⭐⭐⭐ |
| 러시아어 | ru-RU-Neural2-A | ⭐⭐⭐⭐⭐ |

### 4. 비용

- 무료 할당량: 월 100만 문자
- Neural2 음성: 100만 문자당 $16
- Standard 음성: 100만 문자당 $4

### 5. 폴백 동작

API 키가 설정되지 않은 경우, 브라우저 기본 TTS(Web Speech API)를 사용합니다.
