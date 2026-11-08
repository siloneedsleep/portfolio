import type { Locale } from "@/i18n";

export interface CaseStudyContent {
  slug: "auratype" | "antigravity-mod";
  notice?: string;
  overview: string;
  problem: string;
  solution: string;
  features: readonly { title: string; detail: string }[];
  architecture: readonly { layer: string; summary: string }[];
  challenges: readonly { title: string; detail: string }[];
  lessons: readonly string[];
  currentScope: string;
}

const caseStudiesByLocale: Record<Locale, Record<"auratype" | "antigravity-mod", CaseStudyContent>> = {
  vi: {
    auratype: {
      slug: "auratype",
      overview:
        "AuraType là studio luyện gõ phím song ngữ Việt — Anh theo phong cách tối giản, chạy hoàn toàn ngay trên trình duyệt với dữ liệu luyện tập lưu cục bộ bằng IndexedDB (Dexie) và tùy chọn tạo đoạn văn bằng Gemini AI trên server.",
      problem:
        "Phần lớn trang luyện gõ phím chỉ tối ưu cho tiếng Anh hoặc xử lý bộ gõ tiếng Việt (Telex/VNI) theo từng keystroke rời rạc, dễ lệch vị trí ký tự khi IME đang compose dấu, đồng thời cho phép paste hoặc autofill làm sai lệch kết quả thực tế.",
      solution:
        "Xây dựng typing engine tách theo grapheme chuẩn Unicode NFC kết hợp bộ lọc beforeinput để chặn paste/drop/autofill mà vẫn giữ nguyên luồng composition của Telex/VNI, đồng bộ timeline từng thao tác gõ (bao gồm xóa/sửa) cho Ghost replay và tính WPM/Accuracy chuẩn xác.",
      features: [
        {
          title: "Nhập liệu Telex / VNI chuẩn Grapheme",
          detail:
            "Chuẩn hóa NFC và tách cụm grapheme giúp việc đối chiếu dấu thanh tiếng Việt với văn bản mẫu chính xác ngay cả trong quá trình IME đang ghép chữ.",
        },
        {
          title: "Ghost Replay & Mục tiêu WPM",
          detail:
            "Đấu trực tiếp với bản ghi của lượt hoàn thành tốt nhất trên cùng đoạn văn và bộ quy tắc, hoặc chọn Ghost tốc độ ổn định từ 30–120 WPM.",
        },
        {
          title: "Tạo đoạn văn bằng Gemini AI (Server-only)",
          detail:
            "API route sử dụng @google/genai phía server kết hợp Upstash Redis để giới hạn cooldown theo IP (30–60s), quota ngày/giờ và pool cache dùng chung theo 24 giờ.",
        },
        {
          title: "Lưu trữ cục bộ & Journey Panel",
          detail:
            "Cài đặt, lịch sử luyện tập và bản ghi cá nhân lưu trong IndexedDB qua Dexie (hỗ trợ export backup), đi kèm bảng phân tích quá trình luyện tập (JourneyPanel) ngay trên trình duyệt.",
        },
      ],
      architecture: [
        {
          layer: "Engine Layer (engine/typingEngine.ts, inputAdapter.ts, replayEngine.ts)",
          summary:
            "Xử lý trạng thái từng ký tự/grapheme, đánh giá beforeinput chặn dán/kéo thả ngoài IME và phát lại timeline cho Ghost replay.",
        },
        {
          layer: "State & Local Persistence (Zustand + Dexie)",
          summary:
            "Quản lý phiên gõ theo thời gian thực bằng Zustand và lưu lịch sử cá nhân, bản ghi replay, cài đặt trong IndexedDB mà không cần đăng nhập.",
        },
        {
          layer: "AI Generation API (app/api/generate, services/geminiProvider.ts)",
          summary:
            "Server-side Gemini API với luân chuyển key khỏe trong quota group, không retry bão khi lỗi 429 và cache đoạn văn hợp lệ bằng Upstash Redis.",
        },
      ],
      challenges: [
        {
          title: "Đồng bộ IME Tiếng Việt với con trỏ & độ chính xác",
          detail:
            "Bộ gõ Telex/VNI tạo sự kiện composition liên tục trước khi chốt ký tự. Giải pháp là tách evaluateBeforeInput để phân biệt composition hợp lệ với autofill/paste đa ký tự, đồng thời tính accuracy theo tổng số lần chèn ký tự để các lỗi đã sửa vẫn được phản ánh trung thực.",
        },
        {
          title: "Kiểm soát chi phí và quota Gemini API công khai",
          detail:
            "Thay vì gọi trực tiếp từ client hoặc rate-limit lỏng lẻo trong bộ nhớ, server dùng atomic reservation trên Redis để cấp lease thực thi, chặn burst 429 và tái sử dụng các đoạn văn đã kiểm duyệt trong cache pool.",
        },
      ],
      lessons: [
        "Luôn thiết kế cơ chế degradation rõ ràng: chế độ luyện gõ cốt lõi và Ghost replay hoạt động ngoại tuyến/không cần AI key, chỉ phần tạo đoạn văn AI mới phụ thuộc Redis & Gemini.",
        "Xử lý tiếng Việt trên web đòi hỏi kiểm thử trực tiếp với composition events và Unicode NFC thay vì dựa vào độ dài chuỗi UTF-16.",
      ],
      currentScope:
        "Phiên bản hiện tại chạy live tại auratype.duckdns.org với đầy đủ chế độ luyện gõ, Ghost replay, tùy chỉnh đoạn văn 150–1.400 ký tự và AI generation (tùy cấu hình server). Không có bảng xếp hạng công khai hay tài khoản cloud — toàn bộ lịch sử nằm trên thiết bị người dùng.",
    },
    "antigravity-mod": {
      slug: "antigravity-mod",
      notice:
        "Lưu ý: Đây là dự án mod giao diện cộng đồng không chính thức (unofficial mod) dành cho người dùng cá nhân trên Windows; không phải sản phẩm chính thức của Google.",
      overview:
        "Antigravity Mod (Furina 3D Edition) là bộ công cụ tùy biến giao diện và Việt hóa toàn diện cho ứng dụng desktop Google Antigravity 2.0 trên Windows, nổi bật với nhân vật đồng hành 3D Chibi Furina dựng bằng Three.js/WebGL phản hồi theo từng ký tự đang gõ.",
      problem:
        "Giao diện mặc định của ứng dụng chưa hỗ trợ tiếng Việt đầy đủ và không cung cấp tùy chọn cá nhân hóa hình nền, màu nhấn hay đồng hành tương tác trong không gian nhập liệu.",
      solution:
        "Viết script PowerShell hỗ trợ tiêm trực tiếp qua Chrome DevTools Protocol (CDP) khi ứng dụng đang mở hoặc vá bền vững vào app.asar (kèm sao lưu và cập nhật SHA-256), nạp engine JavaScript điều phối Three.js FBXLoader, caret tracking và từ điển dịch DOM hai chiều.",
      features: [
        {
          title: "Nhân vật 3D Chibi Furina (Three.js / WebGL)",
          detail:
            "Nạp model furi.fbx cùng các lớp texture sRGB nguyên bản qua Three.js FBXLoader ngay phía trên khung chat, kèm cơ chế fallback sang SVG 2D hoặc ảnh tùy chỉnh.",
        },
        {
          title: "Theo dõi con trỏ gõ chữ (Eye & Caret Tracking)",
          detail:
            "Đọc tọa độ Selection / Range.getClientRects() theo thời gian thực để xoay đầu và thân 3D theo vị trí ký tự đang nhập, kết hợp vật lý lò xo khi gõ và phản hồi khi nhấn Enter.",
        },
        {
          title: "Việt hóa DOM bảo toàn văn bản gốc",
          detail:
            "Lưu trữ văn bản gốc trên từng DOM Text Node để chuyển đổi tức thì giữa Tiếng Việt và Tiếng Anh (Alt + L) qua hiệu ứng chuyển cảnh nhẹ.",
        },
        {
          title: "Cơ chế cài đặt Dual-Mode (Live CDP & Persistent ASAR)",
          detail:
            "Tự động phát hiện DevToolsActivePort để inject thử nghiệm ngay lập tức mà không cần khởi động lại, hoặc đóng gói vào dist/preload.js trong app.asar kèm file backup.",
        },
      ],
      architecture: [
        {
          layer: "Installer & Patcher (Mod Antigravity.ps1)",
          summary:
            "Phát hiện đường dẫn cài đặt, sao lưu file gốc (.bak), tiêm payload qua CDP WebSocket hoặc vá app.asar với mã băm SHA-256 cập nhật.",
        },
        {
          layer: "WebGL Companion & Caret Engine (src/mod.js)",
          summary:
            "Khởi tạo canvas Three.js trong suốt không cản chuột vùng nhập liệu, tải model FBX và theo dõi tọa độ con trỏ văn bản theo thời gian thực.",
        },
        {
          layer: "DOM Localization & Theme Layer (src/mod.js, src/styles.css)",
          summary:
            "Áp dụng biến CSS chủ đề, hình nền tùy chỉnh, menu điều khiển nhanh (Alt + M) và bộ dịch DOM giữ nguyên khả năng khôi phục bản gốc.",
        },
      ],
      challenges: [
        {
          title: "Đồng bộ tọa độ 3D theo con trỏ soạn thảo phức tạp",
          detail:
            "Khung nhập liệu dựa trên DOM/contenteditable thay đổi tọa độ liên tục khi cuộn hoặc xuống dòng. Cần tính toán tọa độ tương đối so với khung composer và clamp góc xoay để chuyển động tự nhiên mà không giật khung hình.",
        },
        {
          title: "Giữ ổn định sau cập nhật ứng dụng gốc",
          detail:
            "Vì đây là mod không chính thức can thiệp vào Electron ASAR/DOM, mọi bản cập nhật của ứng dụng gốc có thể ghi đè patch hoặc đổi class DOM — đòi hỏi cơ chế backup rõ ràng và selector an toàn.",
        },
      ],
      lessons: [
        "Tách riêng đường inject thử nghiệm (Live CDP) và đường cài đặt bền vững (ASAR backup) giúp phát triển và khôi phục an toàn hơn rất nhiều.",
        "Luôn đặt pointer-events và z-index cẩn thận cho lớp WebGL overlay để không bao giờ cản trở thao tác gõ hay chọn văn bản của người dùng.",
      ],
      currentScope:
        "Phiên bản v2.6.1 đang được phát hành công khai trên GitHub với mã nguồn PowerShell, JS/CSS và tài nguyên model/texture để người dùng tự kiểm tra và cài đặt trên Windows 10/11.",
    },
  },
  en: {
    auratype: {
      slug: "auratype",
      overview:
        "AuraType is a quiet bilingual Vietnamese–English typing studio running directly in the browser, backed by local IndexedDB persistence (Dexie) and optional server-side Gemini AI passage generation.",
      problem:
        "Most typing platforms focus solely on English or treat Vietnamese Telex/VNI input as raw single keystrokes, breaking caret alignment during IME composition and allowing paste or autofill to skew accuracy.",
      solution:
        "Built a Unicode NFC grapheme-aware typing engine paired with a beforeinput adapter that blocks paste, drop, and autofill without interrupting Telex/VNI IME composition, recording timestamped actions for Ghost replay and faithful WPM/Accuracy metrics.",
      features: [
        {
          title: "Grapheme-Aware Telex / VNI Input",
          detail:
            "Normalizes text to Unicode NFC and segments graphemes so Vietnamese diacritics match accurately throughout active IME composition.",
        },
        {
          title: "Ghost Replay & Target WPM",
          detail:
            "Race against your best eligible local replay on the exact same passage and rule set, or practice against a steady 30–120 WPM ghost.",
        },
        {
          title: "Server-Only Gemini AI Passage Generation",
          detail:
            "Next.js API route using @google/genai with Upstash Redis atomic leases for per-IP cooldowns (30–60s), hourly/daily quotas, and a 24-hour shared passage pool.",
        },
        {
          title: "Local IndexedDB Storage & Journey Panel",
          detail:
            "Settings, practice history, and personal records stay local in IndexedDB via Dexie with JSON export/backup and a JourneyPanel summary view.",
        },
      ],
      architecture: [
        {
          layer: "Engine Layer (engine/typingEngine.ts, inputAdapter.ts, replayEngine.ts)",
          summary:
            "Evaluates grapheme states, blocks non-IME multi-character insertions in beforeinput, and drives timeline-accurate Ghost playback.",
        },
        {
          layer: "State & Local Persistence (Zustand + Dexie)",
          summary:
            "Handles real-time typing session state in Zustand and persists history, custom passages, and replays locally in IndexedDB without accounts.",
        },
        {
          layer: "AI Generation API (app/api/generate, services/geminiProvider.ts)",
          summary:
            "Server-side Gemini integration with healthy-key rotation, bounded timeouts, no retry storms on 429s, and Redis-backed passage caching.",
        },
      ],
      challenges: [
        {
          title: "Supporting Vietnamese IME Composition Without Losing Accuracy Guarantees",
          detail:
            "Telex and VNI emit multi-step composition updates before committing a character. Separating composition events from clipboard/autofill insertions in evaluateBeforeInput preserves natural Vietnamese typing while keeping metrics honest.",
        },
        {
          title: "Protecting Public AI Endpoints From Quota Exhaustion",
          detail:
            "Atomic Redis reservations enforce IP cooldowns and active execution leases while serving cached validated passages whenever possible to avoid unnecessary Gemini calls.",
        },
      ],
      lessons: [
        "Core typing, custom text, and Ghost replay work immediately with zero backend dependencies; AI generation enhances the studio gracefully when configured.",
        "Handling Vietnamese text accurately requires grapheme segmentation and IME composition testing rather than naive UTF-16 string indexing.",
      ],
      currentScope:
        "Deployed live at auratype.duckdns.org with built-in passages, custom text (150–1,400 chars), Ghost replay, and server-side AI generation when configured. No public leaderboard or cloud account system is claimed — data stays in the user's browser.",
    },
    "antigravity-mod": {
      slug: "antigravity-mod",
      notice:
        "Disclaimer: This is an unofficial community UI & localization mod for Google Antigravity 2.0 on Windows, not an official Google product.",
      overview:
        "Antigravity Mod (Furina 3D Edition) is a UI customization and full Vietnamese localization suite for the Google Antigravity 2.0 desktop app on Windows, featuring an interactive 3D Chibi Furina companion rendered via Three.js/WebGL above the chat composer.",
      problem:
        "The stock desktop interface lacked comprehensive Vietnamese localization and offered limited personalization for backgrounds, accent colors, and interactive workspace elements.",
      solution:
        "Created a PowerShell dual-mode injector supporting live Chrome DevTools Protocol (CDP) injection and persistent ASAR patching (with automatic backups and SHA-256 hash updates), loading a Three.js FBX companion synced with real-time caret coordinates and reversible DOM translation.",
      features: [
        {
          title: "3D Chibi Furina Companion (Three.js / WebGL)",
          detail:
            "Renders the furi.fbx 3D model and sRGB textures directly above the composer card via Three.js FBXLoader, with instant switching to 2D SVG or custom PNG/GIF avatars.",
        },
        {
          title: "Real-Time Eye & Caret Tracking",
          detail:
            "Reads live Selection / Range.getClientRects() coordinates to subtly rotate the 3D character toward the active text caret, paired with spring physics on keystrokes.",
        },
        {
          title: "Reversible DOM Vietnamese Localization",
          detail:
            "Caches original English text on DOM nodes (node.__agOrigText) so users can toggle seamlessly between Vietnamese and English (Alt + L).",
        },
        {
          title: "Dual-Mode Patching (Live CDP & Persistent ASAR)",
          detail:
            "Injects live into running instances via DevToolsActivePort without restarting, or patches app.asar persistently with backup files and updated SHA-256 integrity hashes.",
        },
      ],
      architecture: [
        {
          layer: "Installer & Patcher (Mod Antigravity.ps1)",
          summary:
            "Locates installation directories, creates .bak backups, and applies either live CDP WebSocket injection or persistent ASAR packaging.",
        },
        {
          layer: "WebGL Companion & Caret Engine (src/mod.js)",
          summary:
            "Mounts a non-blocking transparent Three.js overlay, loads FBX assets, and maps text-caret coordinates to smooth 3D head/body rotation.",
        },
        {
          layer: "Localization & Theme Layer (src/mod.js, src/styles.css)",
          summary:
            "Manages custom CSS variables, background presets, quick settings modal (Alt + M), and non-destructive DOM text translation.",
        },
      ],
      challenges: [
        {
          title: "Tracking Live Caret Position Across Dynamic Editors",
          detail:
            "Reading caret rects inside rich editor inputs requires clamping coordinates relative to the composer bounds and smoothing orientation updates so motion feels responsive without interfering with typing.",
        },
        {
          title: "Resilience Around Upstream Desktop Updates",
          detail:
            "Because unofficial Electron DOM/ASAR mods depend on upstream app structure, the installer backs up original binaries before patching and supports instant live CDP testing.",
        },
      ],
      lessons: [
        "Providing a non-destructive live CDP path alongside persistent ASAR patching makes iteration and troubleshooting significantly safer.",
        "Overlay canvases must stay strictly non-blocking with careful pointer-events and focus handling so editor workflows remain untouched.",
      ],
      currentScope:
        "Released publicly at v2.6.1 on GitHub with open PowerShell, JS/CSS source code, and model assets for inspection and Windows 10/11 usage.",
    },
  },
};

export function getCaseStudyContent(
  locale: Locale,
  slug: string,
): CaseStudyContent | undefined {
  if (slug !== "auratype" && slug !== "antigravity-mod") return undefined;
  return caseStudiesByLocale[locale][slug];
}
