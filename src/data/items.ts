export type SelectionValue = string | string[];

export type Selection = Record<string, SelectionValue | undefined>;

export type AppraisalOption = {
  id: string;
  label: string;
  delta: number;
  note?: string;
};

export type Checkpoint = {
  id: string;
  label: string;
  caption: string;
  icon: string;
  multiple?: boolean;
  options: AppraisalOption[];
};

export type RequirementCondition =
  | string[]
  | {
      any?: string[];
      all?: string[];
      exact?: string[];
    };

export type BonusRule = {
  id: string;
  label: string;
  formula: string;
  bonus: number;
  requires: Record<string, RequirementCondition>;
};

export type AppraisalItem = {
  id: string;
  name: string;
  category: string;
  icon: string;
  tagline: string;
  basePrice: number;
  floorPrice: number;
  currency: string;
  checkpoints: Checkpoint[];
  bonuses: BonusRule[];
};

export const tacticalGloves: AppraisalItem = {
  id: "tactical-gloves",
  name: "战术手套",
  category: "外骨骼 / 手部",
  icon: "🧤",
  tagline: "军规级作战手套，按材质、磨损、接口与配件四项检查点定价。",
  basePrice: 100,
  floorPrice: 50,
  currency: "¢",
  checkpoints: [
    {
      id: "material",
      label: "材质",
      caption: "主体骨架所用的复合材料",
      icon: "⬢",
      options: [
        { id: "alu", label: "铝", delta: 0, note: "标准量产" },
        { id: "carbon", label: "碳", delta: 50, note: "碳纤编织" },
        { id: "gold", label: "金", delta: 200, note: "镀金导流" },
      ],
    },
    {
      id: "wear",
      label: "磨损",
      caption: "表面与关节的使用痕迹",
      icon: "◴",
      options: [
        { id: "new", label: "全新", delta: 0, note: "未拆封" },
        { id: "worn", label: "磨损", delta: -35, note: "有使用痕迹" },
        { id: "damaged", label: "受损", delta: -85, note: "结构受创" },
      ],
    },
    {
      id: "port",
      label: "接口",
      caption: "与义体/神经系统的连接规格",
      icon: "⌁",
      options: [
        { id: "emg", label: "EMG", delta: 0, note: "肌电基础版" },
        { id: "emg-plus", label: "EMG+", delta: 45, note: "增强肌电" },
        { id: "neural", label: "神经", delta: 120, note: "直连神经束" },
        { id: "none", label: "无规格", delta: -60, note: "无法接入" },
      ],
    },
    {
      id: "attachment",
      label: "配件",
      caption: "附加在手背与指节的模块",
      icon: "✦",
      multiple: true,
      options: [
        { id: "armor", label: "装甲", delta: 50, note: "指节护甲" },
        { id: "blade", label: "刀刃", delta: 80, note: "伸缩刃" },
        { id: "none", label: "无配件", delta: 0, note: "裸装" },
      ],
    },
  ],
  bonuses: [
    {
      id: "tactical-set",
      label: "战术套装",
      formula: "碳 + EMG+/神经 + 全新 + 刀刃与装甲",
      bonus: 100,
      requires: {
        material: ["carbon"],
        port: ["emg-plus", "neural"],
        wear: ["new"],
        attachment: { all: ["blade", "armor"] },
      },
    },
    {
      id: "luxury-set",
      label: "豪华套装",
      formula: "金 + 神经 + 全新 + 无配件",
      bonus: 200,
      requires: {
        material: ["gold"],
        port: ["neural"],
        wear: ["new"],
        attachment: { exact: ["none"] },
      },
    },
  ],
};

export const items: AppraisalItem[] = [tacticalGloves];

export const upcomingItems = [
  { id: "visor", name: "战术目镜", icon: "🥽", category: "头部 / 光学" },
  { id: "boots", name: "缓冲战靴", icon: "🥾", category: "外骨骼 / 足部" },
  { id: "spine", name: "脊椎增幅器", icon: "🦾", category: "躯干 / 神经" },
];
