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
      noneOf?: string[];
      only?: string[];
      empty?: boolean;
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

export const plasmaCell: AppraisalItem = {
  id: 'plasma-cell',
  name: '等离子燃料匣',
  category: '动力 / 能源组件',
  icon: '🔋',
  tagline:
    '高能等离子体密封储存容器，按品牌、外壳品相、额外瑕疵加固与等离子色态核定价值。',
  basePrice: 300,
  floorPrice: 90,
  currency: '¢',
  checkpoints: [
    {
      id: 'brand',
      label: '品牌',
      caption: '制造工坊或军警后勤部门标识',
      icon: '🏷️',
      options: [
        { id: 'wld', label: 'WLD', delta: 0, note: '王尔德载具' },
        { id: 'rnr', label: 'RNR', delta: 0, note: '共和国海军征用部' },
        { id: 'zhs', label: 'ZHS', delta: 0, note: '中华船舶' },
        { id: 'ign', label: 'IGN', delta: 0, note: '点火实验室' },
      ],
    },
    {
      id: 'condition',
      label: '品相',
      caption: '外壳整体损耗与使用程度',
      icon: '◴',
      options: [
        { id: 'standard', label: '标准', delta: 0, note: '基准品相' },
        { id: 'light_wear', label: '轻度磨损', delta: -45, note: '轻度表层磨损' },
        { id: 'heavy_wear', label: '重度磨损', delta: -90, note: '重度外壳损伤' },
      ],
    },
    {
      id: 'extra',
      label: '额外品相',
      caption: '外壳特殊受损或改装加固情况（可多选）',
      icon: '✦',
      multiple: true,
      optional: true,
      options: [
        { id: 'rupture', label: '破裂', delta: -150, note: '外壳开裂破损' },
        { id: 'screws', label: '螺丝外露', delta: -30, note: '固定螺栓凸出外露' },
        { id: 'reinforced', label: '加固', delta: 60, note: '加装外部防爆加强件' },
        { id: 'none', label: '无额外品相', delta: 0, note: '外观完好无缺陷/加固' },
      ],
    },
    {
      id: 'color',
      label: '等离子颜色',
      caption: '匣内高能等离子流体的充能色态',
      icon: '⚡',
      options: [
        { id: 'standard', label: '标准（深蓝）', delta: 0, note: '标准深蓝色态' },
        { id: 'high', label: '高级（紫红）', delta: 150, note: '超能紫红色态' },
        { id: 'low', label: '低级（其他颜色）', delta: -150, note: '杂质超标偏色态' },
      ],
    },
  ],
  bonuses: [
    {
      id: 'wld-set',
      label: 'WLD套装',
      formula: 'WLD + 任意品相 + 颜色低级或标准',
      bonus: 60,
      requires: {
        brand: ['wld'],
        condition: ['standard', 'light_wear', 'heavy_wear'],
        color: ['low', 'standard'],
      },
    },
    {
      id: 'zhs-set',
      label: 'ZHS套装',
      formula: 'ZHS + 品相标准，可能有加固 + 颜色标准',
      bonus: 120,
      requires: {
        brand: ['zhs'],
        condition: ['standard'],
        color: ['standard'],
        extra: { only: ['reinforced'] },
      },
    },
    {
      id: 'rnr-set',
      label: 'RNR套装',
      formula: 'RNR + 破裂以外的任意品相皆可 + 颜色标准',
      bonus: 120,
      requires: {
        brand: ['rnr'],
        condition: ['standard', 'light_wear', 'heavy_wear'],
        color: ['standard'],
        extra: { noneOf: ['rupture'] },
      },
    },
    {
      id: 'ign-set',
      label: 'IGN套装',
      formula: 'IGN + 品相标准，无额外品相 + 颜色高级',
      bonus: 750,
      requires: {
        brand: ['ign'],
        condition: ['standard'],
        color: ['high'],
        extra: { empty: true },
      },
    },
  ],
};

export const items: AppraisalItem[] = [tacticalGloves, ribwich, plasmaCell];
