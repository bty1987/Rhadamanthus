package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.vo.SalesPreFollowupVO;

public interface SalesPreFollowupService {

	/**
	 * 按装修单查询有效售前跟单记录(createTime倒序)
	 */
	List<SalesPreFollowupVO> querySalesPreFollowupByOrderId(SalesPreFollowupVO salesPreFollowup) throws FLException;

	/**
	 * 统计装修单有效售前跟单记录(总数/最近跟进时间/超期计划数)
	 */
	SalesPreFollowupVO countSalesPreFollowup(SalesPreFollowupVO salesPreFollowup) throws FLException;

	/**
	 * 新增售前跟单记录(装修单存在即可,不限状态)
	 */
	void addSalesPreFollowup(SalesPreFollowupVO salesPreFollowup, String userId) throws FLException;

	/**
	 * 逻辑删除售前跟单记录(仅记录人本人)
	 */
	void deleteSalesPreFollowup(SalesPreFollowupVO salesPreFollowup, String userId) throws FLException;

}
