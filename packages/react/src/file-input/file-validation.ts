/**
 * 확장자 → MIME 매핑. 드롭 시 브라우저가 `File.type`을 빈 문자열로 주는 경우(주로 OS가
 * MIME을 못 붙인 파일)의 fallback이다. accept의 확장자 패턴(`.png`)은 항상 파일명으로
 * 비교하니 이 맵은 accept의 MIME 패턴(`image/*`, `image/png`)을 판정할 때만 쓰인다.
 * 흔한 값만 다룬다 — 없는 확장자는 MIME 패턴과 매칭되지 않는다(型 미상은 불일치로 처리).
 */
const EXTENSION_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  pdf: "application/pdf",
  txt: "text/plain",
  csv: "text/csv",
  json: "application/json",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip",
};

function guessMimeType(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
  return EXTENSION_MIME[ext] ?? "";
}

function fileMatchesAccept(file: File, patterns: string[]): boolean {
  if (patterns.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || guessMimeType(name)).toLowerCase();

  return patterns.some((raw) => {
    const pattern = raw.trim().toLowerCase();
    if (!pattern) return false;
    if (pattern.startsWith(".")) return name.endsWith(pattern);
    if (pattern.endsWith("/*")) return type !== "" && type.startsWith(pattern.slice(0, -1));
    return type !== "" && type === pattern;
  });
}

export type FileRejectReason = "type" | "size" | "count";

export interface RejectedFile {
  file: File;
  reason: FileRejectReason;
}

export interface FileValidationOptions {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
}

export interface FileValidationResult {
  files: File[];
  rejected: RejectedFile[];
}

/**
 * accept(MIME·확장자)·maxSize·maxFiles 세 가지만 검증한다. 문구는 만들지 않는다 — 소비자가
 * reason 코드로 Field.ErrorMessage를 채운다. `multiple`이 아니면(기본값 포함) 네이티브 input과
 * 맞춰 암묵적으로 1개까지만 통과하고, `multiple`일 때만 maxFiles가 상한으로 쓰인다. 상한을
 * 넘는 초과분은 통과 판정 이후 뒤쪽부터 "count"로 밀린다.
 */
export function validateFiles(
  fileList: FileList | File[],
  { accept, maxSize, maxFiles, multiple }: FileValidationOptions,
): FileValidationResult {
  const patterns = accept
    ? accept
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const files: File[] = [];
  const rejected: RejectedFile[] = [];

  for (const file of Array.from(fileList)) {
    if (!fileMatchesAccept(file, patterns)) {
      rejected.push({ file, reason: "type" });
      continue;
    }
    if (maxSize !== undefined && file.size > maxSize) {
      rejected.push({ file, reason: "size" });
      continue;
    }
    files.push(file);
  }

  const limit = multiple ? maxFiles : 1;
  if (limit !== undefined && files.length > limit) {
    const overflow = files.splice(limit);
    for (const file of overflow) rejected.push({ file, reason: "count" });
  }

  return { files, rejected };
}
