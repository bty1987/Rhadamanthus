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
}
