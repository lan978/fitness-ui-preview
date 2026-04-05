import React, { useEffect, useMemo, useState } from "react";
import {
  Clock,
  MessageCircle,
  Package,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  TrendingUp,
  UserPlus,
  Wand2
} from "lucide-react";
import {
  claimWorkspaceConversation,
  getWorkspaceState,
  polishWorkspaceReply,
  transferWorkspaceConversation
} from "../lib/api";
import { getStaffAvatarTone, getStaffInitials } from "../lib/staffProfile";
import { fallbackWorkspaceState } from "../mockData";

const TABS = [
  ["mine", "我的会话"],
  ["pending", "待接单"],
  ["ticketed", "已转工单"]
];

function initials(name) {
  return String(name || "客服")
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0] || "")
    .join("")
    .toUpperCase();
}

function tabOf(item, agentName) {
  if (item.queueStatus === "pending") return "pending";
  if (item.queueStatus === "transferred") return "ticketed";
  return item.assignee === agentName ? "mine" : "claimed";
}

function queueLabel(item, agentName) {
  if (item.queueStatus === "pending") return item.queueHint || "待接单";
  if (item.queueStatus === "transferred") return item.queueHint || "已转工单";
  return item.assignee === agentName ? `已接单 · ${agentName}` : item.queueHint || `由 ${item.assignee} 处理中`;
}

