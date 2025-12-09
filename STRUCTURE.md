# 프로젝트 구조 가이드 (Claude 참고용)

## ⚠️ 중요: Git 저장소 구조

```
GitHub: pola2025/polarad
│
├── polarad/                    ← 🎯 모노레포 (Turborepo + pnpm)
│   ├── apps/
│   │   ├── admin/              ← @polarad/admin (Vercel: polarad-admin)
│   │   └── client/             ← @polarad/client
│   ├── packages/
│   │   ├── lib/                ← @polarad/lib
│   │   ├── database/           ← @polarad/database (Prisma)
│   │   └── ui/                 ← @polarad/ui
│   └── package.json            ← 모노레포 루트 (pnpm workspace)
│
├── website/                    ← 별도 Next.js 사이트
└── public/, docs/, content/    ← 기타 파일
```

## Vercel 배포 설정

| 프로젝트 | Root Directory | 도메인 |
|----------|----------------|--------|
| polarad-admin | `polarad/apps/admin` | admin.polarad.co.kr |
| polarad-client | `polarad/apps/client` | (미정) |
| website | `website` | polarad.co.kr |

## 로컬 경로 매핑

| 로컬 경로 | Git 경로 |
|-----------|----------|
| `F:/polasales/` | `/` (Git 루트) |
| `F:/polasales/polarad/` | `polarad/` |
| `F:/polasales/polarad/apps/admin/` | `polarad/apps/admin/` |

## 주의사항

1. **Git 루트는 `F:/polasales/`** - `polarad/` 폴더가 아님!
2. **Vercel Root Directory는 Git 경로 기준** - `polarad/apps/admin`
3. **pnpm 명령은 `F:/polasales/polarad/`에서 실행**
