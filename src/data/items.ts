export type SelectionValue = string | string[];

export type Selection = Record<string, SelectionValue | undefined>;

export type AppraisalOption = {
  id: string;
  label: string;
  delta: number;
  note?: string;
};

export enum CheckpointType {
  Options = 'options',
  Batch = 'batch',
  Factory = 'factory',
}

type BaseCheckpoint = {
  id: string;
  label: string;
  caption: string;
  icon: string;
};

export type OptionsCheckpoint = BaseCheckpoint & {
  type?: CheckpointType.Options;
  multiple?: boolean;
  optional?: boolean;
  options: AppraisalOption[];
};

export type BatchCheckpoint = BaseCheckpoint & {
  type: CheckpointType.Batch;
};

export type FactoryCheckpoint = BaseCheckpoint & {
  type: CheckpointType.Factory;
};

export type Checkpoint =
  | OptionsCheckpoint
  | BatchCheckpoint
  | FactoryCheckpoint;

export type CheckpointOptions = OptionsCheckpoint;
export type CheckpointBatch = BatchCheckpoint;
export type CheckpointFactory = FactoryCheckpoint;

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
  id: 'tactical-gloves',
  name: '战术手套',
  category: '外骨骼 / 手部',
  icon: '🧤',
  tagline: '军规级作战手套，按材质、磨损、接口与配件四项检查点定价。',
  basePrice: 100,
  floorPrice: 50,
  currency: '¢',
  checkpoints: [
    {
      id: 'material',
      label: '材质',
      caption: '主体骨架所用的复合材料',
      icon: '⬢',
      options: [
        { id: 'alu', label: '铝', delta: 0, note: '标准量产' },
        { id: 'carbon', label: '碳', delta: 50, note: '碳纤编织' },
        { id: 'gold', label: '金', delta: 200, note: '镀金导流' },
      ],
    },
    {
      id: 'wear',
      label: '磨损',
      caption: '表面与关节的使用痕迹',
      icon: '◴',
      options: [
        { id: 'new', label: '全新', delta: 0, note: '未拆封' },
        { id: 'worn', label: '磨损', delta: -35, note: '有使用痕迹' },
        { id: 'damaged', label: '受损', delta: -85, note: '结构受创' },
      ],
    },
    {
      id: 'port',
      label: '接口',
      caption: '与义体/神经系统的连接规格',
      icon: '⌁',
      options: [
        { id: 'emg', label: 'EMG', delta: 0, note: '肌电基础版' },
        { id: 'emg-plus', label: 'EMG+', delta: 45, note: '增强肌电' },
        { id: 'neural', label: '神经', delta: 120, note: '直连神经束' },
        { id: 'none', label: '无规格', delta: -60, note: '无法接入' },
      ],
    },
    {
      id: 'attachment',
      label: '配件',
      caption: '附加在手背与指节的模块',
      icon: '✦',
      multiple: true,
      options: [
        { id: 'armor', label: '装甲', delta: 50, note: '指节护甲' },
        { id: 'blade', label: '刀刃', delta: 80, note: '伸缩刃' },
        { id: 'none', label: '无配件', delta: 0, note: '裸装' },
      ],
    },
  ],
  bonuses: [
    {
      id: 'tactical-set',
      label: '战术套装',
      formula: '碳 + EMG+/神经 + 全新 + 刀刃与装甲',
      bonus: 100,
      requires: {
        material: ['carbon'],
        port: ['emg-plus', 'neural'],
        wear: ['new'],
        attachment: { all: ['blade', 'armor'] },
      },
    },
    {
      id: 'luxury-set',
      label: '豪华套装',
      formula: '金 + 神经 + 全新 + 无配件',
      bonus: 200,
      requires: {
        material: ['gold'],
        port: ['neural'],
        wear: ['new'],
        attachment: { exact: ['none'] },
      },
    },
  ],
};

export const ribwich: AppraisalItem = {
  id: 'ribwich',
  name: '肋明治',
  category: '食品 / 传说级快餐',
  icon: '🥪',
  tagline:
    '风靡全城的传说级合成肉排三明治，严格通过生产批次、包装工厂、配料与防伪标识核定真伪。',
  basePrice: 150,
  floorPrice: 40,
  currency: '¢',
  checkpoints: [
    {
      id: 'batch',
      type: CheckpointType.Batch,
      label: '生产批次',
      caption: '输入生产年/月（如 425年1月、438年12月）',
      icon: '📅',
    },
    {
      id: 'factory',
      type: CheckpointType.Factory,
      label: '包装工厂',
      caption: '输入两位数工厂代码（如 01、07、21 等）',
      icon: '🏭',
    },
    {
      id: 'ingredients',
      label: '豪华配料',
      caption: '核验加料（可选，芝麻面包与酸黄瓜须成对出现）',
      icon: '🥩',
      multiple: true,
      optional: true,
      options: [
        { id: 'patty2', label: '两块肉饼', delta: 800, note: '肉量翻倍' },
        {
          id: 'sesame',
          label: '芝麻面包',
          delta: 0,
          note: '须与酸黄瓜同时拥有',
        },
        {
          id: 'pickle',
          label: '酸黄瓜',
          delta: 0,
          note: '须与芝麻面包同时拥有',
        },
      ],
    },
    {
      id: 'da_logo',
      label: '防伪DA标识',
      caption: '外包装特制全息DA防伪印记',
      icon: '🛡️',
      options: [
        { id: 'valid', label: '正确标志', delta: 0, note: '官方正品防伪' },
        { id: 'invalid', label: '无或错误标志', delta: 0, note: '强制保底' },
      ],
    },
    {
      id: 'ribwich_logo',
      label: 'Ribwich标识',
      caption: '第一批次无标识，第二批次必须印有标识',
      icon: '🏷️',
      options: [
        { id: 'has', label: '有标识', delta: 0, note: '印有专属Ribwich徽标' },
        { id: 'none', label: '无标识', delta: 0, note: '未印专属徽标' },
      ],
    },
  ],
  bonuses: [
    {
      id: 'sesame-pickle-set',
      label: '经典佐料搭配',
      formula: '同时拥有芝麻面包和酸黄瓜',
      bonus: 300,
      requires: {
        ingredients: { all: ['sesame', 'pickle'] },
      },
    },
  ],
};

export const items: AppraisalItem[] = [tacticalGloves, ribwich];
