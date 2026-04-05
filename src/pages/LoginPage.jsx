import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Loader2,
  Lock,
  Mail,
  Monitor,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck
} from "lucide-react";
import { loginStaffUser, registerStaffUser } from "../lib/api";
import { getStaffAvatarTone, getStaffInitials } from "../lib/staffProfile";

const domains = [
  { id: "specialist", label: "客服专员" },
  { id: "strategist", label: "知识运营" },
  { id: "director", label: "产品策略" }
];

const icons = {
  specialist: <UserCheck size={15} strokeWidth={2} />,
  strategist: <ShieldCheck size={15} strokeWidth={2} />,
  director: <BarChart3 size={15} strokeWidth={2} />
};

const INITIAL_FORM = {
  name: "",
  email: "",
  password: ""
};

const SEEDED_ACCOUNTS = [
  {
    name: "Felix Chen",
    email: "cs@luminaire.ai",
    password: "Luminaire@2026",
    role: "specialist",
    title: "客服专员"
  },
  {
    name: "Luna Zhang",
    email: "ops@luminaire.ai",
    password: "Luminaire@2026",
    role: "strategist",
    title: "知识运营"
  },
  {
    name: "Sophie Lin",
    email: "pm@luminaire.ai",
    password: "Luminaire@2026",
    role: "director",
    title: "产品策略"
  }
];

