package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.ActivityCostVO;
import com.fanglin.information.po.ActivityItemPO;

public interface DecorationActivityCostService {

	/**
	 * 额度类判定: 配置端 activityitem.type >= 10(10/11/12 = 额度的券/物品/红包, 对齐 0=券/1=物品/2=红包 语义)。
	 */
	boolean isCostItem(ActivityItemPO activityItemPO);

	/**
	 * 创建前校验(单条): 非额度类/配置反查不到/金额无效/未配置/请求异常 → 返回 null(跳过校验放行创建);
	 * 接口明确 usable=false → 抛 140108(reason 原文)拦截创建; 校验通过 → 返回缓存档快照。
	 *
	 * @param orderId 装修单号
	 * @param userId 员工编码(当前登录人/审批发起人), 即接口 staffCode
	 * @param activityItemPO 活动物品配置(调用方按 aiid 直查或 asid 反查, 可为 null)
	 * @param money 物品单价(厘)
	 * @param num 数量(毫个)
	 */
	ActivityCostVO queryActivityCost(String orderId, String userId, ActivityItemPO activityItemPO, int money, int num) throws FLException;

	/**
	 * 创建前校验(合并金额): 审批路径同单同员工多明细合并金额一次校验(N 次现算 → 1 次)。
	 * 语义同单条版: 仅接口明确 usable=false 才抛 140108, 其余一切异常返回 null 跳过放行。
	 *
	 * @param amount 合并申请额度(元)
	 */
	ActivityCostVO queryActivityCost(String orderId, String userId, long amount) throws FLException;

	/**
	 * 落缓存档(物品行 save 之后调, 携带 daiId): 只写档, 仅校验通过(snapshot 非 null)落行。
	 *
	 * @param money 物品单价(厘)
	 * @param num 数量(毫个); cost.money = 本次使用总额(厘) = money×num÷10³
	 */
	void addActivityCost(String orderId, long daiId, int money, int num, ActivityCostVO snapshot, Integer company);

	/**
	 * 额度值独立更新入口: 按单重调 validate 接口(逐缓存行以行内 money÷1000 为校验金额, 身份=装修单设计师),
	 * 用最新 availableAmount/perOrderLimit 回写该单全部缓存行的 balance/toplimit/createTime。
	 * 与创建校验不同: usable=false 不视为异常, 照常回写并在 summary 标注(便于额度治理对账);
	 * 无缓存行(140109)/装修单或设计师缺失(140013)/接口不可用(140110) 才抛错。
	 *
	 * @return 逐行更新结果(balance/toplimit 厘 + summary 含 usable/reason)
	 */
	List<ActivityCostVO> updateDecorationActivityCost(String orderId) throws FLException;

}
