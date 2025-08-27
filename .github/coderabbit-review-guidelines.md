# CodeRabbit 리뷰 가이드라인

이 문서는 CodeRabbit 리뷰 시 참고할 **팀의 코드 스타일, 네이밍 규칙, 리뷰 포인트**를 정리한 가이드라인입니다.

---

## 1. 코드 스타일

- **ESLint(Airbnb + TypeScript)** 및 **Prettier 설정**을 반드시 준수합니다.
- Prettier 기본 규칙:
  - `singleQuote: true`
  - `semi: true`
  - `tabWidth: 2`
  - `trailingComma: all`
  - `printWidth: 80`

---

## 2. 파일 및 네이밍 규칙

- **컴포넌트 파일명**: `PascalCase`  
  예: `MyComponent.tsx`
- **훅/유틸 파일명**: `camelCase`  
  예: `useCustomHook.ts`, `fetchData.ts`
- **컴포넌트명**: `PascalCase`  
  예: `const MyComponent = () => {}`
- **함수명 및 훅명**: `camelCase`  
  예: `const useCustomHook = () => {}`

---

## 3. Import 순서

- Prettier의 `importOrder` 규칙을 따릅니다.
- 그룹 간에는 빈 줄을 추가합니다.

```text
^react(/.*)?$
^react-router-dom(/.*)?$
^react-dom(/.*)?$
^@tanstack/(.*)$
^@/hooks/(.*)$
^@/services/(.*)$
^@/atoms/(.*)$
^@/utils/(.*)$
^@/styles/(.*)$
^[./]
<THIRD_PARTY_MODULES>
^@/layouts/(.*)$
^@/pages/(.*)$
^@/components/(.*)$
```
