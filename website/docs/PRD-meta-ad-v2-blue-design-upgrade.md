# PRD: Meta 광고 V2 Blue 디자인 UX 업그레이드

## 1. 개요

### 1.1 현재 문제점
- **가벼운 인상**: 플랫한 디자인으로 프리미엄 느낌 부족
- **배경 단조로움**: 단순 그라디언트 + 직선 그리드만 사용
- **깊이감 부족**: 요소들이 떠 있는 느낌 없음
- **시각적 계층 약함**: 모든 요소가 비슷한 무게감

### 1.2 목표
- **프리미엄 & 신뢰감**: B2B 광고 솔루션에 맞는 고급스러운 비주얼
- **시각적 깊이감**: 레이어링과 글로우 효과로 입체감 부여
- **세련된 배경**: 움직이는 패턴, 그라디언트 메시로 생동감 추가
- **강조점 명확화**: 핵심 메시지가 눈에 확 들어오게

---

## 2. 디자인 업그레이드 상세

### 2.1 배경 레이어 시스템

```
┌──────────────────────────────────────┐
│  Layer 4: 전경 글로우 (Subtle)        │
├──────────────────────────────────────┤
│  Layer 3: 콘텐츠 영역                 │
├──────────────────────────────────────┤
│  Layer 2: 동적 메시 그라디언트         │
├──────────────────────────────────────┤
│  Layer 1: 베이스 그라디언트            │
└──────────────────────────────────────┘
```

#### Layer 1: 베이스 그라디언트 (개선)
- **현재**: 단순 3단계 linear-gradient
- **개선**:
  - Radial gradient 오버레이 추가
  - 코너에 subtle한 컬러 블러 추가
  - 하단에 진한 블루 앵커 추가

```css
background:
  radial-gradient(ellipse at 20% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 100%, rgba(30, 64, 175, 0.2) 0%, transparent 50%),
  linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #eff6ff 70%, #dbeafe 100%);
```

#### Layer 2: 동적 메시 그라디언트
- **추가**: Animated mesh gradient blob
- **효과**: 부드럽게 움직이는 블러 원형들
- **색상**: 블루 계열 (opacity 0.1~0.2)

```css
.mesh-gradient {
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  filter: blur(100px);
  animation: float 20s ease-in-out infinite;
}
```

#### Layer 3: 기하학 패턴 (그리드 대체)
- **현재**: 단순 직선 그리드
- **개선**:
  - 헥사곤 도트 패턴
  - 또는 사선 라인 패턴
  - 투명도: 0.02~0.05 (매우 subtle)

```css
/* 헥사곤 도트 패턴 */
.hex-pattern {
  background-image: radial-gradient(circle, rgba(30, 64, 175, 0.04) 2px, transparent 2px);
  background-size: 60px 52px;
  background-position: 0 0, 30px 26px;
}

/* 사선 라인 패턴 */
.diagonal-lines {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 40px,
    rgba(30, 64, 175, 0.02) 40px,
    rgba(30, 64, 175, 0.02) 41px
  );
}
```

### 2.2 카드 & 요소 업그레이드

#### 글래스모피즘 카드
- **현재**: 단순 white 배경 + 그림자
- **개선**: 반투명 + 백드롭 블러 + 광택 효과

```css
.premium-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 20px 60px rgba(30, 64, 175, 0.12),
    0 8px 20px rgba(0, 0, 0, 0.04),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);
}
```

#### 그라디언트 보더
- **추가**: 핵심 카드에 그라디언트 테두리 효과

```css
.gradient-border {
  position: relative;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #60a5fa 100%);
  border-radius: inherit;
  z-index: -1;
}
```

### 2.3 글로우 & 하이라이트 효과

#### 강조 글로우
- **대상**: 중요 숫자, CTA 버튼, 강조 배지
- **효과**: 부드러운 외곽 발광

```css
.glow-primary {
  box-shadow:
    0 0 30px rgba(59, 130, 246, 0.3),
    0 0 60px rgba(59, 130, 246, 0.1);
}

.glow-success {
  box-shadow:
    0 0 20px rgba(16, 185, 129, 0.4),
    0 0 40px rgba(16, 185, 129, 0.15);
}
```

#### 텍스트 그라디언트
- **대상**: 주요 타이틀
- **효과**: 그라디언트 텍스트로 고급감

