package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则表 DAO 接口（人员维度）
 * 
 * <p>
 * UserRule 按人员维度存储（每人一条），公司/部门/业务类型维度通过 UserRuleItem 维护
 * </p>
 * 
 * @author Claude AI
 * @date 2026-04-21
 */
public interface QuotationAssignUserRuleDao extends Dao<QuotationAssignUserRulePO> {

	/**
	 * 分页查询预算员规则列表
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param company 公司ID（可选，通过 UserRuleItem 子查询过滤）
	 * @return
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRulePO> pageQuotationAssignUserRule(Paging paging, List<Filter> filters, Integer company) throws FLException;

	/**
	 * 根据用户ID查询预算员规则
	 * 
	 * <p>新模型下每个用户只有一条 UserRule 记录</p>
	 * 
	 * @param userId 用户ID
	 * @return 预算员规则PO，不存在返回null
	 * @throws FLException 业务异常
	 */
	QuotationAssignUserRulePO queryQuotationAssignUserRuleByUserId(String userId) throws FLException;

	/**
	 * 查询所有预算员规则（全集团汇总，不过滤公司）
	 * 
	 * <p>
	 * 用于：全集团预算员汇总页面，展示所有人员的任务数和状态
	 * </p>
	 * 
	 * @return 所有预算员规则列表（按状态升序、任务数降序排列）
	 * @throws FLException 异常
	 */
	List<QuotationAssignUserRulePO> queryAllQuotationAssignUserRule() throws FLException;

	/**
	 * 查询所有待分配的预算员（status=1），且在指定公司/部门下有匹配的规则明细
	 * 
	 * <p>
	 * 通过子查询 UserRuleItem 过滤：存在 item 匹配 company + (department 匹配或 department 为null) 
	 * + (supportedType=-1 或 supportedType 匹配 decorationType)
	 * </p>
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示查询所有部门）
	 * @param decorationType 装修类型（可选，NULL表示不限制类型）
	 * @return 预算员规则列表（按 lastFinishTime 升序排序）
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRulePO> queryAvailableUsers(int company, Integer department, Short decorationType) throws FLException;

	/**
	 * 查询所有待分配的预算员（跨公司验证：在所有规则明细对应的公司中都无进行中任务）
	 * 
	 * <p>
	 * 逻辑：先通过 UserRuleItem 过滤出匹配 company+department+supportedType 的 UserRule，
	 * 再排除在其他公司的 item 对应状态下为非待分配的预算员
	 * </p>
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @param decorationType 装修类型（可选）
	 * @return 预算员规则列表（跨公司全部待分配）
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRulePO> queryAvailableUsersForCrossCompany(int company, Integer department, Short decorationType) throws FLException;
}
