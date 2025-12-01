# PolaAd 디자인 가이드

이 문서는 폴라애드 웹사이트의 디자인 일관성을 유지하기 위한 필수 가이드입니다.
**모든 컴포넌트 작성 시 이 가이드를 반드시 준수해야 합니다.**

---

## 1. 레이아웃 시스템

### 1.1 Container
모든 섹션은 `container` 클래스를 사용합니다.
```
max-width: 1280px
padding: 0 1rem (mobile) / 0 2rem (tablet) / 0 3rem (desktop)
```

**규칙**: 섹션 내부에 추가적인 `max-w-*` 제한을 두지 않습니다.

### 1.2 히어로 섹션 규격
모든 페이지의 히어로 섹션은 동일한 규격을 사용합니다:
```tsx
className="relative min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-7rem)] pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-950 text-white perspective-1000 -mt-24 md:-mt-28"
```

**핵심 규칙**:
- `min-h-[calc(100vh-6rem)]`: 뷰포트 높이에서 헤더 높이를 뺀 최소 높이
- `pt-32 lg:pt-48`: 고정된 상단 패딩으로 배지 시작 높이 통일
- 콘텐츠 양과 관계없이 모든 히어로 높이 동일, 배지는 같은 위치에서 시작

### 1.3 히어로 레이아웃 (2컬럼)
```tsx
<div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
    {/* 좌측: 텍스트 콘텐츠 */}
    <div className="flex-1 text-center lg:text-left">
        {/* 배지, 제목, 설명, CTA */}
    </div>

    {/* 우측: 비주얼 요소 */}
    <div className="flex-1 w-full max-w-[500px] lg:max-w-none">
        {/* 카드, 이미지 등 */}
    </div>
</div>
```

### 1.4 일반 섹션 패딩
```tsx
className="py-20 lg:py-28"
```

---

## 2. 색상 시스템

### 2.1 배경색 교차 패턴
섹션 간 구분을 위해 배경색을 교차 사용합니다:
- **다크 배경 1**: `bg-gray-950` (히어로, 주요 섹션)
- **다크 배경 2**: `bg-gray-900` (대비 섹션)
- **그라디언트**: `bg-gradient-to-b from-gray-900 to-gray-950`

### 2.2 카테고리 색상
| 카테고리 | 색상 | 클래스 |
|---------|------|--------|
| 인쇄물 | Amber | `amber-400`, `amber-500/10`, `amber-500/30` |
| 홈페이지 | Blue | `blue-400`, `blue-500/10`, `blue-500/30` |
| 광고 | Emerald | `emerald-400`, `emerald-500/10`, `emerald-500/30` |

### 2.3 강조 색상
- **Primary**: `primary-400`, `primary-500` (CTA, 링크)
- **Accent**: `accent-400` (배지, 하이라이트)
- **Error/Warning**: `red-400`, `red-500` (경고 문구)

---

## 3. 타이포그래피

### 3.1 제목 크기
| 용도 | 클래스 |
|-----|--------|
| 히어로 H1 | `text-4xl lg:text-6xl font-bold` |
| 섹션 H2 | `text-2xl sm:text-3xl lg:text-4xl font-bold` |
| 카드 H3 | `text-lg sm:text-xl font-bold` |

### 3.2 본문 텍스트
| 용도 | 클래스 |
|-----|--------|
| 히어로 설명 | `text-lg lg:text-xl text-gray-300` |
| 섹션 설명 | `text-gray-400 text-lg` |
| 일반 본문 | `text-gray-300` / `text-gray-400` |
| 보조 텍스트 | `text-sm text-gray-500` |

### 3.3 한글 처리
- 줄바꿈 방지: `break-keep`
- 균형 맞춤: `text-balance`

---

## 4. 컴포넌트 패턴

### 4.1 배지
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-400 text-sm font-semibold backdrop-blur-sm">
    <Icon className="w-4 h-4" />
    <span>텍스트</span>
