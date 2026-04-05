import React, { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ChevronRight,
  Flag,
  ShieldAlert,
  Target,
  TrendingUp
} from "lucide-react";
import { getAnalyticsState } from "../lib/api";
import { getStaffAvatarTone, getStaffInitials } from "../lib/staffProfile";
import { fallbackAnalyticsState } from "../mockData";

export default function AnalyticsPage({ onBack, currentUser }) {
  const [analyticsState, setAnalyticsState] = useState(fallbackAnalyticsState);

  const user = currentUser ?? {
    name: "Sophie Lin",
    id: "PM-1024",
    role: "产品策略总监",
    roleKey: "director"
  };

  useEffect(() => {
    let disposed = false;

    async function loadAnalytics() {
      try {
        const data = await getAnalyticsState();
        if (!disposed && data?.stats?.length) {
          setAnalyticsState(data);
        }
      } catch (error) {
        console.warn("analytics fallback", error);
        if (!disposed) {
          setAnalyticsState(fallbackAnalyticsState);
        }
      }
    }

    loadAnalytics();
    return () => {
      disposed = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFA] font-sans text-[#1A1A1A] antialiased">
      <header className="sticky top-0 z-30 border-b border-[#E6E5E1] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-10">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={onBack}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#E6E5E1] transition-all hover:border-[#0D2B1F] hover:bg-[#FDFCFA]"
            >
              <ArrowLeft
                size={18}
                className="text-[#8C8C8C] transition-colors group-hover:text-[#0D2B1F]"
              />
            </button>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0D2B1F]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8C8C]">
                  Review & Insight
                </p>
              </div>
              <h1 className="font-serif text-xl font-medium tracking-tight">评测与数据看板</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-full border border-[#E6E5E1] bg-[#FDFCFA] py-1.5 pl-2 pr-5 shadow-sm">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold ring-1 ${getStaffAvatarTone(user.roleKey)}`}
            >
              {getStaffInitials(user.name)}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold leading-none text-[#1A1A1A]">{user.name}</span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-[#8C8C8C]">
                {user.role} · {user.id}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-10 py-12">
        <section className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {analyticsState.stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`group relative overflow-hidden rounded-sm border p-8 transition-all duration-500 ${
                stat.label.includes("转人工率") || stat.label.toLowerCase().includes("bad case")
                  ? "border-[#0D2B1F] bg-[#0D2B1F] text-white shadow-lg"
                  : "border-[#E6E5E1] bg-white hover:border-[#0D2B1F]"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    stat.label.includes("转人工率") || stat.label.toLowerCase().includes("bad case")
                      ? "text-white/60"
                      : "text-[#8C8C8C]"
                  }`}
                >
                  Metric {idx + 1}
                </span>
                {stat.label.toLowerCase().includes("bad case") ? (
                  <Flag
                    size={16}
                    className={
                      stat.label.toLowerCase().includes("bad case")
                        ? "text-white/40"
                        : "text-[#0D2B1F]/20"
                    }
                  />
                ) : (
                  <TrendingUp
                    size={16}
                    className={
                      stat.label.includes("转人工率") || stat.label.toLowerCase().includes("bad case")
                        ? "text-white/40"
                        : "text-[#0D2B1F]/20"
                    }
                  />
                )}
              </div>
              <p
                className={`mb-1 text-[11px] font-bold uppercase tracking-widest ${
                  stat.label.includes("转人工率") || stat.label.toLowerCase().includes("bad case")
                    ? "text-white/80"
                    : "text-[#8C8C8C]"
                }`}
              >
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="font-serif text-4xl font-medium tracking-tighter">{stat.value}</h3>
                <span
                  className={`text-[10px] font-medium ${
                    stat.label.includes("转人工率") || stat.label.toLowerCase().includes("bad case")
                      ? "text-white/40"
                      : "text-[#B3B3B3]"
                  }`}
                >
                  {stat.delta}
                </span>
              </div>

              <span className="pointer-events-none absolute -bottom-4 -right-2 font-serif text-6xl font-black italic opacity-[0.03]">
                {stat.label.split(" ")[0]}
              </span>
            </div>
          ))}
        </section>

        <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <section className="space-y-8 lg:col-span-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-[#0D2B1F]" />
                <h3 className="font-serif text-2xl font-medium text-[#1A1A1A]">场景分布概览</h3>
              </div>
              <p className="text-[12px] leading-relaxed text-[#8C8C8C]">
                基于过去 7 天会话流量的聚类分析，反映用户核心诉求分布。
              </p>
            </div>

            <div className="space-y-6 rounded-sm border border-[#E6E5E1] bg-white p-8 shadow-sm">
              {analyticsState.scenarioDistribution.map((item) => (
                <div key={item.label} className="group space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#1A1A1A] transition-colors group-hover:text-[#0D2B1F]">
                      {item.label}
                    </span>
                    <span className="font-serif text-[13px] text-[#8C8C8C]">{item.ratio}%</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden bg-[#F2F1EE]">
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out group-hover:opacity-80 ${item.tone}`}
                      style={{ width: `${item.ratio}%` }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0D2B1F]/40">
                      Weight: {item.ratio}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8 lg:col-span-3">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={20} className="text-[#0D2B1F]" />
                  <h3 className="font-serif text-2xl font-medium text-[#1A1A1A]">Bad Case 优化记录</h3>
                </div>
                <p className="text-[12px] leading-relaxed text-[#8C8C8C]">
                  持续追踪 AI 处理失效场景，记录闭环优化动作及产出结果。
                </p>
              </div>
              <button className="text-[11px] font-bold uppercase tracking-widest text-[#0D2B1F] underline decoration-1 underline-offset-8 hover:opacity-70">
                View History
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {analyticsState.cases.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="group relative rounded-sm border border-[#E6E5E1] bg-white p-8 transition-all hover:border-[#0D2B1F] hover:shadow-md"
                >
                  <div className="mb-6 flex items-center justify-between border-b border-[#F2F1EE] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#F2F1EE] bg-[#FDFCFA]">
                        <Flag size={14} className="text-[#0D2B1F]" />
                      </div>
                      <h4 className="font-serif text-lg font-medium text-[#1A1A1A]">{item.title}</h4>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B3B3B3]">
                      CASE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C8C8C]">
                        Issue Reason
                      </p>
                      <p className="text-[13px] leading-relaxed text-[#4A4A4A]">{item.reason}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C8C8C]">
                        Optimization
                      </p>
                      <p className="text-[13px] leading-relaxed text-[#4A4A4A]">{item.action}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#0D2B1F]">
                        Result
                      </p>
                      <p className="text-[13px] font-semibold leading-relaxed text-[#0D2B1F]">{item.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="group relative mt-10 overflow-hidden rounded-sm bg-[#0D2B1F] p-1 shadow-xl">
          <div className="relative flex flex-col items-center justify-between gap-6 border border-white/10 bg-[#0D2B1F] px-10 py-10 text-white md:flex-row">
            <div className="flex items-start gap-6">
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-white/20 bg-white/10">
                <Activity size={24} className="text-white" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
                  Strategic Suggestion
                </p>
                <p className="max-w-2xl font-serif text-xl leading-relaxed text-white/95">
                  {analyticsState.nextAction}
                </p>
              </div>
            </div>

            <button className="whitespace-nowrap rounded-sm bg-white px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-[#0D2B1F] shadow-lg transition-all hover:bg-[#F2F1EE] active:scale-95">
              查看深度评估报告
            </button>
          </div>

          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent" />
        </section>
      </main>

      <footer className="mx-auto max-w-[1440px] px-10 py-12 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#B3B3B3]">
          Luminaire Internal Operations Center © 2024
        </p>
      </footer>
    </div>
  );
}
