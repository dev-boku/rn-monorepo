# NoBrainer 개발 로드맵 상세 (Technical Roadmap)

## 📋 전체 개요
- **총 개발 기간**: 약 10-13주
- **타겟 플랫폼**: iOS, Android (React Native + Expo)
- **MVP 출시 목표**: Phase 1 완료 후 (약 3주)

---

## 🚀 Phase 0: 기초 세팅 (약 1주)

### 목표
프로젝트 기초 인프라 구축 및 개발 환경 세팅

### 상세 작업 항목

#### 0.1 프로젝트 초기화
- [ ] Expo 프로젝트 생성 (`npx create-expo-app`)
- [ ] TypeScript 설정 및 절대 경로 설정
- [ ] ESLint, Prettier 설정
- [ ] Git 저장소 초기화 및 .gitignore 설정

#### 0.2 네비게이션 구조
- [ ] React Navigation 설치 및 설정
- [ ] Bottom Tab Navigator 구현 (홈/덱/학습/통계/설정)
- [ ] Stack Navigator 구현 (카드 생성/편집, 덱 상세)
- [ ] 네비게이션 타입 정의

#### 0.3 UI/테마 시스템
- [ ] 색상 팔레트 정의 (라이트/다크 모드)
- [ ] Typography 시스템 구현
- [ ] 기본 UI 컴포넌트 제작 (Button, Card, Input, Modal)
- [ ] 앱 아이콘 및 스플래시 스크린 설정

#### 0.4 데이터 레이어
- [ ] SQLite 설치 및 설정 (`expo-sqlite`)
- [ ] 데이터베이스 스키마 설계
  - 덱 테이블 (id, name, created_at, updated_at)
  - 카드 테이블 (id, deck_id, front, back, type, next_review, interval, ease_factor)
  - 학습 기록 테이블 (id, card_id, reviewed_at, grade, time_spent)
- [ ] 데이터베이스 마이그레이션 시스템 구현

#### 0.5 상태 관리
- [ ] Zustand 설치 및 스토어 구조 설계
- [ ] 덱 스토어 구현
- [ ] 카드 스토어 구현
- [ ] 학습 세션 스토어 구현

#### 0.6 개발 도구
- [ ] Sentry 또는 Bugsnag 크래시 리포팅 설정
- [ ] React Native Debugger 설정
- [ ] 개발/스테이징/프로덕션 환경 변수 설정

### 완료 기준
- ✅ 앱이 정상적으로 빌드 및 실행
- ✅ 5개 탭 간 전환 가능
- ✅ 더미 데이터로 기본 CRUD 동작 확인
- ✅ 크래시 리포트가 대시보드에 수집됨

---

## 📱 Phase 1: MVP (약 2주)

### 목표
Anki 스타일의 기본 학습 시스템 구현

### 상세 작업 항목

#### 1.1 사용자 온보딩
- [ ] 게스트 모드 시작 플로우
- [ ] 첫 실행 시 튜토리얼 화면 (3-4 스텝)
- [ ] 샘플 덱 자동 생성 (예: "일본어 기초", "영단어")

#### 1.2 덱 관리 기능
- [ ] 덱 목록 화면 구현
  - 덱 카드 뷰 (이름, 카드 수, 오늘 학습할 카드 수)
  - 정렬 기능 (이름순, 생성일순, 학습 우선순위)
- [ ] 덱 생성 모달 구현
- [ ] 덱 편집 화면 (이름 변경, 삭제)
- [ ] 덱 설정 (일일 신규 카드 한도, 일일 복습 카드 한도)

#### 1.3 카드 생성/편집
- [ ] 카드 타입 선택 화면
  - Basic (앞면/뒷면)
  - Basic (reversed) - 양방향
  - Cloze (빈칸 채우기) - Phase 1.5로 이동 가능
- [ ] 카드 입력 폼
  - Rich Text Editor 또는 Markdown 지원
  - 태그 추가 기능
- [ ] 카드 목록 보기 (덱 내 모든 카드)
- [ ] 카드 편집/삭제 기능
- [ ] 카드 검색 기능

#### 1.4 학습 시스템
- [ ] 학습 세션 시작 화면
  - 오늘의 카드 수 표시 (신규 X개, 복습 Y개)
- [ ] 카드 표시 화면
  - 앞면 표시 → 탭하여 뒷면 공개
  - 좌/우 스와이프 제스처 (React Native Reanimated)
- [ ] 평가 버튼 구현
  - Again (Hard): 1일 후
  - Good: 다음 간격 (1→4→7→14일)
  - Easy: 간격 점프 (1→7, 4→14)
- [ ] 학습 세션 종료 화면 (학습 통계 요약)

#### 1.5 SRS 알고리즘
- [ ] 고정 간격 시스템 구현
  - 신규 카드: 1일 → 4일 → 7일 → 14일
  - 틀린 카드: 1일로 리셋