</div>
```

### 4.2 카드 (다크 테마)
```tsx
<div className="bg-gray-900/90 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
    {/* 헤더 (선택) */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-800/50">
        {/* macOS 스타일 dots */}
        <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
    </div>
    {/* 콘텐츠 */}
    <div className="p-6 lg:p-8">
        {/* ... */}
    </div>
</div>
```

### 4.3 카테고리 카드
```tsx
const colorClasses = {
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
}

<div className={`rounded-2xl border p-6 backdrop-blur-sm ${colorClasses[color]}`}>
```

### 4.4 CTA 버튼
```tsx
{/* Primary */}
<Button
    variant="primary"
    size="xl"
    className="shadow-xl shadow-primary-900/20 border border-primary-500/50"
>
    텍스트
    <ArrowRight className="w-5 h-5 ml-2" />
</Button>

{/* Outline (다크 배경용) */}
<Button
    variant="outline"
    size="xl"
    className="border-white/20 text-white hover:bg-white/10"
>
    텍스트
</Button>
```

---

## 5. 애니메이션

### 5.1 Framer Motion 기본 패턴
```tsx
// 페이드 인 + 슬라이드 업
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}  // 또는 whileInView
    transition={{ duration: 0.5, delay: 0.1 }}
>
```

### 5.2 지연 시간 규칙
- 순차 요소: `delay: index * 0.1`
- 히어로 요소: 0, 0.1, 0.2, 0.3, 0.4...
- 우측 비주얼: `delay: 0.4` (좌측 텍스트 후)

### 5.3 스포트라이트 글로우 효과
마우스 추적 글로우가 필요할 때:
```tsx
import { useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

const mouseX = useMotionValue(0)
const mouseY = useMotionValue(0)
const spotlightX = useSpring(mouseX, { stiffness: 300, damping: 30 })
const spotlightY = useSpring(mouseY, { stiffness: 300, damping: 30 })

const spotlightBg = useMotionTemplate`radial-gradient(600px circle at ${spotlightX}px ${spotlightY}px, rgba(255,255,255,0.12), transparent 55%)`
```

---

## 6. 배경 효과

### 6.1 히어로 배경
```tsx
<div className="absolute inset-0 z-0 pointer-events-none">
    {/* 그리드 패턴 */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>

    {/* 상하 페이드 */}
    <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-gray-950 via-transparent to-gray-950"></div>

    {/* 블러 오브 */}
    <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] bg-primary-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
    <div className="absolute left-0 bottom-0 -z-10 h-[500px] w-[500px] bg-accent-900/10 blur-[100px] rounded-full mix-blend-screen"></div>
</div>
```

### 6.2 글로우 라인
```tsx
{/* 상단 */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

{/* 하단 */}
<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
```

---

## 7. 반응형 규칙

### 7.1 Breakpoints
- Mobile: 기본 (< 640px)
- sm: 640px+
- md: 768px+
- lg: 1024px+

### 7.2 그리드 패턴
```tsx
// 1 → 2 → 3 컬럼
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// 1 → 3 컬럼
className="grid grid-cols-1 sm:grid-cols-3 gap-4"
```

### 7.3 텍스트 정렬
```tsx
// 모바일 중앙, 데스크톱 좌측
className="text-center lg:text-left"

// 버튼 정렬
className="justify-center lg:justify-start"
```

---

## 8. 접근성

### 8.1 필수 속성
- 버튼/링크: `aria-label` (아이콘만 있는 경우)
- 아코디언: `aria-expanded`, `aria-controls`
- 이미지: `alt` 텍스트

### 8.2 포커스 스타일
기본 Tailwind focus-visible 스타일 유지

---

## 체크리스트

새 섹션/컴포넌트 작성 시:
- [ ] container 클래스 사용
- [ ] 섹션 패딩 `py-20 lg:py-28`
- [ ] 배경색 교차 확인 (gray-950 ↔ gray-900)
- [ ] 제목 크기 가이드 준수
- [ ] 카테고리 색상 통일 (amber/blue/emerald)
- [ ] 애니메이션 delay 패턴 준수
- [ ] 반응형 텍스트 정렬 적용
- [ ] break-keep 적용 (한글)
