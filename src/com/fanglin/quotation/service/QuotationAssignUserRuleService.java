package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;
import com.fanglin.utils.Paging;

/**
 * 报价单预算员规则表 Service 接口 职责: 管理预算员的分配规则（状态、任务数、完成时间等）
 */
public interface QuotationAssignUserRuleService {

	/**
	 * 根据用户ID和公司ID查询预算员规则
	 * 
	 * @param quotationAssignUserRule 预算员规则VO（包含uid和company）
	 * @return 预算员规则VO
	 */
	QuotationAssignUserRuleVO queryQuotationAssignUserRuleByUidAndCompany(QuotationAssignUserRuleVO quotationAssignUserRule);

	/**
	 * 查询待分配且完成时间最早的预算员列表
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 预算员规则列表
	 */
	List<QuotationAssignUserRuleVO> pullQuotationAssignUserRule(int company, Integer department);

	/**
	 * 根据用户ID查询预算员规则
	 * 
	 * @param quotationAssignUserRule 预算员规则VO（包含uid）
	 * @return 预算员规则VO
	 */
	QuotationAssignUserRuleVO queryQuotationAssignUserRuleByUid(QuotationAssignUserRuleVO quotationAssignUserRule);

	/**
	 * 查询公司的所有预算员
	 * 
	 * @param company 公司ID
	 * @return 预算员规则列表
	 */
	List<QuotationAssignUserRuleVO> queryQuotationAssignUserRuleByCompany(int company);

	/**
	 * 查询指定部门的预算员列表
	 * 
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 预算员规则列表
	 */
	List<QuotationAssignUserRuleVO> queryQuotationAssignUserRuleByDepartment(int company, int department);

	/**
	 * 查询可用的预算员列表（状态为待分配）
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 预算员规则列表
	 */
	List<QuotationAssignUserRuleVO> pullAvailableQuotationAssignUserRule(int company, Integer department);

	/**
	 * 更新预算员状态和任务数量
	 * 
	 * @param quotationAssignUserRule 预算员规则VO（包含uid、status、currentTaskCount）
	 * @throws FLException
	 */
	void updateStatusAndTaskCount(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 统计预算员的当前任务数（基于 quotationassignrequest）
	 * 
	 * @param quotationAssignUserRule 预算员规则VO（包含uid）
	 * @return 任务数量
	 */
	int countQuotationAssignTaskByUid(QuotationAssignUserRuleVO quotationAssignUserRule);

	/**
	 * 统计公司的预算员数量
	 * 
	 * @param company 公司ID
	 * @return 数量
	 */
	int countQuotationAssignUserRuleByCompany(int company);

	/**
	 * 统计指定部门的预算员数量
	 * 
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 数量
	 */
	int countQuotationAssignUserRuleByDepartment(int company, int department);

	/**
	 * 检查用户是否为预算员
	 * 
	 * @param quotationAssignUserRule 预算员规则VO（包含uid和company）
	 * @return 数量（0表示不是，>0表示是）
	 */
	int existQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule);

	/**
	 * 禁用预算员（设置状态为停止）
	 * 
	 * @param quotationAssignUserRule 预算员规则VO（包含uid）
	 * @throws FLException
	 */
	void disableQuotationAssignUserRuleByUid(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 启用预算员（设置状态为待分配）
	 * 
	 * @param quotationAssignUserRule 预算员规则VO（包含uid）
	 * @throws FLException
	 */
	void enableQuotationAssignUserRuleByUid(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 添加预算员规则
	 * 
	 * @param quotationAssignUserRule 预算员规则VO
	 * @param userId 当前操作用户ID
	 * @throws FLException
	 */
	void addQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule, String userId) throws FLException;

	/**
	 * 更新预算员规则
	 * 
	 * @param quotationAssignUserRule 预算员规则VO
	 * @param userId 当前操作用户ID
	 * @throws FLException
	 */
	void updateQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule, String userId) throws FLException;

	void pageQuotationAssignUserRule(Paging paging, List<Filter> filters, int queryCompany);
}