function nowClock() {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

export default function WorkspacePage({ onBack, currentUser }) {
  const [workspaceState, setWorkspaceState] = useState(fallbackWorkspaceState);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState("");
  const [transferringId, setTransferringId] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);

  const agent = currentUser ?? workspaceState.agent ?? fallbackWorkspaceState.agent;
  const conversations = workspaceState.conversations ?? [];

  useEffect(() => {
    let disposed = false;
    async function loadWorkspace() {
      try {
        const data = await getWorkspaceState();
        if (!disposed && data?.conversations) setWorkspaceState(data);
      } catch (error) {
        console.warn("workspace fallback", error);
        if (!disposed) setWorkspaceState(fallbackWorkspaceState);
      } finally {
        if (!disposed) setIsLoading(false);
      }
    }
    loadWorkspace();
    return () => {
      disposed = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      mine: conversations.filter((item) => tabOf(item, agent.name) === "mine").length,
      pending: conversations.filter((item) => tabOf(item, agent.name) === "pending").length,
      ticketed: conversations.filter((item) => tabOf(item, agent.name) === "ticketed").length
    }),
    [agent.name, conversations]
  );

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return conversations.filter((item) => {
      if (tabOf(item, agent.name) !== activeTab) return false;
      if (!query) return true;
      return (
        String(item.name || "").toLowerCase().includes(query) ||
        String(item.message || "").toLowerCase().includes(query) ||
        String(item.order?.id || "").toLowerCase().includes(query) ||
        String(item.order?.product || "").toLowerCase().includes(query)
      );
    });
  }, [activeTab, agent.name, conversations, searchQuery]);

  const selected = useMemo(
    () => filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId]
  );

  useEffect(() => {
    if (isLoading || filtered.length) return;
    const nextTab = counts.pending ? "pending" : counts.mine ? "mine" : counts.ticketed ? "ticketed" : "pending";
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [activeTab, counts.mine, counts.pending, counts.ticketed, filtered.length, isLoading]);

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
    if (!selected && selectedId) setSelectedId("");
  }, [selected, selectedId]);

  const canReply = selected?.queueStatus === "inProgress" && selected?.assignee === agent.name;

  async function handleClaim(id) {
    setClaimingId(id);
    try {
      const result = await claimWorkspaceConversation(id);
      if (result?.state?.conversations) {
        setWorkspaceState(result.state);
        setActiveTab("mine");
        setSelectedId(id);
      }
    } catch (error) {
      console.error("workspace claim error", error);
    } finally {
      setClaimingId("");
    }
  }

  async function handleTransfer(id) {
    setTransferringId(id);
    try {
      const result = await transferWorkspaceConversation(id);
      if (result?.state?.conversations) {
        setWorkspaceState(result.state);
        setActiveTab("ticketed");
        setSelectedId(id);
      }
    } catch (error) {
      console.error("workspace transfer error", error);
    } finally {
      setTransferringId("");
    }
  }

  async function handlePolish() {
    if (!inputText.trim()) return;
    setIsPolishing(true);
    try {
      const result = await polishWorkspaceReply(inputText.trim());
      if (result?.reply) setInputText(result.reply);
    } catch (error) {
      console.error("workspace polish error", error);
    } finally {
      setIsPolishing(false);
    }
  }

  function handleSend() {
    if (!selected || !canReply || !inputText.trim()) return;
    const message = inputText.trim();
    const time = nowClock();
    setWorkspaceState((current) => ({
      ...current,
      conversations: current.conversations.map((item) =>
        item.id !== selected.id
          ? item
          : {
              ...item,
              message,
              time,
              messages: [...(item.messages || []), { type: "agent", content: message, time }]
            }
      )
    }));
    setInputText("");
  }

  return (
    <div className="flex h-screen flex-col bg-[#FDFCFA] font-sans text-[#1A1A1A] antialiased">
      <header className="flex h-16 items-center justify-between border-b border-[#E6E5E1] bg-white px-8">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[#0D2B1F]" size={20} strokeWidth={1.5} />
            <span className="font-serif text-[18px] font-medium tracking-wide">Luminaire Workspace</span>
          </div>
          <div className="h-6 w-px bg-[#E6E5E1]" />
          <div className="flex items-center gap-8">
            <div><div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8C8C8C]">Global SLA</div><div className="text-[13px] font-medium text-[#0D2B1F]">99.8%</div></div>
            <div><div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8C8C8C]">Active Queue</div><div className="flex items-center gap-1.5 text-[13px] font-medium">{conversations.length}<TrendingUp size={12} className="text-green-600" /></div></div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="group relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B3B3B3]" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索订单、客户或知识库..." className="w-72 rounded-sm border border-[#E6E5E1] bg-[#FDFCFA] py-2 pl-10 pr-4 text-[13px] outline-none focus:border-[#0D2B1F] focus:ring-1 focus:ring-[#0D2B1F]/5" />
          </div>
          <div className="flex items-center gap-3 rounded-full border border-[#E6E5E1] bg-[#FDFCFA] py-1.5 pl-2 pr-4 shadow-sm">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold ring-1 ${getStaffAvatarTone(agent.roleKey)}`}
            >
              {getStaffInitials(agent.name)}
            </div>
            <div className="flex flex-col">
              <div className="text-[12px] font-semibold">{agent.name}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-[#8C8C8C]">
                {agent.role} · {agent.id}
              </div>
            </div>
          </div>
          <button onClick={onBack} className="rounded-full border border-[#E6E5E1] px-4 py-2 text-[12px] font-medium text-[#8C8C8C] transition-all hover:border-[#0D2B1F] hover:text-[#0D2B1F]">退出登录</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-[360px] flex-col border-r border-[#E6E5E1] bg-white">
          <div className="flex border-b border-[#E6E5E1] px-4 pt-4">
            {TABS.map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`relative flex-1 pb-3 text-[12px] font-semibold tracking-wide ${activeTab === id ? "text-[#0D2B1F]" : "text-[#B3B3B3]"}`}>
                {label}
                <span className="ml-2 rounded-full bg-[#F2F1EE] px-2 py-0.5 text-[10px] text-[#1A1A1A]">{counts[id]}</span>
                {activeTab === id && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#0D2B1F]" />}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? <div className="px-6 py-16 text-center text-[13px] text-[#8C8C8C]">正在加载工单队列...</div> : filtered.length ? filtered.map((item) => {
              const isVip = ["V3", "V4"].includes(String(item.order?.level || ""));
              return (
                <div key={item.id} onClick={() => setSelectedId(item.id)} className={`cursor-pointer border-b border-[#F2F1EE] p-5 transition-all hover:bg-[#FDFCFA] ${selected?.id === item.id ? "bg-[#FDFCFA]" : ""}`}>
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F1EE] font-serif text-[13px]">{initials(item.name)}</div>
                      <div>
                        <div className="flex items-center gap-2"><span className="text-[14px] font-medium">{item.name}</span>{isVip && <ShieldCheck size={12} className="text-[#9E8B5E]" />}</div>
                        <span className="text-[11px] font-medium uppercase tracking-tighter text-[#B3B3B3]">{item.order?.profile || "待识别客群"}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#8C8C8C]">{item.time}</span>
                  </div>
                  <p className={`mt-3 line-clamp-2 text-[13px] leading-relaxed ${item.queueStatus === "pending" ? "font-medium" : "text-[#8C8C8C]"}`}>{item.message}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {item.sla === "urgent" && <span className="flex items-center gap-1.5 rounded-sm bg-red-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600"><Clock size={10} strokeWidth={2.5} />SLA Urgent</span>}
                    {item.tags?.includes("高风险") && <span className="rounded-sm bg-[#F9F6ED] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#9E8B5E]">Priority</span>}
                    <span className="rounded-sm bg-[#F2F1EE] px-2 py-1 text-[10px] font-medium text-[#6A6A6A]">{queueLabel(item, agent.name)}</span>
                  </div>
                  {item.queueStatus === "pending" && <div className="mt-3 flex justify-end"><button onClick={(e) => { e.stopPropagation(); handleClaim(item.id); }} disabled={claimingId === item.id} className="inline-flex items-center gap-1 rounded-sm bg-[#0D2B1F] px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-60"><UserPlus size={12} />{claimingId === item.id ? "接单中..." : "立即接单"}</button></div>}
                </div>
              );
            }) : <div className="px-6 py-16 text-center text-[13px] text-[#8C8C8C]">当前队列暂无会话。</div>}
          </div>
        </aside>

        <main className="flex flex-1 flex-col bg-[#FDFCFA]">
          {selected ? (
            <>
              <div className="flex h-[88px] items-center justify-between border-b border-[#E6E5E1] bg-white px-8">
                <div className="flex items-center gap-4">
                  <div className="relative"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F1EE] font-serif text-[15px]">{initials(selected.name)}</div><div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" /></div>
                  <div>
                    <div className="flex items-center gap-2"><h2 className="font-serif text-[20px] tracking-tight">{selected.name}</h2><span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9E8B5E]">{selected.order?.level || "V1"}</span></div>
                    <div className="flex items-center gap-2 text-[12px] text-[#8C8C8C]"><span>订单编号: {selected.order?.id || "待补充"}</span><span>·</span><span>{selected.queueStatus === "inProgress" && selected.assignee === agent.name ? `接单时间 ${selected.assignedAt || "刚刚"}` : queueLabel(selected, agent.name)}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {selected.queueStatus === "pending" && <button onClick={() => handleClaim(selected.id)} disabled={claimingId === selected.id} className="flex items-center gap-2 rounded-sm bg-[#0D2B1F] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60"><UserPlus size={14} />{claimingId === selected.id ? "接单中..." : "立即接单"}</button>}
                  {selected.queueStatus === "inProgress" && selected.assignee === agent.name && <span className="rounded-sm bg-green-50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-green-700">当前处理中</span>}
                  {selected.queueStatus === "transferred" && <span className="rounded-sm bg-[#F2F1EE] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#6A6A6A]">已转工单</span>}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-10 py-8">
                {selected.queueStatus === "pending" && <div className="mb-8 rounded-sm border border-[#E6E5E1] bg-white px-5 py-4 text-[13px] text-[#6A6A6A]">当前会话仍在待接单队列。点击 <span className="font-semibold text-[#0D2B1F]">立即接单</span> 后，才可以继续回复客户。</div>}
                <div className="mb-10 flex items-center justify-center gap-4"><div className="h-px flex-1 bg-[#F2F1EE]" /><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B3B3B3]">Conversation Started · Today</span><div className="h-px flex-1 bg-[#F2F1EE]" /></div>
                <div className="space-y-10">
                  {(selected.messages || []).map((message, index) => message.type === "system" ? (
                    <div key={`${selected.id}-${index}`} className="flex justify-center"><div className="rounded-full border border-[#E6E5E1] bg-white px-4 py-2 text-[11px] text-[#8C8C8C] shadow-sm">{message.content}</div></div>
                  ) : (
                    <div key={`${selected.id}-${index}`} className={`flex ${message.type === "agent" ? "justify-end" : "justify-start"}`}>
                      <div className="flex max-w-[70%] flex-col gap-1.5">
                        <div className={`px-5 py-4 text-[14px] leading-[1.7] shadow-sm ${message.type === "agent" ? "rounded-2xl rounded-tr-none bg-[#0D2B1F] text-white" : "rounded-2xl rounded-tl-none border border-[#E6E5E1] bg-white"}`}>{message.content}</div>
                        <span className={`text-[10px] text-[#B3B3B3] ${message.type === "agent" ? "text-right" : ""}`}>{message.time} {message.type === "agent" && "· 已读"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#E6E5E1] bg-white p-6">
                <div className={`relative flex flex-col overflow-hidden rounded-sm border bg-[#FDFCFA] ${canReply ? "border-[#E6E5E1] focus-within:border-[#0D2B1F] focus-within:ring-4 focus-within:ring-[#0D2B1F]/5" : "border-[#E6E5E1]/70 opacity-80"}`}>
                  <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={!canReply} placeholder={canReply ? "在此输入您的回复... (按 '/' 唤起 AI 建议)" : selected.queueStatus === "pending" ? "请先接单，再继续回复客户..." : "该会话已转工单，当前仅支持查看处理记录。"} className="w-full resize-none bg-transparent p-4 text-[14px] leading-relaxed outline-none placeholder:text-[#B3B3B3] disabled:cursor-not-allowed" rows={4} />
                  <div className="flex items-center justify-between border-t border-[#F2F1EE] bg-white px-4 py-3">
                    <div className="flex items-center gap-5 text-[#8C8C8C]">
                      <button disabled={!canReply} className="flex items-center gap-1.5 disabled:opacity-50"><Paperclip size={16} strokeWidth={1.5} /><span className="text-[11px] font-medium">附件</span></button>
                      <button disabled={!canReply} className="flex items-center gap-1.5 disabled:opacity-50"><Smile size={16} strokeWidth={1.5} /><span className="text-[11px] font-medium">表情</span></button>
                      <button onClick={handlePolish} disabled={!canReply || !inputText.trim() || isPolishing} className="flex items-center gap-1.5 disabled:opacity-50"><Wand2 size={16} strokeWidth={1.5} /><span className="text-[11px] font-medium">{isPolishing ? "润色中..." : "AI 润色"}</span></button>
                    </div>
                    <button onClick={handleSend} disabled={!canReply || !inputText.trim()} className="flex items-center gap-2 rounded-sm bg-[#0D2B1F] px-8 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white disabled:bg-[#A8B2AD]"><span>{canReply ? "发送回复" : "接单后可回复"}</span><Send size={14} strokeWidth={2} /></button>
                  </div>
                </div>
              </div>
            </>
          ) : <div className="flex flex-1 items-center justify-center text-[14px] text-[#8C8C8C]">当前队列暂无可查看会话。</div>}
        </main>

        <aside className="w-[360px] space-y-6 overflow-y-auto border-l border-[#E6E5E1] bg-[#FDFCFA] p-6">
          {selected && (
            <>
              <section className="overflow-hidden rounded-sm border border-[#E6E5E1] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E6E5E1] bg-[#FDFCFA] px-4 py-3"><h3 className="font-serif text-[14px] font-medium">当前关联订单</h3><span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8C8C]">{selected.order?.id}</span></div>
                <div className="space-y-4 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-[#F2F1EE] bg-[#FDFCFA]"><Package size={24} className="text-[#8C8C8C]" strokeWidth={1} /></div>
                    <div className="flex-1 space-y-1.5">
                      <p className="font-serif text-[15px] leading-tight">{selected.order?.product || "待核实商品"}</p>
                      <p className="text-[11px] font-medium text-[#B3B3B3]">{selected.order?.profile}</p>
                      <div className="text-[11px] text-[#0D2B1F]">{selected.order?.orderStatus} · {selected.order?.logisticsStatus}</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-sm border border-[#E6E5E1] bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2.5 text-[#0D2B1F]"><Sparkles size={18} strokeWidth={1.5} /><h3 className="font-serif text-[16px] font-medium">AI 实时洞察</h3></div><span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-green-600">Active</span></div>
                <div className="space-y-4">
                  <div className="rounded-sm border border-[#F2F1EE] bg-[#FDFCFA] p-3"><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#B3B3B3]">当前诊断</p><p className="text-[13px] font-medium">{selected.diagnosis?.status}</p></div>
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-sm border border-orange-100 bg-orange-50 p-3 text-center"><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-orange-400">风险等级</p><p className="text-[13px] font-bold text-orange-600">{selected.diagnosis?.risk}</p></div>
                    <div className="flex-1 rounded-sm border border-[#E6E5E1] bg-[#F2F1EE] p-3 text-center"><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#8C8C8C]">下一步</p><p className="text-[13px] font-bold">{selected.summary?.route}</p></div>
                  </div>
                  <div className="rounded-sm border border-[#F2F1EE] bg-[#FDFCFA] p-3"><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#B3B3B3]">操作建议</p><p className="text-[13px] leading-relaxed text-[#4A4A4A]">{selected.diagnosis?.action}</p></div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8C8C]">Suggested Responses</div>
                <div className="rounded-sm border border-[#E6E5E1] bg-white p-4 text-[13px] leading-relaxed">{selected.script}</div>
                {(selected.logic || []).slice(0, 2).map((item) => <div key={item} className="rounded-sm border border-[#E6E5E1] bg-white p-4 text-[13px] leading-relaxed text-[#4A4A4A]">{item}</div>)}
              </section>

              <section className="rounded-sm border border-[#E6E5E1] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-[#8C8C8C]"><MessageCircle size={14} /><span className="text-[12px] font-medium">快捷操作</span></div>
                <div className="grid grid-cols-2 gap-3">
                  {selected.queueStatus === "pending" ? (
                    <>
                      <button onClick={() => handleClaim(selected.id)} disabled={claimingId === selected.id} className="col-span-2 rounded-sm bg-[#0D2B1F] px-3 py-2.5 text-[12px] font-medium text-white disabled:opacity-60">{claimingId === selected.id ? "接单中..." : "立即接单"}</button>
                      <button className="rounded-sm border border-[#E6E5E1] px-3 py-2 text-[12px]">标记 Bad Case</button>
                      <button className="rounded-sm border border-[#E6E5E1] px-3 py-2 text-[12px]">内部备注</button>
                    </>
                  ) : (
                    <>
                      <button className="rounded-sm border border-[#E6E5E1] px-3 py-2 text-[12px]">标记 Bad Case</button>
                      <button onClick={() => handleTransfer(selected.id)} disabled={selected.queueStatus === "transferred" || selected.assignee !== agent.name || transferringId === selected.id} className="rounded-sm border border-[#E6E5E1] px-3 py-2 text-[12px] disabled:opacity-50">{transferringId === selected.id ? "转交中..." : "转接工单"}</button>
                      <button className="rounded-sm border border-[#E6E5E1] px-3 py-2 text-[12px]">内部备注</button>
                      <button onClick={handlePolish} disabled={!canReply || !inputText.trim() || isPolishing} className="rounded-sm bg-[#0D2B1F] px-3 py-2 text-[12px] font-medium text-white disabled:opacity-60">{isPolishing ? "润色中..." : "记录方案"}</button>
                    </>
                  )}
                </div>
              </section>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