```css
.gradient-text {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 2.4 추가 시각 요소

#### 장식 오브젝트
- **플로팅 원형**: 배경에 은은한 원형 장식 (opacity 0.05~0.1)
- **코너 악센트**: 모서리에 그라디언트 라인

```css
.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  opacity: 0.08;
  filter: blur(2px);
}

.corner-accent {
  position: absolute;
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
}
```

#### 아이콘 컨테이너 개선
- **현재**: 단순 컬러 배경
- **개선**: 그라디언트 배경 + 내부 그림자 + 글로우

```css
.icon-container-premium {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.8),
    0 4px 12px rgba(30, 64, 175, 0.1);
}
```

---

## 3. 시퀀스별 개선 사항

### 3.1 시퀀스 1 (후킹)
- 배경에 붉은 계열 subtle 글로우 추가
- "?" 물음표에 펄스 글로우 효과 강화
- 경고 아이콘에 진동 효과 + 그림자

### 3.2 시퀀스 2 (문제 원인)
- X 아이콘 주변 붉은 글로우
- "시스템입니다" 박스에 블루 글로우 + 광택

### 3.3 시퀀스 3~4 (비교)
- 비교 카드에 글래스모피즘 적용
- 화살표에 그라디언트 + 애니메이션
- 결과 숫자에 강조 글로우

### 3.4 시퀀스 5 (자동화)
- 플로우 노드에 연결선 애니메이션 (dash 흐름)
- 노드 간 파티클 효과 고려
- 자동화 배지에 펄스 글로우

### 3.5 시퀀스 6 (리포트)
- 리포트 카드에 프리미엄 그림자
- KPI 카드에 subtle 그라디언트 배경
- AI 인사이트에 보라색 글로우

### 3.6 시퀀스 7 (서비스)
- 체크 아이콘에 녹색 글로우
- 서비스 카드에 호버 스타일 적용
- 등장 애니메이션에 스케일 + 글로우 조합

### 3.7 시퀀스 8 (CTA)
- 전체 배경에 집중 효과 (비네팅)
- CTA 버튼에 강한 글로우 + 펄스
- URL에 underline 애니메이션

---

## 4. 색상 팔레트 확장

### 4.1 프라이머리 확장
```css
--primary-glow: rgba(59, 130, 246, 0.3);
--primary-subtle: rgba(30, 64, 175, 0.05);
--primary-gradient: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
```

### 4.2 액센트 추가
```css
--accent-purple: #8b5cf6;
--accent-purple-glow: rgba(139, 92, 246, 0.3);
--success-glow: rgba(16, 185, 129, 0.3);
--error-glow: rgba(239, 68, 68, 0.3);
```

---

## 5. 애니메이션 개선

### 5.1 새 키프레임

```css
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 20px var(--primary-glow), 0 0 40px transparent;
  }
  50% {
    box-shadow: 0 0 40px var(--primary-glow), 0 0 80px var(--primary-glow);
  }
}

@keyframes meshFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### 5.2 Dash 흐름 애니메이션 (시퀀스 5)

```css
@keyframes dashFlow {
  to {
    stroke-dashoffset: -20;
  }
}

.flow-line-animated {
  stroke-dasharray: 10, 10;
  animation: dashFlow 1s linear infinite;
}
```

---

## 6. 구현 체크리스트

- [ ] 배경 레이어 시스템 구현
  - [ ] 베이스 그라디언트 개선
  - [ ] 동적 메시 블롭 추가
  - [ ] 기하학 패턴 교체
- [ ] 카드 스타일 업그레이드
  - [ ] 글래스모피즘 적용
  - [ ] 그라디언트 보더 추가
- [ ] 글로우 효과 적용
  - [ ] 강조 요소에 글로우
  - [ ] 텍스트 그라디언트
- [ ] 애니메이션 개선
  - [ ] glowPulse 적용
  - [ ] 메시 플로팅
  - [ ] dash 흐름
- [ ] 시퀀스별 세부 조정
- [ ] 브라우저 테스트

---

## 7. 예상 결과

### Before (현재)
- 플랫한 느낌
- 단순한 배경
- 무게감 없음

### After (개선)
- 프리미엄 & 고급스러운 느낌
- 생동감 있는 배경
- 요소별 깊이감과 존재감
- B2B 솔루션에 걸맞는 신뢰감

---

**문서 버전**: 1.0
**작성일**: 2025-12-22
**관련 파일**: `docs/meta-ad-v2-blue.html`