- [ ] 다음 복습일 계산 로직
- [ ] 일일 학습 큐 생성 로직

#### 1.6 로컬 알림
- [ ] expo-notifications 설정
- [ ] 알림 권한 요청 플로우
- [ ] 복습 알림 스케줄링 (매일 오전 9시 기본값)
- [ ] 알림 클릭 시 앱 열기 및 학습 화면 이동

#### 1.7 오프라인 퍼스트
- [ ] 모든 데이터 로컬 SQLite 저장
- [ ] 앱 시작 시 데이터베이스 초기화 체크
- [ ] 백그라운드 데이터 저장 큐 구현

#### 1.8 기본 통계
- [ ] 오늘의 학습 현황 (학습한 카드 수, 정답률)
- [ ] 주간 학습 그래프 (막대 차트)
- [ ] 덱별 진행 상황 (전체 카드 중 마스터한 카드 비율)

### 완료 기준
- ✅ 덱 생성 → 카드 추가 → 학습 → 복습 전체 플로우 동작
- ✅ 알림이 정해진 시간에 발송됨
- ✅ 오프라인 상태에서도 모든 기능 정상 작동
- ✅ 치명적 크래시 없음 (크래시율 < 0.1%)

---

## ⚡ Phase 1.5: Quick Wins (약 1주)

### 목표
사용자 경험을 크게 개선하는 빠른 기능 추가

### 상세 작업 항목

