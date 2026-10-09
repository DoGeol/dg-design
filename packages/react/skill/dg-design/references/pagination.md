<!-- 생성 파일 — packages/react/skill-src/pagination.tsx에서 만든다. 직접 고치지 않는다. -->

# Pagination

페이지 이동 링크 묶음. 현재 쪽 표시와 이전/다음/생략 부품만 제공하고 계산은 앱이 한다.

## 언제 쓰나

- 결과가 쪽으로 나뉜 목록·표 아래의 페이지 이동(URL이 바뀌는 이동).
- 라우터를 쓰면 `Pagination.Link asChild`로 라우터 Link에 모양만 입힌다.

## 쓰지 말 때

- 쪽 번호가 없는 "더 보기"/무한 스크롤은 `Button`.
- 상위 경로 안내는 `Breadcrumb`, 화면 내 전환은 `Tabs`.
- 쪽 수 계산, 생략(...) 위치 결정은 컴포넌트가 하지 않는다 — Item을 몇 개 나열할지는 앱이 정한다.

## 핵심 API

| 부품 | 주요 prop | 메모 |
| --- | --- | --- |
| `Pagination.Root` | `nav` 속성 | `aria-label="페이지네이션"` 기본 |
| `Pagination.List` · `Pagination.Item` | `ul` · `li` | |
| `Pagination.Link` | `isActive` · `asChild` · `href` | `isActive`면 `aria-current="page"`와 활성 외관 |
| `Pagination.Previous` · `Pagination.Next` | `label`(기본 "이전 페이지"/"다음 페이지") · `disabled` | `disabled`면 `href`가 빠지고 `aria-disabled`가 붙는다 |
| `Pagination.Ellipsis` | `label`(기본 "더 많은 페이지") | 생략 표시. 스크린 리더용 텍스트 |

## 접근성

- 현재 쪽 링크에 `isActive`로 `aria-current="page"`를 준다.
- 첫/마지막 쪽에서는 Previous/Next를 `disabled`로 두고 숨기지 않는다 — 위치가 흔들리지 않는다.
- 앱 언어가 한국어가 아니면 `label`을 교체하고, 한 화면에 Pagination이 둘이면 Root의 `aria-label`로 구분한다.

## 예제

```tsx
import { Pagination } from "@dg-design/react/pagination";

/** 처음 쪽 — Previous는 disabled */
export function FirstPage() {
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous disabled />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link href="?page=1" isActive>
            1
          </Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link href="?page=2">2</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link href="?page=3">3</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next href="?page=2" />
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}

/** 가운데 쪽 — 생략 표시를 앱이 계산해 넣는다 */
export function WithEllipsis({ page = 5, last = 12 }: { page?: number; last?: number }) {
  const href = (n: number) => `?page=${n}`;
  return (
    <Pagination.Root aria-label="문서 목록 페이지네이션">
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous href={href(page - 1)} />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link href={href(1)}>1</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link href={href(page)} isActive>
            {page}
          </Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link href={href(last)}>{last}</Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next href={href(page + 1)} />
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}

/** 라우터 Link에 모양만 입히기 — 여기서는 <a>로 대신 보인다 */
export function WithAsChild() {
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Link asChild isActive>
            <a href="/docs?page=1">1</a>
          </Pagination.Link>
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Link asChild>
            <a href="/docs?page=2">2</a>
          </Pagination.Link>
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}
```
