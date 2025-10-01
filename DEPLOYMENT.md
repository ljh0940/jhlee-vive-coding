# 프론트엔드 배포 가이드

이 문서는 `jhlee-vive-coding` 프론트엔드를 Vercel에 배포하는 방법을 설명합니다.

## Vercel 배포

### 1. Vercel 계정 생성
1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인

### 2. 프로젝트 임포트
1. Dashboard에서 "Add New" → "Project" 클릭
2. GitHub 저장소 `jhlee-vive-coding` 선택
3. Import 클릭

### 3. 프로젝트 설정
- **Framework Preset**: Vite (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 4. 환경 변수 설정
배포 전 환경 변수 추가:

```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

> 💡 백엔드를 먼저 배포한 후 Railway URL로 교체하세요.

### 5. 배포
"Deploy" 버튼을 클릭하여 배포를 시작합니다.

배포 완료 후 다음과 같은 URL이 생성됩니다:
- Production: `https://jhlee-vive-coding.vercel.app`
- Preview: PR마다 자동 생성

### 6. 백엔드 설정 업데이트
배포 후 프론트엔드 URL을 백엔드에 설정:

1. **Railway 환경 변수 추가**:
   ```
   OAUTH2_REDIRECT_URI=https://jhlee-vive-coding.vercel.app/oauth2/redirect
   ```

2. **SecurityConfig.java CORS 설정**:
   ```java
   configuration.setAllowedOrigins(List.of(
       "https://jhlee-vive-coding.vercel.app"
   ));
   ```

### 7. OAuth2 Redirect URI 설정

#### Google Cloud Console
- Authorized JavaScript origins: `https://jhlee-vive-coding.vercel.app`
- Authorized redirect URIs: `https://your-backend-url.railway.app/login/oauth2/code/google`

#### GitHub OAuth App
- Homepage URL: `https://jhlee-vive-coding.vercel.app`
- Authorization callback URL: `https://your-backend-url.railway.app/login/oauth2/code/github`

## 자동 배포

- `main` 브랜치에 push → 자동으로 Production 배포
- Pull Request 생성 → 자동으로 Preview 배포

## 커스텀 도메인 (선택사항)

1. Vercel Dashboard → Settings → Domains
2. 도메인 추가 (예: `lotto.yourdomain.com`)
3. DNS 설정 업데이트 (Vercel이 제공하는 레코드 추가)

## 로컬 테스트

배포 전 로컬에서 프로덕션 빌드 테스트:

```bash
# 빌드
pnpm build

# 프리뷰
pnpm preview
```

## 트러블슈팅

### 빌드 실패
- Vercel 로그에서 에러 확인
- 로컬에서 `pnpm build` 테스트
- `package.json`의 dependencies 확인

### 환경 변수 미적용
- Vercel Dashboard → Settings → Environment Variables 확인
- 변수명이 `VITE_` 접두사로 시작하는지 확인
- 재배포 필요 (환경 변수 변경 후)

### API 호출 실패
- 백엔드 URL이 올바른지 확인
- CORS 설정 확인
- 브라우저 개발자 도구 Network 탭 확인

---

자세한 내용은 [전체 배포 가이드](../jhlee-vive-coding-be/DEPLOYMENT.md)를 참고하세요.
