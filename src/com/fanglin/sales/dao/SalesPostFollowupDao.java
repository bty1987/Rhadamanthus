package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesPostFollowupPO;

public interface SalesPostFollowupDao extends Dao<SalesPostFollowupPO> {

	/**
	 * 按销售单ID查询有效售后跟单记录(createTime倒序)
	 */
	List<SalesPostFollowupPO> querySalesPostFollowupBySid(long sid);

	/**
	 * 统计有效售后跟单记录: [总数, 最近跟进时间, 超期计划数(planTime<今日)]
	 */
	Object[] countSalesPostFollowup(long sid);

}
