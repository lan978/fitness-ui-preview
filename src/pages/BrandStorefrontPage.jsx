import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Gift,
  Heart,
  Menu,
  MessageCircleMore,
  Minus,
  PackageSearch,
  Plus,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  User,
  X
} from "lucide-react";
import { sendDemoMessage } from "../lib/api";

const NAV_ITEMS = [
  "高级订制服",
  "服饰名品",
  "顶级珠宝",
  "高级珠宝",
  "腕表",
  "眼镜",
  "香氛",
  "彩妆",
  "保养",
  "关于 香奈儿"
];

const CAMPAIGNS = [
  {
    id: "fashion",
    eyebrow: "服饰名品",
    title: "CHANEL 25 包款",
    description: "首页承担的是品牌气质、品类分发与视觉记忆，不急着把客服搬到舞台中央。",
    cta: "探索系列"
  },
  {
    id: "watch",
    eyebrow: "腕表",
    title: "J12 机械工艺",
    description: "高单价品类更适合把咨询、预约、护理与门店服务埋在内容后方，而不是直接弹出销售对话。",
    cta: "查看作品"
  },
  {
    id: "beauty",
    eyebrow: "彩妆",
    title: "丝绒唇膏限定色",
    description: "真正需要客服接管的，通常发生在购物袋、订单页、配送异常、退换与礼赠场景。",
    cta: "探索更多"
  }
];

const PRODUCTS = [
  {
    id: "n5-spray",
    category: "香氛",
    collection: "香奈儿 N°5 系列",
    name: "淡香水",
    subtitle: "以俐落瓶身承接经典香调，适合做单品详情页的核心展示款。",
    sku: "105670",
    price: 6000,
    badge: "精选商品",
    sizes: ["75 ml", "50 ml"],
    art: "spray"
  },
  {
    id: "n5-edp",
    category: "香氛",
    collection: "香奈儿 N°5 系列",
    name: "典藏香水",
    subtitle: "商品页重点是规格、评论、加入购物袋，以及与订单服务的自然衔接。",
    sku: "125530",
    price: 6900,
    badge: "精选商品",
    sizes: ["100 ml", "50 ml"],
    art: "classic"
  },
  {
    id: "n5-leau",
    category: "香氛",
    collection: "香奈儿 N°5 L'EAU 清新晨露",
    name: "淡香水",
    subtitle: "更轻盈的白调包装，适合在明星商品区形成层次变化。",
    sku: "105740",
    price: 6900,
    badge: "新品",
    sizes: ["100 ml", "50 ml"],
    art: "clear"
  }
];

const SAMPLE_OPTIONS = [
  {
    id: "coco-mini",
    name: "香奈儿摩登 COCO 香水",
    description: "试香卡与迷你体验装组合",
    art: "mist"
  },
  {
    id: "allure-mini",
    name: "香奈儿 ALLURE 男性运动系列",
    description: "清爽木质调体验礼",
    art: "tube"
  },
  {
    id: "uv-mini",
    name: "香奈儿珍珠光感防护妆前乳",
    description: "轻盈肤感，适合加购试用",
    art: "duo"
  },
  {
    id: "serum-mini",
    name: "香奈儿金砖精萃精华液",
    description: "高端保养线试用礼",
    art: "tube"
  }
];

const ORDER_TOUCHPOINTS = [
  {
    title: "下单后的第一件事",
    text: "不是营销，而是地址、礼赠、库存与支付确认。",
    label: "O001 待发货",
    icon: Gift
  },
  {
    title: "配送中的服务感",
    text: "高单价订单更需要物流可视化、异常拦截与签收提醒。",
    label: "O002 已发货",
    icon: Truck
  },
  {
    title: "签收后的分流判断",
    text: "退货退款、仅退款、换货、瑕疵补偿，规则必须分得很细。",
    label: "O003 已签收",
    icon: ShieldCheck
  },
  {
    title: "低调但随时可达",
    text: "客服入口应藏在购物袋、订单页和商品顾问按钮里。",
    label: "AI + 人工协同",
    icon: MessageCircleMore
  }
];

const SERVICE_PROMPTS = [
  "O001物流到哪了",
  "O001我要退款",
  "O001修改地址",
  "收到后有轻微瑕疵怎么办"
];

