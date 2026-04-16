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
	 * @param company 公司ID（可选）
	 * @return
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRulePO> pageQuotationAssignUserRule(Paging paging, List<Filter> filters, Integer company) throws FLException;

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

	/**
	 * 根据用户ID查询该预算员在所有公司的规则记录
	 * 
	 * @param userId 用户ID
	 * @return 该用户在所有公司的规则列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRulePO> queryQuotationAssignUserRuleByUserId(String userId) throws FLException;

	/**
	 * 查询所有待分配的预算员，且要求该预算员在所有公司中都处于待分配状态（跨公司验证）
	 * 
	 * <p>
	 * 逻辑：先按当前公司筛选 status=1 的预算员，再通过子查询排除在其他公司存在非待分配状态的预算员。
	 * 确保同一预算员不会因为其他公司的制作中任务而被重复分配。
	 * </p>
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示查询所有部门）
	 * @return 预算员规则列表（跨公司全部待分配）
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRulePO> queryQuotationAssignUserRuleForCrossCompany(int company, Integer department) throws FLException;
}
