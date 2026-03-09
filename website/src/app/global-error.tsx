"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#1a1a1a] text-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">오류가 발생했습니다</h2>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-lg bg-[#c9a962] text-[#1a1a1a] font-semibold"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
