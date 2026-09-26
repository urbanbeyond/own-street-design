import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OWN STREET — YOUR IMAGE. YOUR STREET." },
      {
        name: "description",
        content:
          "한국 커스텀 티셔츠 서비스. 원하는 이미지의 URL을 보내주세요. 나머지는 우리가 준비합니다.",
      },
      { property: "og:title", content: "OWN STREET — YOUR IMAGE. YOUR STREET." },
      {
        property: "og:description",
        content:
          "한국 커스텀 티셔츠 서비스. 원하는 이미지의 URL을 보내주세요. 나머지는 우리가 준비합니다.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OwnStreetPage,
});

// ───────────────────────────────────────────────────────────────────────────
// Developer hooks for later integration
// ───────────────────────────────────────────────────────────────────────────
//
// 1) GOOGLE AUTH
//    The "Google로 시작하기" button currently flips a local demo flag.
//    To wire real Google Sign-In, enable Lovable Cloud, then either use the
//    managed Sign in with Google provider OR a Google App User Connector.
//    Replace `handleGoogleLogin` below with the real auth call — the UI is
//    already structured so logged-in state (chip + gated form) needs no redesign.
//
// 2) GOOGLE SHEETS WEBHOOK
//    `submitRequest` POSTs the form JSON to a Google Apps Script Web App URL.
//    Store the URL as a secret (Project Settings → Secrets) and read it inside
//    a `createServerFn` handler — never inline the webhook URL or credentials
//    in the client bundle. For this prototype the call is a no-op when empty.
const GOOGLE_SHEETS_WEBHOOK_URL = ""; // TODO: set via server-side secret

type RequestForm = {
  name: string;
  phone: string;
  url: string;
};

async function submitRequest(data: RequestForm): Promise<void> {
  // Production: proxy this through a createServerFn that reads the webhook URL
  // from process.env and forwards the JSON. Kept client-side only for the demo.
  if (!GOOGLE_SHEETS_WEBHOOK_URL) return;
  await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
  });
}