#### 1.5.1 외부 컨텐츠 연동
- [ ] Share Extension 구현 (텍스트 공유 수신)
- [ ] Deep Link 처리 (nobrainer://card/create?text=...)
- [ ] 클립보드 감지 및 자동 붙여넣기 제안

#### 1.5.2 미디어 지원
- [ ] 카드에 이미지 첨부 필드 추가
- [ ] 이미지 표시 기능 (리사이징, 캐싱)
- [ ] 이미지 피커 통합 (카메라/갤러리)

#### 1.5.3 접근성 개선
- [ ] TTS (Text-to-Speech) 기능
  - 카드 내용 읽어주기
  - 언어별 음성 선택
  - 속도 조절 옵션
- [ ] 폰트 크기 조절 옵션
- [ ] 고대비 모드

---

## 🤖 Phase 2: AI 입력 확장 (약 2주)

### 목표
AI를 활용한 스마트 카드 생성 기능

### 상세 작업 항목

#### 2.1 텍스트 → AI 카드
- [ ] AI 프롬프트 엔지니어링
- [ ] 텍스트 분석 및 핵심 개념 추출
- [ ] Q&A 쌍 자동 생성
- [ ] 빈칸 채우기 문제 생성

#### 2.2 OCR 기능
- [ ] 카메라 스캔 UI 구현
- [ ] ML Kit 또는 Cloud Vision API 통합
- [ ] 텍스트 영역 선택 기능
- [ ] 인식된 텍스트 편집 UI

#### 2.3 URL 요약
- [ ] 웹 스크래핑 또는 API 통합
- [ ] 아티클 본문 추출
- [ ] 핵심 내용 요약 및 카드화

#### 2.4 YouTube 통합
- [ ] YouTube API 연동
- [ ] 자막 데이터 추출
- [ ] 타임스탬프 기반 카드 생성
- [ ] 영상 썸네일 포함

#### 2.5 AI 결과 편집
- [ ] 생성된 카드 일괄 편집 UI
- [ ] 신뢰도 점수 표시
- [ ] 카드 일괄 선택/삭제/수정

---

## 🎯 Phase 3: 학습/알림 고도화 (약 2주)

### 목표
과학적인 학습 시스템 및 맞춤형 알림

### 상세 작업 항목

#### 3.1 FSRS 알고리즘
- [ ] FSRS (Free Spaced Repetition Scheduler) 구현
- [ ] 개인별 학습 패턴 분석
- [ ] 난이도 자동 조정
- [ ] 최적 복습 간격 계산

#### 3.2 스마트 알림
- [ ] 요일별 알림 설정
- [ ] 조용한 시간대 설정
- [ ] 타임존 자동 감지
- [ ] 알림 그룹화 (하루 학습량 요약)

#### 3.3 학습 목표
- [ ] 일일/주간/월간 목표 설정
- [ ] 스트릭(연속 학습일) 추적
- [ ] 성취 배지 시스템
- [ ] 학습 리마인더 강도 조절

---

## ☁️ Phase 4: 계정/동기화/백업 (약 2주)

### 목표
크로스 플랫폼 데이터 동기화 및 백업

### 상세 작업 항목

#### 4.1 인증 시스템
- [ ] 이메일 회원가입/로그인
- [ ] 소셜 로그인 (Google, Apple, Kakao)
- [ ] 비밀번호 재설정
- [ ] 프로필 관리

#### 4.2 클라우드 백업
- [ ] 자동 백업 스케줄링
- [ ] 수동 백업/복구
- [ ] 백업 버전 관리
- [ ] 선택적 백업 (특정 덱만)

#### 4.3 실시간 동기화
- [ ] 기기간 실시간 동기화
- [ ] 충돌 해결 (최신 우선)
- [ ] 오프라인 변경사항 큐잉
- [ ] 동기화 상태 표시

---

## 📦 Phase 5: Anki 호환 (약 1-2주)

### 목표
기존 Anki 사용자 마이그레이션 지원

### 상세 작업 항목

#### 5.1 Import
- [ ] .apkg 파일 파싱
- [ ] 필드 매핑 UI
- [ ] 미디어 파일 처리
- [ ] 중복 카드 감지

#### 5.2 Export
- [ ] 기본 텍스트 익스포트 (CSV, TXT)
- [ ] .apkg 생성 (Phase 5.5)
- [ ] 선택적 익스포트
- [ ] 미디어 포함 옵션

---

## 💰 Phase 6: 공유/수익화 (약 2주)

### 목표
커뮤니티 기능 및 수익 모델 구축

### 상세 작업 항목

#### 6.1 덱 공유
- [ ] 공유 링크 생성
- [ ] QR 코드 생성
- [ ] 공유 받은 덱 미리보기
- [ ] 덱 복제 기능

#### 6.2 공개 갤러리
- [ ] 덱 업로드 (승인 대기)
- [ ] 카테고리별 브라우징
- [ ] 인기/최신 정렬
- [ ] 리뷰 및 평점

#### 6.3 수익화
- [ ] 프리미엄 구독 (광고 제거, 무제한 AI)
- [ ] AI 크레딧 시스템
- [ ] 인앱 결제 통합
- [ ] 구독 관리 화면

---

## 🚀 Phase 7: 고급 기능 (순차 전개)

### 후보 기능 목록
- 화이트보드/필기 입력
- 이미지 오클루전 (이미지 일부 가리기)
- 자막 없는 YouTube 영상 STT
- 온디바이스 AI 모델
- 협업 덱 편집
- 게임화 요소 (레벨, 경험치)
- 음성 녹음 카드
- PDF 직접 임포트
- 학습 그룹/스터디 기능

---

## 📊 성공 지표 (KPIs)

### Phase 1 (MVP)
- DAU (일일 활성 사용자): 100명
- 7-day Retention: 40%
- 평균 세션 시간: 5분
- 크래시율: < 0.1%

### Phase 3
- DAU: 1,000명
- 7-day Retention: 60%
- 평균 세션 시간: 10분
- 일일 생성 카드 수: 20개/사용자

### Phase 6
- MAU: 10,000명
- 유료 전환율: 5%
- 평균 수익/사용자: $2
- 공유된 덱 수: 500개/월

---

## 🛠 기술 스택 상세

### Frontend
- **Framework**: React Native 0.72+ with Expo SDK 49+
- **Navigation**: React Navigation v6
- **State**: Zustand + React Query
- **UI Components**:
  - React Native Elements
  - React Native Reanimated 3
  - React Native Gesture Handler
- **Forms**: React Hook Form

### Backend (Phase 4+)
- **API**: Node.js + Express or FastAPI
- **Database**: PostgreSQL + Redis
- **Auth**: Supabase Auth or Auth0
- **Storage**: AWS S3 or Cloudflare R2
- **Sync**: WebSocket (Socket.io)

### AI/ML (Phase 2+)
- **OCR**: Google ML Kit (온디바이스) / Cloud Vision API
- **NLP**: OpenAI API or Claude API
- **YouTube**: YouTube Data API v3

### Analytics & Monitoring
- **Analytics**: Mixpanel or Amplitude
- **Crash Reporting**: Sentry
- **Performance**: Firebase Performance Monitoring

### DevOps
- **CI/CD**: GitHub Actions + EAS Build
- **Distribution**: TestFlight + Google Play Console
- **Code Quality**: ESLint + Prettier + Husky

---

## 🎯 리스크 및 대응 방안

### 기술적 리스크
1. **SQLite 성능 이슈**
   - 대응: Realm으로 마이그레이션 준비

2. **AI API 비용 상승**
   - 대응: 온디바이스 모델 연구, 사용량 제한

3. **동기화 충돌**
   - 대응: CRDT 또는 Operational Transformation 검토

### 비즈니스 리스크
1. **Anki 사용자 유입 실패**
   - 대응: Anki 포럼 마케팅, 임포트 기능 강화

2. **수익화 실패**
   - 대응: 광고 최적화, B2B 모델 검토

3. **경쟁 앱 출시**
   - 대응: 차별화 기능 가속화, 커뮤니티 강화