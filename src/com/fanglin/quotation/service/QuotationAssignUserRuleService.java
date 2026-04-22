/**
 * @File Name     : QuotationAssignUserRuleService.java
 * @Package      : com.fanglin.quotation.service
 * @Version       : 2.0
 * @Date          : 2026-04-21
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员规则表 Service 接口（人员维度）
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationAssignUserRuleItemVO;
import com.fanglin.quotation.vo.QuotationAssignUserRuleVO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则表 Service 接口
 * 
 * <p>
 * 职责：提供预算员规则的业务逻辑处理（人员维度）
 * </p>
 * 
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>规则查询（分页、详情、含明细）</li>
 * <li>规则管理（新增、编辑、删除）- 同时管理 UserRuleItem 明细</li>
 * <li>状态管理（启用/停止）</li>
 * <li>可用预算员查询（用于自动分配，按 Item 维度匹配公司/部门/类型）</li>
 * </ul>
 * 
 * @author Claude AI
 * @version 2.0
 */
public interface QuotationAssignUserRuleService {

	/**
	 * 根据规则ID查询明细列表
	 * 
	 * @param quotationAssignUserRuleItem 预算员规则明细VO（包含 qaurid）
	 * @return 明细VO列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRuleItemVO> queryQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO quotationAssignUserRuleItem) throws FLException;

	/**
	 * 分页查询预算员规则列表
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param company 公司ID（可选，通过 UserRuleItem 过滤）
	 * @throws FLException 业务异常
	 */
	void pageQuotationAssignUserRule(Paging paging, List<Filter> filters, Integer company) throws FLException;

	/**
	 * 根据ID查询预算员规则（含明细列表，用于编辑回显）
	 * 
	 * @param quotationAssignUserRule 预算员规则VO对象（包含 qaurid）
	 * @return 预算员规则VO对象（含 items），不存在则返回 NULL
	 * @throws FLException 业务异常
	 */
	QuotationAssignUserRuleVO queryQuotationAssignUserRuleById(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 查询所有可分配的预算员（status=1，按公司/部门/类型匹配）
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @param decorationType 装修类型（可选）
	 * @return 预算员规则VO列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRuleVO> queryQuotationAssignUserRuleForAvaile(int company, Integer department, Short decorationType) throws FLException;

	/**
	 * 新增预算员规则（同时创建明细项）
	 * 
	 * @param quotationAssignUserRule 预算员规则VO对象（含 items 列表）
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常（如：用户已存在规则）
	 */
	int createQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 更新预算员规则（同时更新明细项：先删后增）
	 * 
	 * @param quotationAssignUserRule 预算员规则VO对象（含 items 列表）
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常
	 */
	int updateQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 更新预算员状态（快捷操作）
	 * 
	 * @param quotationAssignUserRule 预算员规则VO对象（包含 qaurid 和 status）
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常
	 */
	int updateQuotationAssignUserRuleForStatus(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 更新最后完成时间（内部方法，用于自动分配完成后更新）
	 * 
	 * @param quotationAssignUserRule 预算员规则VO对象（包含 qaurid 和 lastFinishTime）
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常
	 */
	int updateLastFinishTime(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 删除预算员规则（同时删除明细项）
	 * 
	 * @param quotationAssignUserRule 预算员规则VO对象（包含 qaurid）
	 * @return 成功返回0，失败返回-1
	 * @throws FLException 业务异常
	 */
	int deleteQuotationAssignUserRule(QuotationAssignUserRuleVO quotationAssignUserRule) throws FLException;

	/**
	 * 全集团预算员汇总查询（含实时任务数和状态）
	 * 
	 * <p>
	 * 查询所有预算员规则，同时根据分配队列实时计算每个人的当前任务数和状态，
	 * 返回全集团汇总数据。不区分公司，按状态升序、任务数降序排列。
	 * </p>
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件（支持 status、userName）
	 * @throws FLException 业务异常
	 */
	void pageQuotationAssignUserRuleSummary(Paging paging, List<Filter> filters) throws FLException;

	/**
	 * 同步所有预算员的任务数和状态（根据分配队列实时数据）
	 * 
	 * <p>
	 * 遍历所有预算员规则，根据分配队列中 status &lt; 3 的记录数更新：
	 * </p>
	 * <ul>
	 * <li>currentTaskCount = 该预算员在分配队列中活跃记录数（status &lt; 3）</li>
	 * <li>如果 currentTaskCount &gt; 0，则 status = 制作中(2)</li>
	 * <li>如果 currentTaskCount = 0 且 status != 停止(3)，则 status = 待分配(1)</li>
	 * </ul>
	 * 
	 * @return 更新的记录数
	 * @throws FLException 业务异常
	 */
	int syncQuotationAssignUserRuleStatus() throws FLException;

}
