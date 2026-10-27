---
"@dg-design/react": minor
---

dg-studio에서 모은 모션·아이콘 요청을 반영합니다.

- **Button**: 배경·테두리·글자 색이 `--dds-duration-fast`·`--dds-easing-out`으로 전환되고, 누르는 동안 `scale: 0.98`로 살짝 줄어듭니다(disabled·loading 제외). `prefers-reduced-motion: reduce`에서는 축소만 빠지고 색 전환은 남습니다. `asChild` 링크 버튼에도 같이 적용되며 `motion` prop(로딩 교차 페이드)과는 무관합니다.
- **Card**(링크·버튼으로 쓴 경우)와 **List** 행 Action·묶음 제목 토글: hover 색이 fast로 전환됩니다.
- **Dialog·Sheet·Toast**: 퇴장 길이를 입장(base)보다 짧은 fast로 줄였습니다.
- **reduced motion의 오버레이**(Dialog·Sheet·Toast·Popover·Tooltip·HoverCard·DropdownMenu·ContextMenu·Select): 즉시 사라지던 것을 이동·확대 없는 opacity 페이드(fast)로 바꿔, 열고 닫힘이 눈에 보이게 했습니다. ContextMenu만 쓰는 앱에서 공용 keyframes가 로드되지 않던 문제도 고쳤습니다.
- **Slider·ResizeHandle·RadioGroup(segmented)**: 하드코딩된 `0.15s ease`를 모션 토큰으로 바꿨습니다.
- **Icon**: 16종을 추가했습니다 — `TrashIcon`·`DownloadIcon`·`UploadIcon`·`PencilIcon`·`MoreIcon`·`UndoIcon`·`RedoIcon`·`EyeIcon`·`GlobeIcon`·`LockIcon`·`PanelLeftIcon`·`PanelRightIcon`, 그리고 Alert가 그리던 상태 아이콘 `InfoIcon`·`PositiveIcon`·`WarningIcon`·`CriticalIcon`. Alert는 이제 이 공개 아이콘을 씁니다(24 grid로 옮기며 선 굵기가 1.5에서 약 1.67px로 아이콘 세트와 같아졌습니다).
- **DropdownMenu.ItemIcon**(`DropdownMenuItemIcon`): 메뉴 항목 앞 아이콘 자리. 장식(`aria-hidden`)이며 안의 아이콘 size와 관계없이 16으로 맞춥니다.
