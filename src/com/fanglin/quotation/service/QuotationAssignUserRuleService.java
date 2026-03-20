/**
 * @File Name     : QuotationAssignUserRuleService.java
 * @Package      : com.fanglin.quotation.service
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员规则表 Service 接口
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.exception.FLException;
import com.fanglin.core.dao.Page;
import com.fanglin.core.dao.Filter;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;

/**
 * 预算员规则表 Service 接口
 *
 * <p>
 * 职责：提供预算员规则的业务逻辑处理
 * </p>
 *
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>规则查询（分页、详情）</li>
 * <li>规则管理（新增、编辑、删除）</li>
 * <li>状态管理（启用/停止、更新完成时间）</li>
 * <li>可用预算员查询（用于自动分配）</li>
 * </ul>
 *
 * @author Claude AI
 * @version 1.0
 */
public interface QuotationAssignUserRuleService {

	/**
	 * 分页查询预算员规则列表
	 *
	 * @param page 分页对象
	 * @param filters 过滤条件
	 * @throws FLException 业务异常
	 */
	void pageQuotationAssignUserRule(Page page, List<Filter> filters) throws FLException;

	/**
	 * 根据ID查询预算员规则（用于编辑回显）
	 *
	 * @param quotationAssignUserRule 预算员规则VO对象（包含 qaurid）
	 * @return 预算员规则VO对象，不存在则返回 NULL
	 * @throws FLException 业务异常
	 */
	QuotationAssignUserRuleVO queryQuotationAssignUserRuleById(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 新增预算员规则
	 *
	 * @param quotationAssignUserRule 预算员规则VO对象
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常（如：用户公司组合重复）
	 */
	int createQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 更新预算员规则
	 *
	 * @param quotationAssignUserRule 预算员规则VO对象
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常（如：用户公司组合重复）
	 */
	int updateQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 删除预算员规则
	 *
	 * @param quotationAssignUserRule 预算员规则VO对象（包含 qaurid）
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常
	 */
	int deleteQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 更新预算员状态（快捷操作）
	 *
	 * @param quotationAssignUserRule 预算员规则VO对象（包含 qaurid 和 status）
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常
	 */
	int updateQuotationAssignUserRuleForStatus(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 查询所有可分配的预算员（status=1，按最后完成时间排序）
	 * 注意：此方法不暴露给Action，仅用于内部自动分配逻辑
	 *
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示查询所有部门）
	 * @return 预算员规则PO列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRuleVO> queryAvailableUsers(int company, Integer department) throws FLException;

	/**
	 * 更新最后完成时间（内部方法，用于自动分配完成后更新）
	 * 注意：此方法不暴露给Action，仅用于内部自动分配逻辑
	 *
	 * @param quotationAssignUserRule 预算员规则VO对象（包含 qaurid 和 lastFinishTime）
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常
	 */
	int updateLastFinishTime(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;
}
