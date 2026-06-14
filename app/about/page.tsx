import Image from "next/image";
import { Smartphone, Monitor, Laptop, Headphones, Target, Zap, BookOpen, Users, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TEAM } from "@/lib/team";

const VALUES = [
  {
    icon: Target,
    title: "Đánh Giá Không Tài Trợ",
    desc: "Chúng tôi tự mua sản phẩm bằng tiền của mình. Không nhận PR, không nhận tài trợ từ hãng — đảm bảo mọi nhận xét đều khách quan 100%.",
  },
  {
    icon: Zap,
    title: "Trải Nghiệm Thực Tế Dài Hạn",
    desc: "Mỗi sản phẩm được dùng tối thiểu 2–4 tuần trước khi viết đánh giá. Không review qua đêm, không đánh giá qua thông số kỹ thuật.",
  },
  {
    icon: BookOpen,
    title: "Số Liệu Có Thể Kiểm Chứng",
    desc: "Mọi thông số đều được đo bằng thiết bị chuyên nghiệp hoặc phần mềm chuẩn. Chúng tôi trình bày phương pháp đo để bạn có thể tự xác minh.",
  },
  {
    icon: Users,
    title: "Vì Người Dùng Việt Nam",
    desc: "Đánh giá theo góc nhìn và nhu cầu thực tế của người dùng tại Việt Nam — giá cả, điều kiện khí hậu, dịch vụ hậu mãi và bảo hành địa phương.",
  },
];

const STATS = [
  { value: "9+",   label: "Bài viết" },
  { value: "4",    label: "Chuyên gia" },
  { value: "4",    label: "Chủ đề" },
  { value: "100%", label: "Miễn phí" },
];

const TOPICS = [
  { icon: Smartphone, label: "Điện Thoại", color: "#7c3aed", href: "/categories/dienthoai" },
  { icon: Monitor,    label: "Màn Hình",   color: "#0ea5e9", href: "/categories/manhinh"   },
  { icon: Laptop,     label: "Laptop",     color: "#10b981", href: "/categories/laptop"    },
  { icon: Headphones, label: "Phụ Kiện",   color: "#f97316", href: "/categories/phukien"  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-5">
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Về chúng tôi
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl leading-tight">
            Chúng tôi là <span className="text-primary">The Zero Tech</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Một đội ngũ reviewer công nghệ chuyên nghiệp, với sứ mệnh đánh giá trung thực điện thoại, màn hình, laptop và phụ kiện — giúp người Việt chọn đúng sản phẩm, không lãng phí tiền bạc.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col gap-20 py-16">

        {/* ── Stats ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-6 text-center">
              <span className="text-4xl font-bold tracking-tight">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Mission ───────────────────────────────────────── */}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold tracking-tight">Tại sao chúng tôi làm điều này?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Thị trường sản phẩm công nghệ Việt Nam ngập tràn quảng cáo và review được tài trợ. Người dùng khó tìm được đánh giá thực sự trung thực trước khi bỏ ra vài triệu đến hàng chục triệu đồng.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The Zero Tech ra đời để thay đổi điều đó. Chúng tôi tự mua sản phẩm, tự trải nghiệm trong nhiều tuần, và viết đánh giá dựa hoàn toàn trên quan điểm của người dùng thực sự — không nhận tài trợ, không bị ảnh hưởng bởi hãng.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Mục tiêu của chúng tôi đơn giản: giúp bạn đưa ra quyết định mua sắm thông minh hơn, tiết kiệm tiền hơn và hài lòng hơn với sản phẩm mình chọn.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {TOPICS.map(({ icon: Icon, label, color, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center hover:border-foreground/20 hover:shadow-sm transition-all"
              >
                <div className="flex size-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: color }}>
                  <Icon className="size-5" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Values ────────────────────────────────────────── */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Giá trị cốt lõi</h2>
            <p className="text-muted-foreground">Những nguyên tắc định hướng mọi bài viết chúng tôi tạo ra.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Team ──────────────────────────────────────────── */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Đội ngũ</h2>
            <p className="text-muted-foreground">Những con người đứng sau The Zero Tech.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
                <div className="relative size-14 overflow-hidden rounded-2xl shadow-md" style={{ boxShadow: `0 4px 16px ${member.color}40` }}>
                  <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-xs font-medium" style={{ color: member.color }}>{member.role}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact CTA ───────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card p-10 flex flex-col items-center text-center gap-5">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-6" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Hợp tác hoặc đóng góp?</h2>
            <p className="text-muted-foreground max-w-md">
              Bạn muốn viết bài cho The Zero Tech, hợp tác quảng bá hoặc chỉ đơn giản là muốn nói chuyện về công nghệ? Chúng tôi luôn sẵn lòng.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Button asChild>
              <Link href="/contact">Liên Hệ Ngay <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/articles">Đọc Bài Viết</Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}
