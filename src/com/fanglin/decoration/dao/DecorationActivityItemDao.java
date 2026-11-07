/**
 * @File Name		: DecorationActivityItemDao.java
 * @Package   	: com.fanglin.decoration.dao
 * @Version		: 1.0
 * @Date			: 2015-11-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.utils.Paging;

public interface DecorationActivityItemDao extends Dao<DecorationActivityItemPO> {

	public List<DecorationActivityItemPO> queryDecorationActivityItemByOrderId(String orderId);

	public List<DecorationActivityItemPO> queryDecorationActivityItem(String orderId, String no);

	public long amountDecorationActivityItem(String orderId, short isPayment);

	public long amountDecorationActivityItem(String orderId, Short type, Short isPrefor, Short isPayment);

	public long pointDecorationActivityItem(String orderId);

	/**
	 * 统计活动项目数量（使用 COUNT(*)）
	 * 
	 * @param orderId 订单号
	 * @param type 活动类型（可选）
	 * @param states 状态列表（可选）
	 * @param isPrefor 是否计算业绩（可选）
	 * @param isPayment 是否计算金额（可选）
	 * @return 活动项目数量
	 */
	public long countDecorationActivityItem(String orderId, Short type, List<Short> states, Short isPrefor, Short isPayment);

	/**
	 * 统计指定 no（线上活动物品编号）下的活动物品数量（排除失效 state=1），用于全局唯一性校验
	 *
	 * @param no 活动物品编号
	 * @return 活动物品数量
	 */
	public long countDecorationActivityItem(String no);

	/**
	 * 批量核销:将指定订单 atttype 下、状态为初始(state=0)的物品置为目标核销态（仅初始态可被核销,其它状态一律不动）
	 *
	 * @param orderId 订单号
	 * @param atttype 线上线下标识
	 * @param targetState 目标状态
	 * @param excludeStates 排除状态集合（可选,在初始态基础上进一步排除）
	 * @param receiverId 核销人ID
	 * @return 受影响行数
	 */
	public int banchDecorationActivityItem(String orderId, short atttype, short targetState, List<Short> excludeStates, long receiverId);

	/**
	 * 查询订单下可回收的抽奖券(未中奖未领用): type=券 + asid∈规则奖品 + state=初始, daiId 逆序
	 * 抽奖(state=11, 抽奖系统回写)/已领(10)等非初始态天然不在候选
	 *
	 * @param orderId 订单号
	 * @param asids 抽奖规则指向的奖品档案ID集合
	 * @return 可回收券行
	 */
	public List<DecorationActivityItemPO> queryDecorationActivityItemForLottery(String orderId, List<Long> asids);

	/**
	 * 统计订单下已发有效抽奖券数(count): type=券 + asid∈规则奖品 + state∉{1失效, 3退货}
	 *
	 * @param orderId 订单号
	 * @param asids 抽奖规则指向的奖品档案ID集合
	 * @return 已发有效券数
	 */
	public int countDecorationActivityItemForLottery(String orderId, List<Long> asids);

	/**
	 * 分页查询活动物品(覆盖全部活动类型/全部type): 白名单条件 orderId/no/activityName/activityItemName/type/state/atttype
	 */
	public List<DecorationActivityItemPO> pageDecorationActivityItem(Paging paging, List<Filter> filters) throws FLException;

}
