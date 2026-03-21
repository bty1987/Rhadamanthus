package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则表 DAO 接口
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
public interface QuotationAssignUserRuleDao extends Dao<QuotationAssignUserRulePO> {

	/**
	 * 分页查询预算员规则列表
	 * 
	 * @param page 分页对象
	 * @param filters 过滤条件
	 * @return
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRulePO> pageQuotationAssignUserRule(Paging paging, List<Filter> filters) throws FLException;

	/**
	 * 根据用户ID和公司ID查询预算员规则
	 * 
	 * @param uid 用户ID
	 * @param company 公司ID
	 * @return 预算员规则PO
	 * @throws FLException 业务异常
	 */
	QuotationAssignUserRulePO getQuotationAssignUserRule(String userId, int company) throws FLException;

	/**
	 * 查询所有待分配的预算员（status=1，按最后完成时间排序）
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示查询所有部门）
	 * @return 预算员规则列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRulePO> queryAvailableUsers(int company, Integer department) throws FLException;
}
