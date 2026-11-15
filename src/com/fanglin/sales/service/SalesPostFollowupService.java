package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesPostFollowupVO;

public interface SalesPostFollowupService {

	/**
	 * 按销售单查询有效售后跟单记录(createTime倒序)
	 */
	List<SalesPostFollowupVO> querySalesPostFollowupBySid(SalesPostFollowupVO salesPostFollowup) throws FLException;

	/**
	 * 统计销售单有效售后跟单记录(总数/最近跟进时间/超期计划数)
	 */
	SalesPostFollowupVO countSalesPostFollowup(SalesPostFollowupVO salesPostFollowup) throws FLException;

	/**
	 * 新增售后跟单记录(销售单存在即可,不限状态)
	 */
	void addSalesPostFollowup(SalesPostFollowupVO salesPostFollowup, String userId) throws FLException;

	/**
	 * 逻辑删除售后跟单记录(仅记录人本人)
	 */
	void deleteSalesPostFollowup(SalesPostFollowupVO salesPostFollowup, String userId) throws FLException;

}