// ───────────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────────
function OwnStreetPage() {
  // Demo auth state. Replace with real Supabase/Google session later.
  const [user, setUser] = useState<{ name: string } | null>(null);

  // Form state
  const [form, setForm] = useState<RequestForm>({ name: "", phone: "", url: "" });
  const [errors, setErrors] = useState<Partial<RequestForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState<string | null>(null);

  function handleGoogleLogin() {
    // Demo only. Swap for: await supabase.auth.signInWithIdToken(...) or the
    // managed Sign in with Google flow once Lovable Cloud is enabled.
    setUser({ name: "김오운" });
  }

  function handleSignOut() {
    setUser(null);
  }

  function validate(): boolean {
    const next: Partial<RequestForm> = {};
    if (!form.name.trim()) next.name = "이름을 입력해주세요.";
    const digits = form.phone.replace(/[^0-9]/g, "");
    if (!form.phone.trim()) next.phone = "전화번호를 입력해주세요.";
    else if (digits.length < 10 || digits.length > 11)
      next.phone = "올바른 전화번호를 입력해주세요.";
    if (!form.url.trim()) next.url = "URL을 입력해주세요.";
    else if (!/^https?:\/\/.+\..+/i.test(form.url.trim()))
      next.url = "올바른 URL 형식(http/https)을 입력해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitRequest(form);
      // Demo request number: OS-NNNN
      const num = `OS-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      setComplete(num);
      setForm({ name: "", phone: "", url: "" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero user={user} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} />
      <CustomRequest
        form={form}
        setForm={setForm}
        errors={errors}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
      <ProductInfo />
      <SiteFooter />
      {complete && <CompleteModal number={complete} onClose={() => setComplete(null)} />}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// 1) HERO / LOGIN
// ───────────────────────────────────────────────────────────────────────────
function Hero({
  user,
  onGoogleLogin,
  onSignOut,
}: {
  user: { name: string } | null;
  onGoogleLogin: () => void;
  onSignOut: () => void;
}) {
  return (
    <header className="border-b-2 border-foreground">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-8">
        <span className="font-display text-xl tracking-wide">OWN STREET</span>
        {user ? (
          <UserChip name={user.name} onSignOut={onSignOut} />
        ) : (
          <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
            KR / CUSTOM TEE
          </span>
        )}
      </div>

      <div className="px-4 pb-12 pt-10 sm:px-8 sm:pb-20 sm:pt-20">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-accent">
          YOUR IMAGE. YOUR STREET.
        </p>
        <h1 className="mt-3 font-display text-6xl leading-[0.9] sm:text-8xl">
          OWN
          <br />
          STREET
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed">
          원하는 이미지의 URL을 보내주세요.
          <br />
          나머지는 우리가 준비합니다.
        </p>

        <div className="mt-8">
          {user ? (
            <div className="inline-flex items-center border-2 border-foreground bg-accent px-6 py-3 shadow-brutal">
              <span className="font-display text-sm uppercase tracking-wider text-accent-foreground">
                접수 가능
              </span>
            </div>
          ) : (
            <button
              onClick={onGoogleLogin}
              className="inline-flex items-center gap-3 border-2 border-foreground bg-background px-6 py-3 shadow-brutal transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-secondary"
            >
              <GoogleIcon />
              <span className="font-display text-sm uppercase tracking-wider">
                Google로 시작하기
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function UserChip({ name, onSignOut }: { name: string; onSignOut: () => void }) {
  return (
    <div className="inline-flex items-center gap-2 border-2 border-foreground bg-accent px-3 py-1.5 shadow-brutal-sm">
      <span className="grid h-6 w-6 place-items-center bg-accent-foreground font-display text-xs text-accent">
        {name.slice(0, 1)}
      </span>
      <span className="text-sm font-semibold">{name}</span>
      <button
        onClick={onSignOut}
        className="ml-1 font-display text-xs uppercase tracking-wider text-accent-foreground/80 hover:text-accent-foreground"
        aria-label="로그아웃"
      >
        ✕
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.93 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// 2) CUSTOM REQUEST FORM
// ───────────────────────────────────────────────────────────────────────────
function CustomRequest({
  form,
  setForm,
  errors,
  submitting,
  onSubmit,
}: {
  form: RequestForm;
  setForm: (f: RequestForm) => void;
  errors: Partial<RequestForm>;
  submitting: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  const update = (k: keyof RequestForm) => (e: FormEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.currentTarget.value });

  return (
    <section id="request" className="border-b-2 border-foreground px-4 py-14 sm:px-8 sm:py-20">
      <SectionLabel num="01" title="CUSTOM REQUEST" />
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        아래 세 항목만 입력해주세요. 접수 후 안내드립니다.
      </p>

      <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-5" noValidate>
        <Field label="이름" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={update("name")}
            placeholder="홍길동"
            className="own-input"
          />
        </Field>

        <Field label="전화번호" error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="010-0000-0000"
            className="own-input"
          />
        </Field>

        <Field label="URL" error={errors.url}>
          <input
            type="url"
            value={form.url}
            onChange={update("url")}
            placeholder="https://..."
            className="own-input"
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full border-2 border-foreground bg-accent px-6 py-4 shadow-brutal font-display text-lg uppercase tracking-wider text-accent-foreground transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
        >
          {submitting ? "REQUESTING…" : "REQUEST"}
        </button>
      </form>

      <style>{`
        .own-input {
          width: 100%;
          border: 2px solid var(--color-foreground);
          background: var(--color-card);
          color: var(--color-foreground);
          padding: 0.75rem 0.9rem;
          font-size: 1rem;
          outline: none;
        }
        .own-input:focus {
          box-shadow: 3px 3px 0 0 var(--color-accent);
          border-color: var(--color-foreground);
        }
        .own-input::placeholder { color: var(--color-muted-foreground); }
      `}</style>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-sm text-destructive">{error}</span>}
    </label>
  );
}

function CompleteModal({ number, onClose }: { number: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm border-2 border-foreground bg-background p-8 shadow-brutal-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-accent" />
          <span className="font-display text-xs uppercase tracking-widest text-accent">
            REQUEST COMPLETE
          </span>
        </div>
        <h2 className="mt-4 font-display text-3xl leading-tight">접수가 완료되었습니다.</h2>
        <p className="mt-4 text-sm text-muted-foreground">접수 번호</p>
        <p className="font-display text-4xl tracking-wider">{number}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full border-2 border-foreground bg-foreground px-6 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground transition-transform active:translate-x-1 active:translate-y-1"
        >
          확인
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// 3) PRODUCT / CUSTOM INFO (accordions)
// ───────────────────────────────────────────────────────────────────────────
function ProductInfo() {
  return (
    <section className="border-b-2 border-foreground px-4 py-14 sm:px-8 sm:py-20">
      <SectionLabel num="02" title="PRODUCT / CUSTOM INFO" />
      <div className="mt-8 max-w-2xl divide-y-2 divide-foreground border-y-2 border-foreground">
        <Accordion title="SIZE">
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL"].map((s) => (
              <span
                key={s}
                className="border-2 border-foreground px-4 py-2 font-display text-lg"
              >
                {s}
              </span>
            ))}
          </div>
          <table className="mt-5 w-full border-2 border-foreground text-sm">
            <thead>
              <tr className="border-b-2 border-foreground bg-secondary">
                <th className="border-r-2 border-foreground px-3 py-2 text-left">SIZE</th>
                <th className="border-r-2 border-foreground px-3 py-2 text-left">가슴(cm)</th>
                <th className="px-3 py-2 text-left">기장(cm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["S", "50", "68"],
                ["M", "53", "70"],
                ["L", "56", "72"],
                ["XL", "59", "74"],
              ].map((row) => (
                <tr key={row[0]} className="border-b-2 border-foreground last:border-b-0">
                  <td className="border-r-2 border-foreground px-3 py-2 font-display">{row[0]}</td>
                  <td className="border-r-2 border-foreground px-3 py-2">{row[1]}</td>
                  <td className="px-3 py-2">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">* 실측 기준, 측정 방법에 따라 ±1~2cm 오차 가능.</p>
        </Accordion>

        <Accordion title="QUALITY">
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>• 소재: 면 100% (코마사 30수/40수 단면면)</li>
            <li>• 원단: 내구성 높은 신축성 니트 원단, 촉감 부드러움</li>
            <li>• 프린팅 방식: DTG(직접 프린트) / 엠보싱 / 실리콘 프린트 선택 가능</li>
          </ul>
        </Accordion>

        <Accordion title="CARE">
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>• 30도 이하 미지근한 물에 뒤집어서 단독 세탁</li>
            <li>• 표백제 사용 금지 / 드라이클리닝 금지</li>
            <li>• 직사광선 건조 피함, 그늘에서 건조 권장</li>
            <li>• 다림질 시 프린트 부분 피하기</li>
          </ul>
        </Accordion>

        <Accordion title="CUSTOM GUIDE">
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>• URL 제출: 이미지가 열리는 공개 링크만 전달 (구글 드라이브 공유 링크 등)</li>
            <li>• 권장 품질: 1500px 이상, 300dpi 권장 / PNG, JPG</li>
            <li>• 제작 범위: 앞/뒤 단일 프린트, 최대 A3 사이즈</li>
          </ul>
        </Accordion>

        <Accordion title="COPYRIGHT / NOTICE">
          <ul className="space-y-2 text-sm leading-relaxed">
            <li>• 사용 권한: 제출한 이미지의 사용 권한은 신청자에게 있으며, 타인 저작권 침해 시 책임은 신청자에게 있습니다.</li>
            <li>• 교환/환불: 주문 제작 상품 특성상 단순 변심 불가, 불량 시 재제작 또는 환불</li>
            <li>• 제작 시 오차: 인쇄 위치·색상 ±5% 내외, 원단 봉제 미세 오차 발생 가능</li>
          </ul>
        </Accordion>
      </div>
    </section>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between px-1 py-4">
        <span className="font-display text-lg uppercase tracking-wider">{title}</span>
        <span className="font-display text-xl leading-none transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-1 pb-6">{children}</div>
    </details>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// 4) FOOTER
// ───────────────────────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="px-4 py-12 sm:px-8">
      <div className="flex flex-wrap gap-x-6 gap-y-2 font-display text-sm uppercase tracking-wider">
        <span className="cursor-pointer hover:text-accent">Privacy</span>
        <span className="cursor-pointer hover:text-accent">Terms</span>
        <span className="cursor-pointer hover:text-accent">Contact</span>
      </div>
      <div className="mt-6 border-t-2 border-foreground pt-4 font-display text-xs uppercase tracking-widest text-muted-foreground">
        © OWN STREET
      </div>
    </footer>
  );
}

// shared section label
function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-display text-sm text-accent">{num}</span>
      <span className="font-display text-2xl uppercase tracking-wider sm:text-3xl">{title}</span>
    </div>
  );
}
