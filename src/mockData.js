export const domains = [
  { id: "specialist", label: "客服工作台", route: "客服工作台" },
  { id: "strategist", label: "知识运营", route: "知识治理中心" },
  { id: "director", label: "数据看板", route: "评测与数据看板" }
];

export const fallbackWorkspaceState = {
  agent: {
    name: "Felix Chen",
    id: "CS-2048",
    role: "人工客服"
  },
  conversations: [
    {
      id: "demo-1",
      queueStatus: "inProgress",
      assignee: "Felix Chen",
      queueHint: "由你处理",
      priority: "高优先级",
      name: "Isabella Chen",
      message: "我比较急着穿，补偿多少？",
      time: "14:15",
      tags: ["高风险", "售后"],
      sla: "normal",
      summary: {
        phase: "方案协商",
        pending: "瑕疵实拍",
        route: "通融补偿"
      },
      order: {
        id: "#ORD-9921-2024",
        product: "24SS 重磅羊绒针织衫",
        level: "V4",
        profile: "高价值分层 · 无历史投诉",
        orderStatus: "已签收",
        logisticsStatus: "顺丰速运",
        afterSaleStatus: "协商中"
      },
      diagnosis: {
        status: "瑕疵投诉（待核实）",
        risk: "优质客群（通融级）",
        action:
          "建议补偿区间为原价 5%-10%，需客服确认；如客户不接受，可尝试申请专项织补服务。",
        pending: "需补充瑕疵部位高清实拍图"
      },
      script:
        "尊敬的 Isabella 您好，非常抱歉这款 24SS 羊绒衫未能给您带来完美的体验。考虑到您一直以来的信任，我们建议为您申请 5%-10% 的关怀补偿，或为您安排专业织补服务。您看哪种方式更方便？",
      evidence: [
        {
          title: "《售后补偿授权手册 v3.0》",
          detail: "针对 V4 以上客户，轻微外观瑕疵可在 5%-15% 范围内通融补偿。"
        },
        {
          title: "羊绒材质护理说明",
          detail: "细支羊绒在领口与袖口位置更容易出现轻微抽丝，需人工判断是否影响穿着。"
        }
      ],
      logic: [
        "识别到用户主诉为质量相关问题，当前核心诉求是领口抽丝。",
        "订单已签收，优先考虑通融补偿或专业修复，不建议直接承诺无条件退款。",
        "客户属于高价值用户，风险较低，可由人工客服确认方案后推进。"
      ],
      messages: [
        {
          type: "user",
          content: "你好，我之前购买的 24SS 系列羊绒衫收到后发现领口有一处轻微抽丝。",
          time: "14:10"
        },
        {
          type: "system",
          content: "AI 自动关联：订单 #ORD-9921-2024（已签收 48 小时）",
          time: "14:11"
        },
        {
          type: "user",
          content: "我比较急着穿，如果补偿的话是多少？",
          time: "14:15"
        }
      ]
    },
    {
      id: "demo-2",
      queueStatus: "pending",
      assignee: "",
      queueHint: "物流异常 · 等待接单",
      priority: "中优先级",
      name: "Marcus Wright",
      message: "顺丰单号查不到信息",
      time: "14:02",
      tags: ["售中"],
      sla: "urgent",
      summary: {
        phase: "待分配",
        pending: "物流轨迹确认",
        route: "物流异常排查"
      },
      order: {
        id: "#ORD-3402-2024",
        product: "420g 毛圈宽松连帽卫衣",
        level: "V2",
        profile: "普通客群 · 无投诉记录",
        orderStatus: "已发货",
        logisticsStatus: "运输中",
        afterSaleStatus: "未发起"
      },
      diagnosis: {
        status: "物流异常（待排查）",
        risk: "中风险（SLA 临期）",
        action:
          "建议先核查物流节点与承运商揽收状态，再决定是否补偿或升级工单。",
        pending: "需确认最新物流轨迹"
      },
      script:
        "您好，已收到您的物流反馈。我会先为您核查最新的物流轨迹与承运状态，如确认出现异常，会第一时间为您跟进处理。",
      evidence: [
        {
          title: "物流异常处理 SOP",
          detail: "超过 24 小时无新轨迹时，需先核查承运商揽收与转运节点，再决定是否升级处理。"
        }
      ],
      logic: [
        "会话已进入人工池，但尚未被具体客服接手。",
        "当前不建议直接承诺补偿，优先核查物流节点。",
        "如承运商确认异常，再决定是否转工单。"
      ],
      messages: [
        {
          type: "user",
          content: "顺丰单号查不到信息",
          time: "14:02"
        }
      ]
    },
    {
      id: "demo-3",
      queueStatus: "transferred",
      assignee: "售后专员组",
      queueHint: "已升级工单处理",
      priority: "已转工单",
      name: "Sophia Loren",
      message: "尺码建议帮我看下",
      time: "13:50",
      tags: ["售前"],
      sla: "normal",
      summary: {
        phase: "已转工单",
        pending: "等待专员回执",
        route: "高级人工跟进"
      },
      order: {
        id: "#ORD-1208-2024",
        product: "法式缎面垂感翻领衬衫",
        level: "V1",
        profile: "普通客群 · 新客",
        orderStatus: "已发货",
        logisticsStatus: "运输中",
        afterSaleStatus: "工单处理中"
      },
      diagnosis: {
        status: "工单升级完成",
        risk: "需专员跟进",
        action: "当前会话已转入人工工单流程，由售后专员统一处理。",
        pending: "等待专员回执"
      },
      script:
        "您好，当前问题已升级给专员进一步跟进，稍后会由人工团队为您回复更准确的处理结果。",
      evidence: [
        {
          title: "工单升级记录",
          detail: "当前会话已转入专员队列，等待进一步处理。"
        }
      ],
      logic: [
        "当前问题已脱离普通客服处理范围。",
        "系统已完成转工单动作。",
        "前台客服仅需记录当前状态。"
      ],
      messages: [
        {
          type: "system",
          content: "当前问题已转交售后专员继续处理。",
          time: "13:50"
        }
      ]
    }
  ]
};

