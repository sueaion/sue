# Sue Project 🌿

이 프로젝트는 AI 코딩 및 ClaudeGPT 기반 실험을 위한 개인 테스트 저장소입니다.

## 💻 환경
- VS Code + Claude Codex
- Git / GitHub 연동 완료
- HTML, Markdown, JavaScript 실습 포함

## 🚀 업데이트 방법
```
git add .
git commit -m "update 내용"
git push
```

## 🧠 목적
- Git, GitHub 실습 및 자동화 익히기
- AI 기반 코딩 워크플로우 테스트

## ✅ TODO 웹앱 (Google 시트 백엔드)
- 프론트엔드: `index.html`, `styles.css`, `app.js`
- 백엔드: Google Apps Script (Google 시트 연동) — `apps-script/Code.gs` 참고
- 배포: GitHub Pages (이 저장소의 `main` 브랜치 루트)

### 1) Google 시트 준비
- 새 Google 시트를 만들고 이름은 자유롭게 설정합니다. (예: `Sue Tasks`)
- 시트 안에서 `확장 프로그램 > Apps Script`를 엽니다. 이 스크립트 프로젝트는 시트에 바인딩됩니다.

### 2) Apps Script 코드 붙여넣기
- 이 저장소의 `apps-script/Code.gs` 내용을 Apps Script 에디터에 그대로 붙여넣습니다.
- 필요 시 `SHEET_NAME`를 원하는 시트 탭 이름으로 수정합니다. 기본값은 `Tasks`이며, 스크립트가 자동으로 탭을 생성/헤더를 구성합니다.

지원 액션
- `GET  ?action=list` — 전체 목록 조회
- `POST action=add&text=...` — 할 일 추가
- `POST action=toggle&id=...&done=true|false` — 완료 여부 토글
- `POST action=delete&id=...` — 항목 삭제

요청 형식
- CORS 사전 요청을 피하기 위해 `Content-Type: application/x-www-form-urlencoded`로 전송합니다.

### 3) 웹 앱으로 배포
1. Apps Script 상단 `배포 > 배포 관리 > 새 배포`
2. 유형: `웹 앱`
3. 설명 임의 입력
4. `실행할 앱`은 기본, `배포 시 실행 권한`: 본인
5. `액세스 권한`: 누구나 (로그인 필요 없음)
6. `배포` 후 표시되는 `웹 앱 URL`을 복사

보안 메모
- 이 데모는 인증 없이 누구나 호출 가능한 공개 엔드포인트입니다. 개인 데이터에는 사용하지 마세요.

### 4) 프론트엔드 연결
- `app.js:1`에서 `API_URL`을 복사한 웹 앱 URL로 바꿉니다.
- 로컬에서 미리보기: GitHub Pages를 켜지 않아도 `index.html`을 직접 열면 동작합니다.

### 5) GitHub Pages 배포
- GitHub 저장소에서 `Settings > Pages`
- `Deploy from a branch`
- Branch: `main`, Folder: `/ (root)` 선택 후 저장
- 잠시 후 `https://<username>.github.io/<repo>/` 에서 접속 가능

### 6) 사용법
- 입력창에 할 일을 적고 `Enter` 또는 `추가` 클릭
- 체크박스로 완료/미완료 전환, `삭제` 버튼으로 삭제

문제 해결
- 응답이 없으면 Apps Script `배포` 상태와 URL, 시트 권한(소유자 본인), `API_URL`을 재확인하세요.
- 브라우저 콘솔 에러가 있으면 공유해 주세요.