function createSessionId() {
  return `luxury-demo-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function formatPrice(value) {
  return `NT$ ${value.toLocaleString("en-US")}`;
}

function fallbackServiceReply(text) {
  const normalized = text.trim();
  if (!normalized) return "请告诉我您的订单或服务问题，我会先给出下一步建议。";
  if (normalized.includes("物流") || normalized.includes("发货")) {
    return "我会先核对订单状态与最新物流节点，再判断是继续等待、催发货，还是转人工处理异常。";
  }
  if (normalized.includes("退款") && !normalized.includes("退货")) {
    return "我会先判断订单是否待发货、已发货或已签收，再决定更适合走仅退款还是退货退款。";
  }
  if (normalized.includes("退货") || normalized.includes("换货")) {
    return "这类问题通常要先结合签收状态、售后期和目标规格库存，再给出明确路径。";
  }
  if (normalized.includes("瑕疵") || normalized.includes("破损")) {
    return "瑕疵问题建议先补充图片，再判断补偿、补寄、维修或人工复核。";
  }
  if (normalized.includes("地址")) {
    return "如果仍在待发货阶段，通常可以先走地址修改；如果已经出库，就要先判断能否拦截。";
  }
  return "我已经收到您的问题。这个前台 Demo 会把订单、物流、退换和礼赠服务接在同一条体验链路里。";
}

function ProductBottle({ variant = "classic", size = "large" }) {
  const isLarge = size === "large";
  const bodySize = isLarge ? "h-[420px] w-[250px]" : "h-[210px] w-[120px]";
  const capSize = isLarge ? "h-28 w-24" : "h-16 w-14";
  const glowByVariant = {
    classic: "from-[#f0c66e] via-[#d6952f] to-[#8c5b0e]",
    spray: "from-[#f6c94b] via-[#d28f1e] to-[#996517]",
    clear: "from-[#f6f2ec] via-[#ebe5dc] to-[#b9b0a5]"
  };
  const shadowByVariant = {
    classic: "shadow-[0_24px_45px_rgba(194,137,43,0.28)]",
    spray: "shadow-[0_20px_40px_rgba(194,137,43,0.24)]",
    clear: "shadow-[0_20px_35px_rgba(146,138,128,0.18)]"
  };

  return (
    <div className={`relative ${isLarge ? "h-[520px] w-[320px]" : "h-[250px] w-[160px]"}`}>
      <div
        className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-t-[20px] bg-gradient-to-b from-black via-[#17181a] to-[#3a3b40] ${capSize} ${
          isLarge ? "shadow-[0_18px_30px_rgba(0,0,0,0.22)]" : "shadow-[0_10px_18px_rgba(0,0,0,0.16)]"
        }`}
      />
      {variant === "spray" && (
        <div
          className={`absolute left-1/2 top-6 z-10 -translate-x-1/2 rounded-full bg-black/85 ${
            isLarge ? "h-4 w-4" : "h-2.5 w-2.5"
          }`}
        />
      )}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-b ${glowByVariant[variant]} ${bodySize} ${shadowByVariant[variant]}`}
      >
        <div className="absolute inset-x-[10%] top-[10%] h-[76%] rounded-[22px] border border-white/55 bg-white/10" />
        <div className="absolute inset-y-0 left-[24%] w-[10%] bg-white/25 blur-[2px]" />
        <div className="absolute right-[14%] top-[12%] h-[72%] w-[8%] bg-black/10 blur-[1px]" />
        <div
          className={`absolute left-1/2 top-[42%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[6px] border border-black/10 bg-white/90 text-center ${
            isLarge ? "h-36 w-32" : "h-20 w-16"
          }`}
        >
          <span className={`${isLarge ? "text-[30px]" : "text-sm"} font-semibold tracking-tight text-[#222]`}>
            N°5
          </span>
          <span className={`${isLarge ? "mt-1 text-[14px]" : "mt-0.5 text-[8px]"} font-bold tracking-[0.18em] text-[#222]`}>
            CHANEL
          </span>
          <span className={`${isLarge ? "mt-2 text-[11px]" : "mt-1 text-[6px]"} uppercase tracking-[0.24em] text-[#6a6a6a]`}>
            Paris
          </span>
          <span className={`${isLarge ? "mt-3 text-[10px]" : "mt-1 text-[6px]"} uppercase tracking-[0.18em] text-[#4d4d4d]`}>
            {variant === "classic" ? "Eau de parfum" : variant === "clear" ? "L'EAU" : "The Spray"}
          </span>
        </div>
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/10 blur-xl ${
            isLarge ? "h-10 w-40" : "h-5 w-20"
          }`}
        />
      </div>
    </div>
  );
}

function SampleArt({ art }) {
  if (art === "tube") {
    return (
      <div className="relative h-16 w-12">
        <div className="absolute left-1/2 top-0 h-4 w-8 -translate-x-1/2 rounded-t-md bg-black" />
        <div className="absolute bottom-0 left-1/2 h-14 w-9 -translate-x-1/2 rounded-b-[12px] rounded-t-md bg-gradient-to-b from-[#f8efe1] via-[#ecd7b8] to-[#d0b48a]" />
      </div>
    );
  }

  if (art === "duo") {
    return (
      <div className="flex items-end gap-2">
        <div className="relative h-16 w-8 rounded-[10px] bg-gradient-to-b from-[#f6eadb] to-[#d0b28d]" />
        <div className="relative h-14 w-7 rounded-[10px] bg-gradient-to-b from-[#f7f3ea] to-[#d7d0c6]" />
      </div>
    );
  }

  if (art === "mist") {
    return (
      <div className="relative h-16 w-12">
        <div className="absolute left-1/2 top-0 h-3 w-6 -translate-x-1/2 rounded-full bg-black" />
        <div className="absolute bottom-0 left-1/2 h-14 w-10 -translate-x-1/2 rounded-[12px] bg-gradient-to-b from-[#f9d86f] via-[#e0a325] to-[#bc7e15]" />
      </div>
    );
  }

  return <ProductBottle variant="spray" size="small" />;
}

function CampaignPanel({ campaign }) {
  if (campaign.id === "fashion") {
    return (
      <article className="group relative overflow-hidden rounded-[32px] bg-[var(--lux-paper)] px-6 py-8 md:px-10 md:py-10 shadow-editorial animate-reveal-up">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f7f3ed] via-[#e6e1db] to-[#d5dce4]" />
        <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-between">
          <div className="max-w-sm">
            <p className="text-[11px] uppercase tracking-[0.35em] text-black/45">{campaign.eyebrow}</p>
            <h2 className="mt-3 max-w-xs font-luxurySans text-[32px] font-semibold uppercase tracking-[0.18em] text-[var(--lux-ink)] md:text-[42px]">
              {campaign.title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-black/60">{campaign.description}</p>
          </div>
          <button className="inline-flex w-fit items-center gap-2 border border-black bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white">
            {campaign.cta}
            <ArrowRight size={14} />
          </button>
        </div>

        {[
          { left: "8%", top: "4%", height: "122%", width: "10%", color: "from-[#bcc8d6] to-[#7291ac]" },
          { left: "22%", top: "-6%", height: "132%", width: "11%", color: "from-[#9fb6cb] to-[#6787a2]" },
          { left: "40%", top: "-2%", height: "128%", width: "11%", color: "from-[#b7cade] to-[#7f9cb6]" },
          { left: "61%", top: "-8%", height: "136%", width: "12%", color: "from-[#95aec6] to-[#5e7b93]" },
          { left: "79%", top: "0%", height: "126%", width: "11%", color: "from-[#b6c4d3] to-[#6e8ea9]" }
        ].map((shape) => (
          <div
            key={shape.left}
            className={`absolute rounded-[60px] bg-gradient-to-b ${shape.color} opacity-95 transition duration-700 group-hover:translate-y-1`}
            style={{
              left: shape.left,
              top: shape.top,
              height: shape.height,
              width: shape.width
            }}
          />
        ))}

        <div className="absolute bottom-[18%] left-[24%] h-20 w-16 rounded-[20px_20px_28px_28px] bg-gradient-to-br from-[#9f5e3f] to-[#6f341d] shadow-[0_18px_30px_rgba(111,52,29,0.35)]" />
        <div className="absolute bottom-[22%] left-[67%] h-16 w-14 rounded-[18px_18px_26px_26px] bg-gradient-to-br from-[#d28992] to-[#af5360] shadow-[0_18px_30px_rgba(175,83,96,0.3)]" />
      </article>
    );
  }

  if (campaign.id === "watch") {
    return (
      <article className="group relative overflow-hidden rounded-[32px] bg-[var(--lux-graphite)] px-6 py-8 md:px-10 md:py-10 shadow-editorial animate-reveal-up">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#dfe6f4] via-[#2f3640] to-[#05070a]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white via-[#c8ccd4] to-[#6b7079] shadow-[inset_0_0_30px_rgba(255,255,255,0.3)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-[#1e2025] shadow-[0_0_30px_rgba(255,255,255,0.12)]" />

        {[["12%", "18%"], ["70%", "14%"], ["18%", "62%"], ["77%", "66%"], ["48%", "9%"]].map(([left, top], index) => (
          <div
            key={`${left}-${top}`}
            className={`absolute rounded-full bg-white/55 blur-[1px] ${index % 2 === 0 ? "animate-float-slow" : "animate-float-delayed"}`}
            style={{
              left,
              top,
              height: `${index % 2 === 0 ? 28 : 18}px`,
              width: `${index % 2 === 0 ? 28 : 18}px`
            }}
          />
        ))}

        <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-between">
          <div className="max-w-sm text-white">
            <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">{campaign.eyebrow}</p>
            <h2 className="mt-3 max-w-xs font-luxurySans text-[32px] font-semibold uppercase tracking-[0.16em] md:text-[40px]">
              {campaign.title}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">{campaign.description}</p>
          </div>
          <button className="inline-flex w-fit items-center gap-2 border border-white/70 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black">
            {campaign.cta}
            <ArrowRight size={14} />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-[32px] bg-[var(--lux-paper)] px-6 py-8 md:px-10 md:py-10 shadow-editorial animate-reveal-up">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fbf7f1] via-[#f4d0bf] to-[#b77e65]" />
      <div className="pointer-events-none absolute -left-10 top-[-16%] h-[420px] w-[420px] rounded-full bg-[#f5c8ad]/70 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8%] top-1/2 h-[280px] w-[180px] -translate-y-1/2 rounded-[40px] bg-gradient-to-b from-[#111] to-[#303338]" />
      <div className="pointer-events-none absolute right-[6%] top-[22%] h-[210px] w-[54px] rounded-[30px] bg-gradient-to-b from-[#b7152f] to-[#7a0e1e] shadow-[0_18px_40px_rgba(122,14,30,0.4)]" />
      <div className="pointer-events-none absolute left-[14%] top-[12%] h-[360px] w-[260px] rotate-[15deg] rounded-[180px] bg-gradient-to-br from-[#f2c9b5] to-[#c68472]" />
      <div className="pointer-events-none absolute left-[27%] top-[24%] h-[160px] w-[72px] rounded-full border-[12px] border-black" />
      <div className="pointer-events-none absolute left-[42%] top-[40%] h-14 w-20 -rotate-[16deg] rounded-full bg-gradient-to-r from-[#9b0f20] to-[#d73d4b]" />

      <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-between">
        <div className="max-w-sm">
          <p className="text-[11px] uppercase tracking-[0.35em] text-black/45">{campaign.eyebrow}</p>
          <h2 className="mt-3 max-w-xs font-luxurySans text-[30px] font-semibold uppercase tracking-[0.16em] text-[var(--lux-ink)] md:text-[40px]">
            {campaign.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-black/60">{campaign.description}</p>
        </div>
        <button className="inline-flex w-fit items-center gap-2 border border-black bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white">
          {campaign.cta}
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

function CuratedProductCard({ product, isActive, onSelect, onAddToBag }) {
  return (
    <article
      className={`rounded-[28px] border bg-white p-6 transition ${
        isActive ? "border-black shadow-editorial" : "border-black/8 shadow-soft hover:-translate-y-1 hover:shadow-editorial"
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/60">
          {product.badge}
        </span>
        <button className="text-black/45 transition hover:text-black" type="button" aria-label="加入愿望清单">
          <Heart size={16} />
        </button>
      </div>

      <div className="flex min-h-[280px] items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,rgba(247,244,238,1),rgba(255,255,255,1))]">
        <ProductBottle variant={product.art} size="small" />
      </div>

      <div className="mt-8 space-y-2">
        <h3 className="text-lg font-semibold tracking-[0.04em] text-[var(--lux-ink)]">{product.collection}</h3>
        <p className="text-sm text-black/58">{product.name}</p>
        <p className="text-xl font-semibold tracking-[0.1em] text-[var(--lux-ink)]">{formatPrice(product.price)}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex flex-1 items-center justify-center gap-2 border border-black px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
        >
          查看详情
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          onClick={onAddToBag}
          className="inline-flex items-center justify-center border border-black/10 px-4 py-3 text-black transition hover:border-black"
          aria-label="加入购物袋"
        >
          <ShoppingBag size={16} />
        </button>
      </div>
    </article>
  );
}

export default function BrandStorefrontPage({ onBack }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("bag");
  const [selectedProductId, setSelectedProductId] = useState("n5-edp");
  const featuredProduct = useMemo(
    () => PRODUCTS.find((product) => product.id === selectedProductId) || PRODUCTS[1],
    [selectedProductId]
  );
  const [selectedSize, setSelectedSize] = useState(PRODUCTS[1].sizes[0]);
  const [bagItems, setBagItems] = useState([]);
  const [selectedSamples, setSelectedSamples] = useState(["coco-mini"]);
  const [giftOption, setGiftOption] = useState("card");
  const [serviceInput, setServiceInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [serviceSessionId] = useState(() => createSessionId());
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "您好，这里是订单与服务顾问。您可以直接试试 O001、O002、O003，体验物流查询、退款建议、地址修改与瑕疵分流。"
    }
  ]);

  useEffect(() => {
    setSelectedSize(featuredProduct.sizes[0]);
  }, [featuredProduct]);

  const bagCount = useMemo(
    () => bagItems.reduce((total, item) => total + item.quantity, 0),
    [bagItems]
  );
  const bagSubtotal = useMemo(
    () => bagItems.reduce((total, item) => total + item.quantity * item.price, 0),
    [bagItems]
  );

  function openDrawer(tab) {
    setDrawerTab(tab);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function handleAddToBag(product = featuredProduct, size = selectedSize) {
    const key = `${product.id}-${size}`;
    setBagItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        {
          key,
          name: `${product.collection} ${product.name}`,
          size,
          price: product.price,
          badge: product.badge,
          quantity: 1
        },
        ...current
      ];
    });
    openDrawer("bag");
  }

  function adjustBagItem(key, delta) {
    setBagItems((current) =>
      current
        .map((item) =>
          item.key === key ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handleSampleToggle(sampleId) {
    setSelectedSamples((current) => {
      if (current.includes(sampleId)) {
        return current.filter((item) => item !== sampleId);
      }
      if (current.length < 2) {
        return [...current, sampleId];
      }
      return [current[1], sampleId];
    });
  }

  async function handleSendServiceMessage(content) {
    const text = (content ?? serviceInput).trim();
    if (!text || isSending) return;

    setMessages((current) => [...current, { role: "user", text }]);
    setServiceInput("");
    setIsSending(true);
    openDrawer("service");

    try {
      const result = await sendDemoMessage(serviceSessionId, text);
      setMessages((current) => [
        ...current,
        { role: "assistant", text: result.reply || fallbackServiceReply(text) }
      ]);
    } catch (error) {
      console.warn("service drawer fallback", error);
      setMessages((current) => [...current, { role: "assistant", text: fallbackServiceReply(text) }]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSelectProduct(productId) {
    setSelectedProductId(productId);
    const productAnchor = document.getElementById("product-focus");
    if (productAnchor) {
      productAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="min-h-screen bg-[var(--lux-ivory)] text-[var(--lux-ink)]">
      <div className="h-1 w-full bg-black" />

      <header className="sticky top-0 z-30 border-b border-black/8 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 md:px-8 md:py-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/65 transition hover:border-black hover:text-black"
            >
              <ArrowLeft size={14} />
              返回
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/70 md:hidden"
              aria-label="切换导航"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <div className="text-center">
            <p className="font-luxurySans text-[28px] font-semibold uppercase tracking-[0.28em] text-black md:text-[40px]">
              CHANEL
            </p>
            <p className="mt-1 hidden text-[10px] uppercase tracking-[0.42em] text-black/35 md:block">
              Order-aware luxury storefront
            </p>
          </div>

          <div className="flex items-center gap-3">
            {[Search, User, Heart].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-transparent text-black/70 transition hover:border-black/10 hover:text-black md:inline-flex"
              >
                <Icon size={17} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => openDrawer("bag")}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black transition hover:bg-black hover:text-white"
              aria-label="打开购物袋"
            >
              <ShoppingBag size={18} />
              {bagCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                  {bagCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-black/6 px-8 py-5 md:block">
          <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                className={`relative text-[13px] font-semibold tracking-[0.06em] transition ${
                  item === "香氛" ? "text-black" : "text-black/75 hover:text-black"
                }`}
              >
                {item}
                {item === "香氛" && (
                  <span className="absolute -bottom-5 left-1/2 h-1.5 w-9 -translate-x-1/2 bg-black" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {mobileNavOpen && (
          <div className="border-t border-black/8 bg-white px-4 py-4 md:hidden">
            <div className="grid grid-cols-2 gap-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium ${
                    item === "香氛" ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/75"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto max-w-[1600px] px-4 pb-6 pt-6 md:px-8 md:pb-10 md:pt-10">
          <div className="grid gap-5">
            {CAMPAIGNS.map((campaign) => (
              <CampaignPanel key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </section>

        <section id="product-focus" className="border-y border-black/8 bg-white/70">
          <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-14 md:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-center lg:gap-20 lg:py-20">
            <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(180deg,#fcfaf6_0%,#f5efe7_100%)] px-8 py-12 shadow-editorial">
              <div className="absolute left-10 top-10 h-4 w-4 rounded-full border border-black/25" />
              <div className="absolute left-10 top-20 h-4 w-4 rounded-full bg-black/55" />
              <div className="absolute left-10 top-30 h-4 w-4 rounded-full bg-black/35" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/8 to-transparent" />
              <div className="relative flex items-center justify-center py-4">
                <ProductBottle variant={featuredProduct.art} size="large" />
              </div>
            </div>

            <div className="max-w-[560px]">
              <p className="text-[11px] uppercase tracking-[0.34em] text-black/45">{featuredProduct.category}</p>
              <h2 className="mt-4 font-luxurySans text-[34px] font-semibold tracking-[0.05em] text-[var(--lux-ink)] md:text-[46px]">
                {featuredProduct.collection}
              </h2>
              <div className="mt-4 h-[3px] w-full max-w-[560px] bg-black/80" />
              <div className="mt-6 space-y-3 text-black/62">
                <p className="text-[22px] text-black/78">{featuredProduct.name}</p>
                <p className="max-w-[520px] text-sm leading-8">{featuredProduct.subtitle}</p>
                <p className="text-sm text-black/45">编号 {featuredProduct.sku}</p>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 border-y border-black/8 py-6">
                <div>
                  <p className="text-[30px] font-semibold tracking-[0.12em] text-black">
                    {formatPrice(featuredProduct.price)}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-black/45">
                    {featuredProduct.sizes.length} 款可选规格
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/60">
                    {featuredProduct.badge}
                  </span>
                  <button type="button" className="text-black/55 transition hover:text-black" aria-label="收藏">
                    <Star size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-[0.08em] text-black/82">选择规格</span>
                  <button
                    type="button"
                    onClick={() => openDrawer("service")}
                    className="text-xs uppercase tracking-[0.16em] text-black/45 underline-offset-4 transition hover:text-black hover:underline"
                  >
                    规格与订单服务
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {featuredProduct.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-[20px] border px-4 py-4 text-left transition ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white text-black/72 hover:border-black/35"
                      }`}
                    >
                      <span className="block text-sm font-semibold">{size}</span>
                      <span className={`mt-1 block text-xs ${selectedSize === size ? "text-white/72" : "text-black/42"}`}>
                        香氛主规格
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleAddToBag()}
                  className="inline-flex min-h-14 flex-1 items-center justify-center gap-3 bg-black px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#232323]"
                >
                  新增到购物车
                  <ShoppingBag size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => openDrawer("service")}
                  className="inline-flex min-h-14 items-center justify-center gap-3 border border-black px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white"
                >
                  订单与服务
                  <MessageCircleMore size={16} />
                </button>
              </div>

              <div className="mt-10 grid gap-4 rounded-[28px] border border-black/8 bg-[var(--lux-ivory)] p-6">
                <div className="flex items-start gap-4">
                  <PackageSearch className="mt-0.5 text-black/72" size={18} />
                  <div>
                    <p className="text-sm font-semibold tracking-[0.06em] text-black">订单处理为何值得前置设计</p>
                    <p className="mt-2 text-sm leading-7 text-black/58">
                      奢侈品牌不一定需要高频营销客服，但只要能下单，就一定需要围绕购物袋、礼赠、配送与售后的服务入口。
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["下单后查物流", "修改地址", "退款建议", "瑕疵分流"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleSendServiceMessage(label === "下单后查物流" ? "O001物流到哪了" : label === "修改地址" ? "O001修改地址" : label === "退款建议" ? "O001我要退款" : "收到后有轻微瑕疵怎么办")}
                      className="inline-flex items-center justify-between rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm text-black/75 transition hover:border-black hover:text-black"
                    >
                      {label}
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black text-white">
          <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-16">
            <div className="mb-10 flex items-center gap-3">
              <Sparkles size={18} className="text-white/75" />
              <p className="text-[11px] uppercase tracking-[0.32em] text-white/55">订单处理的用武之地</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-4">
              {ORDER_TOUCHPOINTS.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                    <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5">
                      <Icon size={18} />
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{item.label}</p>
                    <h3 className="mt-4 text-xl font-semibold tracking-[0.04em] text-white">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/68">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-16">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-black/42">Curated Selection</p>
              <h2 className="mt-3 font-luxurySans text-[36px] font-semibold tracking-[0.06em] text-[var(--lux-ink)] md:text-[48px]">
                明星产品
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openDrawer("service")}
              className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45 transition hover:text-black md:inline-flex"
            >
              联系订单与服务
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {PRODUCTS.map((product) => (
              <CuratedProductCard
                key={product.id}
                product={product}
                isActive={product.id === featuredProduct.id}
                onSelect={() => handleSelectProduct(product.id)}
                onAddToBag={() => handleAddToBag(product, product.sizes[0])}
              />
            ))}
          </div>
        </section>

        <footer className="border-t border-black/8 bg-white/70">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:px-8">
            <div>
              <p className="font-luxurySans text-[28px] font-semibold uppercase tracking-[0.26em] text-black">CHANEL</p>
              <p className="mt-4 max-w-md text-sm leading-7 text-black/58">
                这个前端不是把客服做成首页主角，而是学习香奈儿式的内容优先结构，再把订单处理能力放进真正需要它的节点里。
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-black/42">线上服务</p>
              <div className="mt-5 grid gap-3 text-sm text-black/68">
                {["付款方式", "配送说明", "退货说明", "购物袋礼赠", "联系我们"].map((item) => (
                  <button key={item} type="button" className="w-fit transition hover:text-black">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-black/42">试用订单</p>
              <div className="mt-5 grid gap-3 text-sm text-black/68">
                {["O001 待发货", "O002 已发货", "O003 已签收", "PDD_ORDER_001 平台订单"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSendServiceMessage(item.split(" ")[0])}
                    className="w-fit transition hover:text-black"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-5 right-5 z-20 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => openDrawer("service")}
          className="inline-flex items-center gap-3 rounded-full border border-black bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-editorial transition hover:-translate-y-0.5 hover:bg-black hover:text-white"
        >
          <MessageCircleMore size={16} />
          订单与服务
        </button>
        <button
          type="button"
          onClick={() => openDrawer("bag")}
          className="inline-flex items-center gap-3 rounded-full bg-black px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-editorial transition hover:-translate-y-0.5"
        >
          <ShoppingBag size={16} />
          购物袋 {bagCount > 0 ? `(${bagCount})` : ""}
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/28 backdrop-blur-[2px]" onClick={closeDrawer}>
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-[var(--lux-paper)] shadow-[0_28px_80px_rgba(0,0,0,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-black/8 px-5 pb-5 pt-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-black/42">Front-of-house service</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[0.05em] text-black">
                    {drawerTab === "bag" ? "购物袋" : "订单与服务"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/70 transition hover:border-black hover:text-black"
                  aria-label="关闭抽屉"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 rounded-full bg-black/5 p-1">
                {[
                  ["bag", `购物袋${bagCount ? ` (${bagCount})` : ""}`],
                  ["service", "订单与服务"]
                ].map(([tab, label]) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDrawerTab(tab)}
                    className={`rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                      drawerTab === tab ? "bg-black text-white" : "text-black/58 hover:text-black"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {drawerTab === "bag" ? (
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="rounded-[24px] border border-black/8 bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-black/42">Why it matters</p>
                      <p className="mt-2 text-sm leading-7 text-black/68">
                        奢侈品牌购物袋里，不只是结账，还会承接礼赠留言、试用礼选择、物流承诺与售后入口。
                      </p>
                    </div>
                    <Gift className="shrink-0 text-black/62" size={18} />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {bagItems.length > 0 ? (
                    bagItems.map((item) => (
                      <article key={item.key} className="rounded-[24px] border border-black/8 bg-white p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-[18px] bg-[var(--lux-ivory)]">
                            <ProductBottle variant="classic" size="small" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.22em] text-black/42">{item.badge}</p>
                                <p className="mt-2 text-sm font-semibold leading-6 text-black">{item.name}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => adjustBagItem(item.key, -item.quantity)}
                                className="text-black/35 transition hover:text-black"
                                aria-label="移除商品"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm text-black/58">
                              <span>{item.size}</span>
                              <span>{formatPrice(item.price)}</span>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-full border border-black/10">
                                <button
                                  type="button"
                                  onClick={() => adjustBagItem(item.key, -1)}
                                  className="p-2 text-black/65 transition hover:text-black"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => adjustBagItem(item.key, 1)}
                                  className="p-2 text-black/65 transition hover:text-black"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setDrawerTab("service");
                                  handleSendServiceMessage(`帮我处理 ${item.name} 的订单问题`);
                                }}
                                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/52 underline-offset-4 transition hover:text-black hover:underline"
                              >
                                联系订单服务
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[28px] border border-dashed border-black/12 bg-white px-6 py-10 text-center">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-black/42">Empty bag</p>
                      <p className="mt-3 text-lg font-semibold text-black">购物袋尚未加入商品</p>
                      <p className="mt-3 text-sm leading-7 text-black/56">
                        但礼赠、试用体验礼与订单服务结构已经准备好，只等商品进入流程。
                      </p>
                      <button
                        type="button"
                        onClick={closeDrawer}
                        className="mt-6 inline-flex items-center gap-2 border border-black px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
                      >
                        返回选购
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <section className="mt-8 rounded-[28px] border border-black/8 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold tracking-[0.04em] text-black">赠礼信息</h4>
                      <p className="mt-2 text-sm leading-7 text-black/58">
                        免额外费用加入礼物讯息，是奢侈品购物袋最容易体现服务感的节点之一。
                      </p>
                    </div>
                    <Gift size={18} className="mt-1 text-black/55" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      ["none", "不需要贺卡"],
                      ["card", "请写给收卡人卡片"],
                      ["message", "留下礼物专属讯息"]
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setGiftOption(value)}
                        className={`flex w-full items-center gap-3 rounded-[18px] border px-4 py-4 text-left transition ${
                          giftOption === value
                            ? "border-black bg-black text-white"
                            : "border-black/10 bg-[var(--lux-paper)] text-black/70 hover:border-black/35"
                        }`}
                      >
                        <span
                          className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                            giftOption === value ? "border-white" : "border-black/25"
                          }`}
                        >
                          {giftOption === value && <span className="h-2 w-2 rounded-full bg-current" />}
                        </span>
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="mt-8 rounded-[28px] border border-black/8 bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold tracking-[0.04em] text-black">试用体验礼</h4>
                      <p className="mt-2 text-sm leading-7 text-black/58">
                        最多可选 2 份体验礼，用来复刻您截图里购物袋之后的服务节点。
                      </p>
                    </div>
                    <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">
                      {selectedSamples.length} / 2
                    </span>
                  </div>
                  <div className="mt-6 grid gap-4">
                    {SAMPLE_OPTIONS.map((sample) => {
                      const checked = selectedSamples.includes(sample.id);
                      return (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => handleSampleToggle(sample.id)}
                          className={`flex items-center gap-4 rounded-[22px] border px-4 py-4 text-left transition ${
                            checked ? "border-black bg-[var(--lux-ivory)]" : "border-black/8 bg-white hover:border-black/28"
                          }`}
                        >
                          <span
                            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              checked ? "border-black bg-black text-white" : "border-black/20"
                            }`}
                          >
                            {checked && <Check size={13} />}
                          </span>
                          <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-[16px] bg-[var(--lux-paper)]">
                            <SampleArt art={sample.art} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold leading-6 text-black">{sample.name}</p>
                            <p className="mt-1 text-sm text-black/55">{sample.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="mt-8 rounded-[28px] border border-black/8 bg-black p-6 text-white">
                  <h4 className="text-lg font-semibold tracking-[0.04em]">订单与服务入口</h4>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    这部分就是“虽然不营销，但必须处理订单”的真正落点。
                  </p>
                  <div className="mt-5 grid gap-3">
                    {SERVICE_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSendServiceMessage(prompt)}
                        className="inline-flex items-center justify-between rounded-[18px] border border-white/12 bg-white/6 px-4 py-3 text-sm text-white/78 transition hover:bg-white/10"
                      >
                        {prompt}
                        <ChevronRight size={15} />
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="border-b border-black/8 px-5 py-5">
                  <div className="rounded-[24px] border border-black/8 bg-white p-5">
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
                        <Bot size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold tracking-[0.06em] text-black">隐藏在前台里的服务中枢</p>
                        <p className="mt-2 text-sm leading-7 text-black/58">
                          在香奈儿式页面结构里，客服不抢首页，但会在购物袋、商品顾问、配送说明和售后节点精准出现。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {SERVICE_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSendServiceMessage(prompt)}
                        className="rounded-full border border-black/10 px-4 py-2 text-[11px] font-semibold tracking-[0.08em] text-black/68 transition hover:border-black hover:text-black"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[86%] rounded-[22px] px-4 py-3 text-sm leading-7 ${
                          message.role === "assistant"
                            ? "bg-white text-black/72 shadow-soft"
                            : "bg-black text-white"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/8 px-5 py-5">
                  <div className="rounded-[28px] border border-black/10 bg-white p-3">
                    <textarea
                      value={serviceInput}
                      onChange={(event) => setServiceInput(event.target.value)}
                      placeholder="请输入您的订单问题，例如：O001物流到哪了"
                      className="h-28 w-full bg-transparent px-2 py-2 text-sm leading-7 outline-none placeholder:text-black/28"
                    />
                    <div className="flex items-center justify-between px-2 pb-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-black/35">
                        试试 O001 / O002 / O003
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSendServiceMessage()}
                        disabled={isSending}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#232323] disabled:cursor-not-allowed disabled:opacity-45"
                        aria-label="发送消息"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-black/8 px-5 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.18em] text-black/42">Subtotal</span>
                <span className="text-lg font-semibold tracking-[0.08em] text-black">{formatPrice(bagSubtotal)}</span>
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-3 bg-black px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#232323]"
              >
                继续结账
                <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
