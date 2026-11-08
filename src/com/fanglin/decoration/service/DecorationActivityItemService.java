/**
 * @File Name		: decorationActivityItemService.java
 * @Package   	: com.fanglin.decoration.service
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.utils.Paging;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.decoration.vo.DecorationVO;

public interface DecorationActivityItemService {

	public List<DecorationActivityItemVO> queryDecorationActivityItemByOrderId(DecorationVO decorationVO);

	public int addDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int receiveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int abateDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int deliveDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int unrefundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int refundDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int expendDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int discountDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int consumeDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int amountDecorationActivityItem(DecorationVO decorationVO, String userId) throws FLException;

	public long pointDecorationActivityItem(DecorationVO decorationVO, String userId) throws FLException;

	public void sendDecorationActivityItem(DecorationActivityItemVO decorationActivityItemVO, String userId) throws FLException;

	public int affirmDecorationActivityItem(DecorationVO decorationVO, List<DecorationActivityItemVO> decorationActivityItems, String securityCode, String verifyCode, String phoneCode, String company) throws FLException;


	/**
	 * 抽奖券发放(收款/提现链插桩调用): 定位活动+Σ规则行算应得, 与已发有效券 diff 补发/回收
	 *
	 * @param orderId 订单号
	 * @param userId 操作人(收款/提现操作员)
	 * @return 本次补发张数(回收为负)
	 */
	public int issueDecorationActivityItemByOrderId(String orderId, String userId) throws FLException;

	/**
	 * 抽奖券全量补发入口(上线当天手动触发一次, 幂等可重跑): 扫活动窗口内签约单逐单发放
	 *
	 * @param aid 活动ID
	 * @param userId 操作人
	 * @return 补发总张数
	 */
	public int issueDecorationActivityItem(long aid, String userId) throws FLException;

	/**
	 * 分页查询活动物品(覆盖全部活动类型/全部type, 白名单条件: 订单号/券编码/活动名/奖励名/类型/状态/线上线下)
	 */
	public void pageDecorationActivityItem(Paging paging, List<Filter> filters) throws FLException;
	/**
	 * 阶梯抽奖活动: 添加 type=30 活动物品触发参与预占(每单一张, 窗口/清零守卫在 settle 内; 真实档位由结算按库存定)
	 *
	 * @return 1=预占成功/0=幂等跳过(已预占)
	 */
	public int settleLadderActivityItemForJoin(String orderId, long aid, String userId) throws FLException;

	/**
	 * 阶梯抽奖活动: 签约结算(以预占行aid锚定活动, 原子扣减降级循环——按剩余量沿面值降级, 数量不够保持初始等领取)
	 *
	 * @return 1=发放已领/0=全清零保持初始
	 */
	public int settleLadderActivityItemForContract(String orderId, String userId) throws FLException;

	/**
	 * 阶梯券选券数据源: 本装修单 type=30/state=2 已领的阶梯券行(销售收款选券抵扣用)
	 */
	public List<DecorationActivityItemVO> queryDecorationActivityItemForScale(DecorationVO decorationVO);
}
