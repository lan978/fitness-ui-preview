import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Clock,
  FileCheck,
  FileText,
  LayoutGrid,
  Search,
  ShieldAlert,
  Trash2,
  Upload,
  Zap
} from "lucide-react";
import { deleteKnowledgeDocument, getKnowledgeState, uploadKnowledgeDocument } from "../lib/api";
import { getStaffAvatarTone, getStaffInitials } from "../lib/staffProfile";
import { fallbackKnowledgeState } from "../mockData";

function getStatIcon(label) {
  if (label.includes("商品")) return <FileText size={16} strokeWidth={1.5} />;
  if (label.includes("FAQ")) return <LayoutGrid size={16} strokeWidth={1.5} />;
  return <ShieldAlert size={16} strokeWidth={1.5} />;
}

function getChunkTone(level) {
  if (level === "error") return "border-red-100 bg-white";
  return "border-[#E6E5E1] bg-white";
}

function getChunkLevelText(level) {
  if (level === "error") return "异常解析";
  if (level === "warning") return "待核对";
  return "已入库";
}

function resolveNextExpandedDoc(nextState, preferredDocId, currentExpandedDoc) {
  const entries = nextState?.entries ?? [];
  if (!entries.length) return null;
  if (preferredDocId && entries.some((entry) => entry.id === preferredDocId)) {
    return preferredDocId;
  }
  if (currentExpandedDoc && entries.some((entry) => entry.id === currentExpandedDoc)) {
    return currentExpandedDoc;
  }
  return entries[0].id;
}