export default function LoginPage({ onLogin, onOpenDemo }) {
  const [mode, setMode] = useState("login");
  const [activeDomain, setActiveDomain] = useState("specialist");
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const payload =
        mode === "register"
          ? await registerStaffUser({
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
              role: activeDomain
            })
          : await loginStaffUser({
              email: form.email.trim(),
              password: form.password,
              role: activeDomain
            });

      setForm(INITIAL_FORM);
      if (payload?.user && onLogin) {
        onLogin(payload.user);
      }
    } catch (error) {
      setErrorMessage(error.message || (mode === "register" ? "注册失败，请稍后重试。" : "登录失败，请稍后重试。"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#FDFCFA] font-sans antialiased text-[#1A1A1A]">
      <div className="relative hidden h-screen w-[45%] flex-col justify-between overflow-hidden bg-[#0D2B1F] p-16 lg:flex xl:p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D2B1F] via-[#091D15] to-[#05100B]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay" />

        <div className="relative z-10">
          <div className="mb-24 flex items-center gap-3 text-white">
            <Sparkles size={20} strokeWidth={1.5} className="text-[#E5E1D8]" />
            <span className="text-[13px] font-medium uppercase tracking-[0.3em] text-[#E5E1D8]">
              Luminaire AI
            </span>
          </div>

          <h1 className="mb-8 font-serif text-[42px] leading-[1.25] tracking-wide text-white lg:text-[48px]">
            以智能，
            <br />
            演绎非凡服务的艺术。
          </h1>
          <p className="max-w-[380px] text-[15px] font-light leading-[1.8] tracking-wide text-white/60">
            将 AI 的精准与人性化温度融入时尚电商客服场景，打造兼具效率、审美与服务感的内部工作台。
          </p>
        </div>

        <div className="relative z-10 text-[11px] font-light uppercase tracking-[0.2em] text-white/30">
          © 2026 Luminaire Technology · Internal Platform
        </div>
      </div>

      <div className="relative flex h-screen flex-1 flex-col items-center justify-center px-8 sm:px-16">
        <div className="absolute right-12 top-12 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8C8C8C]">
          Internal Workspace
        </div>

        <div className="w-full max-w-[360px]">
          <div className="mb-8 flex rounded-full border border-[#E6E5E1] bg-white p-1 shadow-sm">
            {[
              ["login", "账号登录"],
              ["register", "创建账号"]
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setMode(id);
                  setErrorMessage("");
                }}
                className={`flex-1 rounded-full px-4 py-2 text-[12px] font-semibold tracking-wide transition-all ${
                  mode === id ? "bg-[#0D2B1F] text-white" : "text-[#8C8C8C] hover:text-[#1A1A1A]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <header className="mb-10">
            <h2 className="mb-3 font-serif text-[32px] tracking-tight text-[#1A1A1A]">
              {mode === "register" ? "创建内部账号" : "欢迎回来"}
            </h2>
            <p className="text-[13px] tracking-wide text-[#8C8C8C]">
              {mode === "register"
                ? "创建数据库内部账号后，会按角色自动进入对应工作台"
                : "请选择您的工作域，并使用数据库内的内部账号登录"}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C8C8C]">
                Select Domain
              </span>
              <div className="flex rounded-md bg-[#F2F1EE] p-1">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => setActiveDomain(domain.id)}
                    className={`flex-1 rounded-[4px] py-2.5 text-[13px] font-medium transition-all duration-300 ${
                      activeDomain === domain.id
                        ? "bg-white text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                        : "text-[#8C8C8C] hover:text-[#1A1A1A]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {icons[domain.id]}
                      {domain.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-[12px] leading-relaxed text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="space-y-6 pt-2">
              {mode === "register" && (
                <div className="group relative border-b border-[#E6E5E1] pb-2 transition-colors duration-300 focus-within:border-[#0D2B1F]">
                  <div className="flex items-center gap-3">
                    <User
                      size={18}
                      strokeWidth={1.5}
                      className="text-[#B3B3B3] transition-colors duration-300 group-focus-within:text-[#0D2B1F]"
                    />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(event) => updateForm("name", event.target.value)}
                      placeholder="员工姓名 (Name)"
                      className="w-full bg-transparent py-1.5 text-[14px] text-[#1A1A1A] outline-none placeholder:font-light placeholder:text-[#B3B3B3]"
                    />
                  </div>
                </div>
              )}

              <div className="group relative border-b border-[#E6E5E1] pb-2 transition-colors duration-300 focus-within:border-[#0D2B1F]">
                <div className="flex items-center gap-3">
                  <Mail
                    size={18}
                    strokeWidth={1.5}
                    className="text-[#B3B3B3] transition-colors duration-300 group-focus-within:text-[#0D2B1F]"
                  />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                    placeholder="企业邮箱 (Email)"
                    className="w-full bg-transparent py-1.5 text-[14px] text-[#1A1A1A] outline-none placeholder:font-light placeholder:text-[#B3B3B3]"
                  />
                </div>
              </div>

              <div className="group relative border-b border-[#E6E5E1] pb-2 transition-colors duration-300 focus-within:border-[#0D2B1F]">
                <div className="flex items-center gap-3">
                  <Lock
                    size={18}
                    strokeWidth={1.5}
                    className="text-[#B3B3B3] transition-colors duration-300 group-focus-within:text-[#0D2B1F]"
                  />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(event) => updateForm("password", event.target.value)}
                    placeholder={mode === "register" ? "设置密码 (至少 8 位)" : "访问密码 (Password)"}
                    className="w-full bg-transparent py-1.5 text-[14px] text-[#1A1A1A] outline-none placeholder:font-light placeholder:text-[#B3B3B3]"
                  />
                </div>
              </div>
            </div>

            {mode === "login" ? (
              <div className="flex items-center justify-between text-[13px] text-[#8C8C8C]">
                <label className="flex cursor-pointer items-center gap-2 transition-colors hover:text-[#1A1A1A]">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-3.5 w-3.5 cursor-pointer rounded-sm border-[#E6E5E1] accent-[#0D2B1F]"
                  />
                  保持登录
                </label>
                <button type="button" className="transition-colors hover:text-[#1A1A1A]">
                  忘记密码？
                </button>
              </div>
            ) : (
              <p className="text-[12px] leading-relaxed text-[#8C8C8C]">
                注册完成后，系统会把账号写入数据库，并根据所选角色自动分配到对应工作台。
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-[#0D2B1F] text-white shadow-[0_4px_14px_rgba(13,43,31,0.15)] transition-all duration-300 hover:bg-[#153B2B] hover:shadow-[0_6px_20px_rgba(13,43,31,0.2)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin text-[#E5E1D8]" />
              ) : (
                <>
                  <span className="text-[13px] font-medium tracking-[0.1em]">
                    {mode === "register" ? "创建并进入工作台" : "进入控制台"}
                  </span>
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            {mode === "login" && (
              <div className="rounded-2xl border border-[#E6E5E1] bg-white px-4 py-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C8C8C]">
                    Seeded Accounts
                  </span>
                  <span className="text-[11px] text-[#8C8C8C]">统一密码：Luminaire@2026</span>
                </div>
                <div className="space-y-3">
                  {SEEDED_ACCOUNTS.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => {
                        setActiveDomain(account.role);
                        setErrorMessage("");
                        setForm({
                          name: "",
                          email: account.email,
                          password: account.password
                        });
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl border border-[#F2F1EE] px-3 py-3 text-left transition-all hover:border-[#0D2B1F] hover:bg-[#FDFCFA]"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ring-1 ${getStaffAvatarTone(account.role)}`}
                      >
                        {getStaffInitials(account.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-[13px] font-semibold text-[#1A1A1A]">
                            {account.name}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C8C8C]">
                            {account.title}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[12px] text-[#8C8C8C]">{account.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>

          <div className="mt-16 flex flex-col items-center border-t border-[#E6E5E1] pt-8">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C8C8C]">
              非内部员工？
            </p>
            <button
              type="button"
              onClick={onOpenDemo}
              className="flex items-center gap-2 rounded-full border border-[#E6E5E1] bg-transparent px-6 py-2.5 text-[12px] text-[#8C8C8C] transition-all duration-300 hover:border-[#0D2B1F] hover:text-[#0D2B1F]"
            >
              <Monitor size={14} strokeWidth={1.5} />
              <span>访问智能客服 Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
