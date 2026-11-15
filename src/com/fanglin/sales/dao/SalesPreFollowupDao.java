package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesPreFollowupPO;

public interface SalesPreFollowupDao extends Dao<SalesPreFollowupPO> {

	/**
	 * 按装修单号查询有效售前跟单记录(createTime倒序)
	 */
	List<SalesPreFollowupPO> querySalesPreFollowupByOrderId(String orderId);

	/**
	 * 统计有效售前跟单记录: [总数, 最近跟进时间, 超期计划数(planTime<今日)]
	 */
	Object[] countSalesPreFollowup(String orderId);

}
