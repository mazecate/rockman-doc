export interface ChipsSubmenuConfig {
  standard?: boolean; // 標準晶片
  mega?: boolean; // MEGA 晶片
  giga?: boolean; // GIGA 晶片
  dark?: boolean; // 暗黑晶片
  secret?: boolean; // 隱藏/祕密晶片
}

export interface MenuConfig {
	walkthrough?: boolean; // 流程攻略
  trader?: boolean; // 數字交易機 / 號碼交易機
  navi?: boolean; // 機兵位置
  pa?: boolean; // 程式進化
  chips?: boolean | ChipsSubmenuConfig;
  powerups?: boolean; // 強化部件
  stars?: boolean; // 星之證
  shops?: boolean; // 商店
  sidequest?: boolean; // 支線任
}
