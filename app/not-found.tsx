import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
        <p className="font-mono text-sm font-semibold text-primary">404 /</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 max-w-md text-center text-sm text-muted-foreground">
          Đường dẫn bạn truy cập không tồn tại hoặc không còn khả dụng.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Về trang chủ
        </Link>
      </body>
    </html>
  );
}
