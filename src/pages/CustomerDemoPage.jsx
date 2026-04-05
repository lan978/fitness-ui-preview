import React, { useMemo, useState } from "react";
import { ArrowLeft, Bot, PackageSearch, RefreshCcw, Send, Shirt } from "lucide-react";
import { sendDemoMessage } from "../lib/api";

const quickActions = [
  "帮我查一下订单物流",
  "这件衣服偏大还是偏小？",
  "我要申请退款",
  "收到后有轻微瑕疵怎么办？"
];

function createSessionId() {
  return `demo-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function fallbackAssistantReply(text) {
  const normalized = text.trim();
  if (!normalized) return "您好，请告诉我您遇到的问题。";
  if (normalized.includes("物流")) {
    return "已收到您的物流问题。系统会先核查订单状态和最新物流轨迹，如出现异常会建议转人工继续跟进。";
  }
  if (normalized.includes("退款")) {
    return "我会先判断您的订单状态，再给出下一步建议：待发货通常优先仅退款，已签收则更适合走退货退款。";
  }
  if (normalized.includes("尺码") || normalized.includes("偏大") || normalized.includes("偏小")) {
    return "我可以先结合商品版型、面料和常见反馈给您建议；如果您提供身高体重，会判断得更准确。";
  }
  if (normalized.includes("瑕疵") || normalized.includes("抽丝")) {
    return "我会先识别问题类型，并建议补充照片、走补偿协商或转人工复核。";
  }
  return "已收到您的问题。当前 Demo 会先识别问题类型，再结合订单、物流和售后规则给出下一步建议；复杂问题会建议转人工。";
}

export default function CustomerDemoPage({ onBack }) {
  const [sessionId] = useState(() => createSessionId());
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "您好，欢迎来到智能客服 Demo。我可以帮您处理商品咨询、订单物流、售后建议和转人工前的基础判断。"
    }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const introCards = useMemo(
    () => [
      {
        title: "商品咨询",
        text: "材质、版型、尺码、洗护说明、穿搭卖点"
      },
      {
        title: "订单与物流",
        text: "查订单、查物流、催发货、异常物流识别"
      },
      {
        title: "售后建议",
        text: "判断退款、退货退款、换货路径，并提示下一步操作"
      }
    ],
    []
  );

  async function handleSend(content) {
    const text = (content ?? input).trim();
    if (!text || isSending) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsSending(true);

    try {
      const result = await sendDemoMessage(sessionId, text);
      setMessages((prev) => [...prev, { role: "assistant", text: result.reply || fallbackAssistantReply(text) }]);
    } catch (error) {
      console.warn("demo fallback", error);
      setMessages((prev) => [...prev, { role: "assistant", text: fallbackAssistantReply(text) }]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A]">
      <header className="border-b border-[#E5E3DF] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-[#1E352B] hover:text-[#1E352B]"
            >
              <ArrowLeft size={14} />
              返回登录
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#1E352B]">用户端智能客服 Demo</h1>
              <p className="text-xs text-slate-400">
                展示商品咨询、订单查询、售后建议与人工兜底前的用户体验。
              </p>
            </div>
          </div>
          <div className="rounded-full bg-[#1E352B] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Customer View
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 p-8">
        <section className="col-span-4 rounded-[28px] bg-[#1E352B] p-8 text-white shadow-soft">
          <div className="mb-10 flex items-center gap-3">
            <Bot size={22} />
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">LUMINAIRE AI</span>
          </div>
          <h2 className="max-w-sm font-serif text-5xl leading-[1.1]">
            更快回答，
            <br />
            更稳处理，
            <br />
            更懂服务。
          </h2>
          <p className="mt-8 max-w-md text-sm leading-7 text-white/70">
            面向电商用户的智能客服入口，优先自动承接商品咨询、订单物流与基础售后判断；复杂问题则通过规则与风控识别转入人工协同。
          </p>

          <div className="mt-10 space-y-4">
            {introCards.map((card, index) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  {index === 0 ? <Shirt size={16} /> : index === 1 ? <PackageSearch size={16} /> : <RefreshCcw size={16} />}
                  {card.title}
                </div>
                <p className="text-xs leading-6 text-white/65">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-8 rounded-[28px] border border-[#E5E3DF] bg-white shadow-soft">
          <div className="border-b border-[#F0ECE4] px-8 py-6">
            <h3 className="text-lg font-bold text-[#1E352B]">智能客服会话</h3>
            <p className="mt-1 text-sm text-slate-400">
              当前 Demo 会展示 AI 处理基础问题，并在复杂场景给出下一步建议或转人工指引。
            </p>
          </div>

          <div className="flex flex-wrap gap-3 border-b border-[#F0ECE4] px-8 py-4">
            {quickActions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSend(item)}
                className="rounded-full border border-[#E5E3DF] px-4 py-2 text-xs text-slate-600 transition hover:border-[#1E352B] hover:text-[#1E352B]"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="space-y-5 px-8 py-6">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                    message.role === "assistant"
                      ? "bg-[#F5F2EA] text-slate-700"
                      : "bg-[#1E352B] text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F0ECE4] px-8 py-6">
            <div className="relative">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="请输入您的问题，例如：这单为什么还没发货？"
                className="h-28 w-full resize-none rounded-2xl border border-[#E5E3DF] px-4 py-4 pr-16 text-sm outline-none transition focus:border-[#1E352B] focus:ring-1 focus:ring-[#1E352B]"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isSending}
                className="absolute bottom-4 right-4 rounded-xl bg-[#1E352B] p-3 text-white transition hover:opacity-90 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