export default function KnowledgePage({ onBack, currentUser }) {
  const [knowledgeState, setKnowledgeState] = useState(fallbackKnowledgeState);
  const [filterType, setFilterType] = useState("all");
  const [expandedDoc, setExpandedDoc] = useState(fallbackKnowledgeState.entries[0]?.id ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [deletingDocId, setDeletingDocId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const user = currentUser ?? {
    name: "Luna Zhang",
    id: "OPS-1002",
    role: "知识运营",
    roleKey: "strategist"
  };

  useEffect(() => {
    let disposed = false;

    async function loadKnowledge() {
      try {
        const data = await getKnowledgeState();
        if (!disposed && data?.entries?.length) {
          setKnowledgeState(data);
          setExpandedDoc((currentExpanded) =>
            resolveNextExpandedDoc(data, data.entries[0]?.id, currentExpanded)
          );
        }
      } catch (error) {
        console.warn("knowledge fallback", error);
        if (!disposed) {
          setKnowledgeState(fallbackKnowledgeState);
        }
      }
    }

    loadKnowledge();
    return () => {
      disposed = true;
    };
  }, []);

  const stats = useMemo(
    () => knowledgeState.stats.filter((stat) => !String(stat.label).includes("低命中")),
    [knowledgeState.stats]
  );

  const filteredEntries = useMemo(() => {
    return knowledgeState.entries.filter((entry) => {
      const matchType = filterType === "all" || entry.type === filterType;
      if (!matchType) return false;

      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      const chunks = knowledgeState.chunksByDoc?.[entry.id] ?? [];
      return (
        String(entry.name || "").toLowerCase().includes(query) ||
        String(entry.source || "").toLowerCase().includes(query) ||
        chunks.some((chunk) => String(chunk.content || "").toLowerCase().includes(query))
      );
    });
  }, [filterType, knowledgeState.chunksByDoc, knowledgeState.entries, searchQuery]);

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadMessage("");
    setUploading(true);

    try {
      const result = await uploadKnowledgeDocument(file);
      if (result.state?.entries?.length) {
        setKnowledgeState(result.state);
        setExpandedDoc((currentExpanded) =>
          resolveNextExpandedDoc(result.state, result.doc_id, currentExpanded)
        );
      }
      setUploadMessage(result.msg || "文档上传成功，新增知识块已完成入库。");
    } catch (error) {
      console.error("knowledge upload error", error);
      setUploadError("知识文档上传失败，请稍后重试。");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDelete(docId) {
    const confirmed = window.confirm(
      "确认删除这份文档吗？该文档下的全部知识块、数据库记录和对应 MD5 都会一起删除。"
    );
    if (!confirmed) return;

    setUploadError("");
    setUploadMessage("");
    setDeletingDocId(docId);

    try {
      const result = await deleteKnowledgeDocument(docId);
      if (result.state) {
        setKnowledgeState(result.state);
        setExpandedDoc(resolveNextExpandedDoc(result.state, null, null));
      }
      setUploadMessage(result.msg || "文档已删除。");
    } catch (error) {
      console.error("delete knowledge doc error", error);
      setUploadError("删除文档失败，请稍后重试。");
    } finally {
      setDeletingDocId("");
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFCFA] font-sans text-[#1A1A1A] antialiased">
      <header className="sticky top-0 z-20 border-b border-[#E6E5E1] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onBack}
              className="group flex items-center gap-2 text-[#8C8C8C] transition-colors hover:text-[#0D2B1F]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E6E5E1] transition-all group-hover:border-[#0D2B1F] group-hover:bg-[#FDFCFA]">
                <ArrowLeft size={16} strokeWidth={1.5} />
              </div>
              <span className="text-[13px] font-medium tracking-tight">退出登录</span>
            </button>
            <div className="h-4 w-[1px] bg-[#E6E5E1]" />
            <h1 className="font-serif text-lg font-medium tracking-tight text-[#1A1A1A]">
              Luminaire 知识库运营
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="group relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B3B3B3] transition-colors group-focus-within:text-[#0D2B1F]"
              />
              <input
                type="text"
                placeholder="搜索文档名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-64 rounded-sm border border-[#E6E5E1] bg-[#FDFCFA] pl-9 pr-4 text-[13px] outline-none transition-all focus:border-[#0D2B1F] focus:ring-1 focus:ring-[#0D2B1F]/5"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-9 items-center gap-2 rounded-sm bg-[#0D2B1F] px-4 text-[12px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#153B2B] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload size={14} />
              {uploading ? "正在上传" : "上传新文档"}
            </button>
            <div className="flex items-center gap-3 rounded-full border border-[#E6E5E1] bg-[#FDFCFA] py-1.5 pl-2 pr-4 shadow-sm">
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json,.csv,.pdf,.docx,.doc"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-8 py-12">
        <section className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1 w-4 rounded-full bg-[#0D2B1F]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C8C8C]">
                Operations Knowledge Base
              </p>
            </div>
            <h2 className="font-serif text-4xl font-medium tracking-tight text-[#1A1A1A]">
              运营知识库
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-sm border border-[#E6E5E1] bg-white p-1 shadow-sm">
            {[
              { id: "all", label: "全部" },
              { id: "商品知识", label: "商品知识" },
              { id: "FAQ", label: "常见问题" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`rounded-sm px-6 py-2 text-[12px] font-semibold tracking-wide transition-all ${
                  filterType === tab.id
                    ? "bg-[#0D2B1F] text-white"
                    : "text-[#8C8C8C] hover:bg-[#FDFCFA] hover:text-[#1A1A1A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {(uploadMessage || uploadError) && (
          <div
            className={`mb-8 rounded-2xl border px-4 py-3 text-sm ${
              uploadError
                ? "border-red-100 bg-red-50 text-red-600"
                : "border-emerald-100 bg-emerald-50 text-emerald-700"
            }`}
          >
            {uploadError || uploadMessage}
          </div>
        )}

        <section className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-sm border border-[#E6E5E1] bg-white p-7 shadow-sm transition-all hover:border-[#0D2B1F]"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-[#F2F1EE] bg-[#FDFCFA] text-[#0D2B1F]">
                  {getStatIcon(stat.label)}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B3B3B3]">
                    Status
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[#0D2B1F]">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Ready
                  </span>
                </div>
              </div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C8C8C]">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="font-serif text-4xl font-medium text-[#1A1A1A]">{stat.value}</p>
                <span className="text-[12px] tracking-tighter text-[#B3B3B3]">TOTAL DOCUMENTS</span>
              </div>
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#0D2B1F] transition-all duration-700 group-hover:w-full" />
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-sm border border-[#E6E5E1] bg-white shadow-sm">
          <div className="grid grid-cols-12 border-b border-[#E6E5E1] bg-[#FDFCFA] px-8 py-4">
            <div className="col-span-6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C8C8C]">
              文档基本信息
            </div>
            <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C8C8C]">
              分类
            </div>
            <div className="col-span-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C8C8C]">
              最后修订日期
            </div>
            <div className="col-span-2 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C8C8C]">
              状态
            </div>
          </div>

          <div className="divide-y divide-[#F2F1EE]">
            {filteredEntries.map((entry) => {
              const isExpanded = expandedDoc === entry.id;
              const chunks = knowledgeState.chunksByDoc?.[entry.id] ?? [];

              return (
                <div
                  key={entry.id}
                  className={`transition-all duration-300 ${isExpanded ? "bg-[#FDFCFA]" : "hover:bg-[#FDFCFA]/60"}`}
                >
                  <div
                    onClick={() => setExpandedDoc(isExpanded ? null : entry.id)}
                    className="grid cursor-pointer grid-cols-12 items-center px-8 py-6 transition-all"
                  >
                    <div className="col-span-6 flex items-center gap-5">
                      <div className={`transition-transform duration-500 ${isExpanded ? "rotate-90 text-[#0D2B1F]" : "text-[#B3B3B3]"}`}>
                        <ChevronRight size={18} strokeWidth={1.5} />
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#E6E5E1] bg-white text-[#1A1A1A] shadow-sm">
                        <FileText size={22} strokeWidth={1} />
                      </div>
                      <div>
                        <p className={`text-[15px] font-medium transition-colors ${isExpanded ? "text-[#0D2B1F]" : "text-[#1A1A1A]"}`}>
                          {entry.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-[#8C8C8C]">
                          {entry.source}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className="inline-flex items-center rounded-sm border border-[#E6E5E1] bg-white px-3 py-1 text-[11px] font-semibold text-[#1A1A1A]">
                        {entry.type}
                      </span>
                    </div>

                    <div className="col-span-2 text-[12px] text-[#8C8C8C]">
                      <div className="flex items-center gap-2">
                        <Clock size={13} strokeWidth={1.5} />
                        {entry.time}
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0D2B1F]">
                        <FileCheck size={14} strokeWidth={2.5} />
                        Active
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="animate-in slide-in-from-top-2 border-t border-[#E6E5E1] bg-white p-10 duration-500">
                      <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-4">
                        <div className="lg:col-span-3">
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div className="rounded-sm border border-[#F2F1EE] bg-[#FDFCFA] p-5">
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B3B3B3]">
                                解析同步状态
                              </p>
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <p className="text-[14px] font-medium text-[#1A1A1A]">{entry.status}</p>
                              </div>
                            </div>
                            <div className="rounded-sm border border-[#F2F1EE] bg-[#FDFCFA] p-5">
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B3B3B3]">
                                原始数据源
                              </p>
                              <p className="truncate text-[14px] font-medium text-[#1A1A1A]">{entry.source}</p>
                            </div>
                            <div className="rounded-sm border border-[#F2F1EE] bg-[#FDFCFA] p-5">
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B3B3B3]">
                                最后修订记录
                              </p>
                              <p className="text-[14px] font-medium text-[#1A1A1A]">{entry.time}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-center">
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id)}
                            disabled={deletingDocId === entry.id}
                            className="flex w-full items-center justify-center gap-2 rounded-sm border border-red-100 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-red-500 transition-all hover:border-red-200 hover:bg-red-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            {deletingDocId === entry.id ? "删除中" : "删除该文档"}
                          </button>
                        </div>
                      </div>

                      <div className="mb-8 flex items-center justify-between border-b border-[#F2F1EE] pb-5">
                        <div className="flex items-center gap-4">
                          <Zap size={20} className="text-[#0D2B1F]" strokeWidth={1.5} />
                          <h4 className="font-serif text-xl font-medium text-[#1A1A1A]">知识节点解析 (Chunks)</h4>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#B3B3B3]">
                          Total identified: {chunks.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                        {chunks.map((chunk, idx) => (
                          <div
                            key={chunk.id ?? `${entry.id}-${idx}`}
                            className={`group relative rounded-sm border p-7 transition-all duration-300 hover:shadow-xl ${getChunkTone(chunk.level)}`}
                          >
                            <div className="mb-6 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B3B3B3]">
                                  Node ID
                                </span>
                                <span className="font-serif text-[12px] text-[#1A1A1A]">
                                  {chunk.id ?? `LMN-${String(idx + 1).padStart(3, "0")}`}
                                </span>
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm ${
                                  chunk.level === "error"
                                    ? "border border-red-100 bg-red-50 text-red-600"
                                    : "border border-[#F2F1EE] bg-[#FDFCFA] text-[#0D2B1F]"
                                }`}
                              >
                                {getChunkLevelText(chunk.level)}
                              </span>
                            </div>
                            <p className="text-[14px] leading-[1.8] text-[#4A4A4A] transition-colors group-hover:text-[#1A1A1A]">
                              {chunk.content}
                            </p>

                            {chunk.reason && (
                              <div
                                className={`mt-6 flex items-start gap-3 rounded-sm border p-4 text-[12px] ${
                                  chunk.level === "error"
                                    ? "border-red-100 bg-red-50/50 text-red-700"
                                    : "border-[#F2F1EE] bg-[#FDFCFA] text-[#8C8C8C]"
                                }`}
                              >
                                <AlertCircle size={15} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                                <p className="leading-relaxed">
                                  <span className="mr-2 font-bold uppercase tracking-widest">运维标注:</span>
                                  {chunk.reason}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}

                        {!chunks.length && (
                          <div className="xl:col-span-2 rounded-sm border border-dashed border-[#E6E5E1] p-16 text-center">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#F2F1EE] bg-[#FDFCFA] text-[#B3B3B3]">
                              <FileCheck size={28} strokeWidth={1} />
                            </div>
                            <p className="text-[14px] tracking-tight text-[#8C8C8C]">
                              当前文档暂无可展示的知识节点。
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredEntries.length === 0 && (
              <div className="flex flex-col items-center justify-center bg-white py-32">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#F2F1EE] bg-[#FDFCFA] text-[#E6E5E1]">
                  <Search size={36} strokeWidth={1} />
                </div>
                <p className="text-[15px] font-medium text-[#1A1A1A]">无匹配文档</p>
                <p className="mt-1 text-[12px] text-[#8C8C8C]">请尝试调整搜索词或过滤器</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