export const fallbackKnowledgeState = {
  stats: [
    { label: "商品知识总量", value: "1,284" },
    { label: "FAQ 文档", value: "498" },
    { label: "低命中知识块", value: "12", urgent: true },
    { label: "待复核异常", value: "5", urgent: true }
  ],
  entries: [
    {
      id: "doc-1",
      type: "商品知识",
      name: "2024 夏季真丝系列护理标准",
      source: "Silk_Care_Guide.pdf",
      time: "14:00",
      status: "已启用",
      hits: "1.2k",
      health: 96
    },
    {
      id: "doc-2",
      type: "FAQ",
      name: "全球退换货政策（V4.0）",
      source: "Global_Return.docx",
      time: "昨日",
      status: "待复核",
      hits: "456",
      health: 58
    },
    {
      id: "doc-3",
      type: "FAQ",
      name: "会员积分抵扣逻辑",
      source: "Points_Rules.md",
      time: "03-20",
      status: "已启用",
      hits: "890",
      health: 91
    },
    {
      id: "doc-4",
      type: "FAQ",
      name: "跨境物流加价公示",
      source: "Logistics_Fee.xlsx",
      time: "03-18",
      status: "已停用",
      hits: "0",
      health: 8
    }
  ],
  chunksByDoc: {
    "doc-1": [
      {
        id: "CHUNK-01",
        content: "真丝面料需使用 30°C 以下温水手洗，避免使用碱性洗涤剂。",
        hits: "高（92%）",
        level: "normal"
      },
      {
        id: "CHUNK-02",
        content: "洗涤后请勿拧干，应平铺在阴凉处晾干，严禁暴晒。",
        hits: "中（65%）",
        level: "normal"
      },
      {
        id: "CHUNK-03",
        content: "熨烫温度需控制在 110°C 以下，建议垫布低温熨烫。",
        hits: "极低（3%）",
        level: "warning",
        reason: "该知识块命中偏低，建议补充更贴近用户问法的关键词。"
      }
    ],
    "doc-2": [
      {
        id: "CHUNK-04",
        content: "V4 以上客户针对轻微外观瑕疵，可在 5%-15% 范围内通融补偿。",
        hits: "中（54%）",
        level: "normal"
      },
      {
        id: "CHUNK-05",
        content: "如描述与《高净值客户售后通融处理办法》存在冲突，需提交人工复核。",
        hits: "冲突",
        level: "error",
        reason: "与当前售后补偿规则存在解释差异，建议回源文档复核。"
      }
    ]
  },
  governance: {
    version: "v4.2.10-STABLE",
    lastEditor: "张运营",
    syncedAt: "10 分钟前"
  }
};

export const fallbackAnalyticsState = {
  stats: [
    { label: "人工接入会话", value: "12", delta: "+2" },
    { label: "待分配会话", value: "4", delta: "需尽快接单" },
    { label: "转人工率", value: "25%", delta: "已转工单 3" },
    { label: "bad case 收集", value: "2", delta: "待复盘 1" }
  ],
  scenarioDistribution: [
    { label: "售前", ratio: 44, tone: "bg-[#1E352B]" },
    { label: "售中", ratio: 28, tone: "bg-[#8BA190]" },
    { label: "售后", ratio: 23, tone: "bg-[#C7B38D]" },
    { label: "高风险", ratio: 5, tone: "bg-[#D37E6A]" }
  ],
  cases: [
    {
      title: "已签收仅退款误判",
      reason: "早期逻辑没有充分区分已签收与待发货场景。",
      action: "改成状态判断 + 下一步建议 + 复杂单转人工。",
      result: "相关离线样本通过率由 33.33% 提升至 100%。"
    },
    {
      title: "长尾商品属性乱答",
      reason: "商品知识字段覆盖不均，未标注属性缺少保守回复与澄清策略。",
      action: "补充拒答策略、澄清问法模板，并将相关问题沉淀为 bad case 回流。",
      result: "开放问法下回答更稳定，复杂问题更容易识别并转人工处理。"
    }
  ],
  nextAction: "当前已收集 2 条 bad case，转人工率为 25%。建议优先复盘已转工单与高风险场景，持续完善人工接管策略。"
};
