export interface NaviCustSubmenuConfig {
  intro?: boolean | string;
  programs?: boolean;          // 程式零件
  rotate?: boolean;          // 旋轉零件
}

export interface ChipsSubmenuConfig {
  standard?: boolean; // 標準晶片
  mega?: boolean; // MEGA 晶片
  giga?: boolean; // GIGA 晶片
  dark?: boolean; // 暗黑晶片
  secret?: boolean; // 隱藏/祕密晶片
  versions?: Record<string, {
    mega?: boolean;
    giga?: boolean;
  }>;
}

export interface MenuConfig {
	walkthrough?: boolean; // 流程攻略(表關)
	underworld?: boolean; // 裏關
  trader?: boolean; // 數字交易機 / 號碼交易機
  naviloc?: boolean; // 機兵位置
  pa?: boolean; // 程式進化
  navicust?: boolean | NaviCustSubmenuConfig;
  chips?: boolean | ChipsSubmenuConfig;
  powerups?: boolean; // 強化部件
  stars?: boolean; // 星之證
  shops?: boolean; // 商店
  sidequest?: boolean; // 支線任
  chiptrade?: boolean; // 晶片交換
  virusbreeding?: boolean; // 病毒飼育
}
