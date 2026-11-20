import type { Locale } from "@/i18n/routing";

export type LegalPage = "terms" | "privacy";
export const legalUpdated = "2026-11-20";

interface LegalDocument {
  title: string;
  introduction: string;
  sections: {
    heading: string;
    paragraphs: string[];
    links?: { label: string; href: string }[];
  }[];
  contact: string;
}

export const legalDocuments: Record<Locale, Record<LegalPage, LegalDocument>> = {
  vi: {
    terms: {
      title: "Điều khoản sử dụng",
      introduction: "Đỗ Trường Thịnh (Silo) vận hành siloneedsleep.xyz để giới thiệu dự án và trao đổi về công việc. Các điều khoản này áp dụng khi bạn xem hoặc sử dụng portfolio.",
      sections: [
        {
          heading: "Xem và chia sẻ nội dung",
          paragraphs: [
            "Bạn có thể đọc các bài giới thiệu và chia sẻ đường dẫn đến trang gốc. Nếu muốn đăng lại hình ảnh, bài viết hoặc dùng chúng trong sản phẩm của mình, hãy kiểm tra giấy phép đi kèm hoặc liên hệ Silo để xin phép. Bạn vẫn có các quyền sử dụng mà pháp luật cho phép.",
            "Mỗi kho mã có thể có giấy phép riêng. Hãy kiểm tra giấy phép của đúng dự án trước khi sao chép, chỉnh sửa hoặc phân phối mã nguồn. Tác phẩm và nhãn hiệu của bên thứ ba thuộc về chủ sở hữu tương ứng.",
          ],
        },
        {
          heading: "Liên hệ và đề nghị hợp tác",
          paragraphs: [
            "Hãy dùng địa chỉ email bạn có thể nhận thư và chỉ chia sẻ nội dung bạn có quyền gửi. Vui lòng tránh gửi thư rác, mạo danh người khác, gửi mã độc, truy cập trái phép hoặc làm gián đoạn website.",
            "Bạn có thể dùng biểu mẫu để hỏi về một dự án hoặc đề nghị hợp tác. Chi phí, phạm vi công việc và thời hạn thực hiện cần được hai bên thống nhất riêng.",
          ],
        },
        {
          heading: "Dự án, bản thử nghiệm và liên kết ngoài",
          paragraphs: [
            "Bài giới thiệu phản ánh trạng thái dự án tại thời điểm viết. Tính năng, bản tải xuống và khả năng truy cập bản thử nghiệm có thể thay đổi. Khi mở ứng dụng, kho mã hoặc trang mạng xã hội được liên kết, hãy xem điều khoản và chính sách của dịch vụ đó.",
            "Nếu phát sinh thiệt hại khi sử dụng website, quyền và trách nhiệm của mỗi bên được xác định theo pháp luật áp dụng.",
          ],
        },
        {
          heading: "Cập nhật và báo lỗi",
          paragraphs: [
            "Khi điều khoản thay đổi, Silo sẽ đăng bản mới và ghi ngày cập nhật trên trang này. Nếu thấy nội dung sai, liên kết hỏng hoặc tác phẩm của mình được sử dụng thiếu phép, bạn có thể gửi đường dẫn của trang liên quan để Silo kiểm tra.",
          ],
        },
      ],
      contact: "Gửi câu hỏi về điều khoản hoặc yêu cầu sử dụng nội dung đến",
    },
    privacy: {
      title: "Chính sách quyền riêng tư",
      introduction: "Đỗ Trường Thịnh (Silo) chịu trách nhiệm về việc xử lý dữ liệu trên portfolio siloneedsleep.xyz. Bạn có thể xem các dự án mà không cần tạo tài khoản hoặc cung cấp email.",
      sections: [
        {
          heading: "Khi bạn gửi lời nhắn",
          paragraphs: [
            "Khi bạn bấm gửi, website nhận tên, địa chỉ email và nội dung đã nhập để Silo đọc, trả lời và theo dõi cuộc trao đổi. Khi chức năng chuyển thư hoạt động, Resend chuyển các thông tin này đến hộp thư của Silo. Nếu bạn gửi email trực tiếp, thư đi qua nhà cung cấp email của bạn và của người nhận.",
            "Bạn có thể bỏ qua biểu mẫu và tiếp tục xem portfolio. Nếu liên hệ, chỉ cần cung cấp thông tin cần thiết cho câu hỏi của bạn. Vui lòng giữ mật khẩu, số giấy tờ tùy thân và thông tin thanh toán ngoài lời nhắn.",
          ],
          links: [{ label: "Chính sách quyền riêng tư của Resend", href: "https://resend.com/legal/privacy-policy" }],
        },
        {
          heading: "Khi bạn mở một trang",
          paragraphs: [
            "Cloudflare và Vercel xử lý yêu cầu từ trình duyệt để chuyển nội dung đến bạn, bảo vệ website và chẩn đoán lỗi. Dữ liệu kỹ thuật có thể gồm địa chỉ IP, trang được yêu cầu, thời điểm truy cập và loại trình duyệt. Cloudflare cũng có thể đo lượt xem và hiệu năng, chẳng hạn thời gian tải trang.",
            "Khi bạn gửi biểu mẫu, máy chủ dùng địa chỉ IP để đếm số lần gửi trong khoảng 15 phút nhằm hạn chế thư rác. Khoảng thời gian này chỉ áp dụng cho việc đếm lượt gửi.",
            "Một số trang trình chiếu tải phông chữ từ Google Fonts. Khi mở những trang đó, trình duyệt gửi yêu cầu tải phông chữ cùng địa chỉ IP đến Google.",
          ],
          links: [
            { label: "Quyền riêng tư tại Cloudflare", href: "https://www.cloudflare.com/privacypolicy/" },
            { label: "Cách Cloudflare đo hiệu năng", href: "https://developers.cloudflare.com/web-analytics/about/" },
            { label: "Quyền riêng tư tại Vercel", href: "https://vercel.com/legal/privacy-policy" },
            { label: "Quyền riêng tư tại Google Fonts", href: "https://developers.google.com/fonts/faq/privacy" },
          ],
        },
        {
          heading: "Ngôn ngữ và giao diện",
          paragraphs: [
            "Cookie NEXT_LOCALE ghi nhớ ngôn ngữ tối đa một năm. Khi bạn chọn giao diện sáng hoặc tối, website lưu lựa chọn trong bộ nhớ cục bộ của trình duyệt. Bạn có thể đổi lựa chọn trên thanh điều hướng hoặc xóa cả hai trong phần dữ liệu trang web của trình duyệt.",
          ],
        },
        {
          heading: "Nơi xử lý và thời gian lưu",
          paragraphs: [
            "Thư đã gửi có thể còn trong hộp thư để Silo trả lời, theo dõi công việc hai bên đang trao đổi hoặc thực hiện nghĩa vụ pháp lý liên quan. Thời gian lưu tùy thuộc vào thời gian cần thiết cho những mục đích đó. Bạn có thể yêu cầu xóa thư ngay cả khi cuộc trao đổi đang diễn ra.",
            "Nhà cung cấp hạ tầng và email có thể xử lý dữ liệu tại máy chủ ngoài Việt Nam. Thời gian lưu nhật ký kỹ thuật và bản sao lưu phụ thuộc vào từng dịch vụ. Nếu bạn mở ứng dụng, bản demo hoặc mạng xã hội từ portfolio, chính sách của dịch vụ đó áp dụng cho hoạt động tại đó.",
          ],
        },
        {
          heading: "Quyền của bạn",
          paragraphs: [
            "Bạn có thể hỏi Silo đang xử lý dữ liệu nào của mình, yêu cầu xem, nhận bản sao, sửa hoặc xóa dữ liệu. Bạn cũng có thể yêu cầu hạn chế xử lý, phản đối việc xử lý, rút lại sự đồng ý đã đưa ra hoặc khiếu nại với cơ quan có thẩm quyền theo pháp luật áp dụng.",
            "Để Silo tìm đúng thư, hãy gửi yêu cầu từ địa chỉ bạn đã dùng để liên hệ và cho biết khoảng thời gian trao đổi. Nếu cần xác minh thêm, Silo sẽ cho biết thông tin nào cần thiết. Ngày cập nhật ở đầu trang cho biết lần sửa đổi chính sách gần nhất.",
          ],
          links: [{ label: "Luật Bảo vệ dữ liệu cá nhân của Việt Nam", href: "https://chinhphu.vn/?docid=214590&pageid=27160&typegroupid=3" }],
        },
      ],
      contact: "Gửi yêu cầu về dữ liệu cá nhân đến",
    },
  },
  en: {
    terms: {
      title: "Terms of Service",
      introduction: "Đỗ Trường Thịnh (Silo) runs siloneedsleep.xyz to share projects and discuss work. These terms apply when you browse or use this portfolio.",
      sections: [
        {
          heading: "Reading and sharing the work",
          paragraphs: [
            "You may read the project notes and share links to the original pages. To republish an image or article, or use it in your own product, check its license or contact Silo for permission. You retain any rights that applicable law gives you to use the material.",
            "Each code repository may have its own license. Check the project’s license before copying, modifying or redistributing its source. Third-party materials and trademarks belong to their respective owners.",
          ],
        },
        {
          heading: "Getting in touch and proposing work",
          paragraphs: [
            "Use an email address where you can receive replies and send only material you have the right to share. Please avoid spam, impersonation, malicious code, unauthorized access and interference with the site.",
            "You can use the form to ask about a project or suggest working together. Fees, deliverables and deadlines require a separate agreement between you and Silo.",
          ],
        },
        {
          heading: "Projects, demos and external links",
          paragraphs: [
            "Project notes describe the work at the time of writing. Features, downloads and demo availability may change. When you open a linked app, repository or social profile, check that service’s terms and privacy policy.",
            "Applicable law determines each party’s rights and responsibilities if harm occurs while using this site.",
          ],
        },
        {
          heading: "Updates and corrections",
          paragraphs: [
            "Silo will publish revised terms here with an updated date. If you find an error, a broken link or work of yours that you believe was used without permission, please include the relevant page address so Silo can look into it.",
          ],
        },
      ],
      contact: "For questions about these terms or permission to reuse material, email",
    },
    privacy: {
      title: "Privacy Policy",
      introduction: "Đỗ Trường Thịnh (Silo) is responsible for how personal data is handled on the portfolio at siloneedsleep.xyz. You can browse the projects without creating an account or giving your email address.",
      sections: [
        {
          heading: "When you send a message",
          paragraphs: [
            "When you submit the form, the site receives your name, email address and message so Silo can read, answer and follow up on your inquiry. When form delivery is enabled, Resend delivers those details to Silo’s inbox. If you email directly, your email provider and the recipient’s provider handle delivery.",
            "You can skip the form and continue browsing. If you get in touch, share only what Silo needs to answer your question. Please keep passwords, identity document numbers and payment details out of your message.",
          ],
          links: [{ label: "Resend’s privacy policy", href: "https://resend.com/legal/privacy-policy" }],
        },
        {
          heading: "When you open a page",
          paragraphs: [
            "Cloudflare and Vercel handle browser requests to deliver pages, protect the site and diagnose errors. Technical data may include your IP address, the page requested, the time of access and your browser type. Cloudflare may also measure page views and performance, such as how long a page takes to load.",
            "When you submit the form, the server uses your IP address to count submissions within a 15-minute window to limit spam. That window applies only to the submission counter.",
            "Some presentation pages load typefaces from Google Fonts. When you open one of those pages, your browser sends Google a font request that includes your IP address.",
          ],
          links: [
            { label: "Cloudflare’s privacy policy", href: "https://www.cloudflare.com/privacypolicy/" },
            { label: "How Cloudflare measures performance", href: "https://developers.cloudflare.com/web-analytics/about/" },
            { label: "Vercel’s privacy policy", href: "https://vercel.com/legal/privacy-policy" },
            { label: "Privacy at Google Fonts", href: "https://developers.google.com/fonts/faq/privacy" },
          ],
        },
        {
          heading: "Language and appearance",
          paragraphs: [
            "The NEXT_LOCALE cookie remembers your language for up to one year. When you choose a light or dark theme, the site saves that choice in your browser’s local storage. You can change either preference in the navigation bar or clear both in your browser’s site data settings.",
          ],
        },
        {
          heading: "Where data is processed and how long it is kept",
          paragraphs: [
            "Delivered messages may stay in the inbox so Silo can reply, follow up on work under discussion or meet a related legal obligation. Retention depends on how long those purposes apply. You can ask for deletion even while a conversation is open.",
            "Hosting and email providers may process data on servers outside Vietnam. Technical log and backup retention depend on the provider. If you open an app, demo or social platform linked from the portfolio, that service’s policy applies to what you do there.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You may ask what personal data Silo handles about you and request access, a copy, correction or deletion. You may also ask to restrict processing, object to processing, withdraw consent you have given or lodge a complaint with the competent authority under applicable law.",
            "To help Silo locate your correspondence, write from the address you used and give the approximate date of the exchange. If further verification is needed, Silo will tell you what information is required. The date at the top of this page shows when this policy was last revised.",
          ],
          links: [{ label: "Vietnam’s Law on Personal Data Protection (Vietnamese)", href: "https://chinhphu.vn/?docid=214590&pageid=27160&typegroupid=3" }],
        },
      ],
      contact: "Send personal data requests to",
    },
  },
};
