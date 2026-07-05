package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationAssignUserRuleItemPO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则明细表 DAO 接口
 * 
 * @author Claude AI
 * @date 2026-04-21
 */
public interface QuotationAssignUserRuleItemDao extends Dao<QuotationAssignUserRuleItemPO> {

	/**
	 * 分页查询预算规则明细列表
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件（支持 company、supportedType、userName）
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRuleItemPO> pageQuotationAssignUserRuleItem(Paging paging, List<Filter> filters) throws FLException;

	/**
	 * 根据规则ID查询所有明细
	 * 
	 * @param qaurid 规则ID
	 * @return 明细列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemByRuleId(long qaurid) throws FLException;

	/**
	 * 根据用户ID查询该预算员在所有公司的明细
	 * 
	 * @param userId 用户ID
	 * @return 明细列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemByUserId(String userId) throws FLException;

	/**
	 * 根据用户ID和公司ID查询该预算员在指定公司的明细
	 * 
	 * @param userId 用户ID
	 * @param company 公司ID
	 * @return 明细列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemByUserId(String userId, int company) throws FLException;

	/**
	 * 查询匹配指定公司+部门+装修类型的可用预算员（通过Item关联）
	 * 
	 * <p>
	 * 匹配逻辑：item.company = company AND (item.department = department OR item.department IS NULL) AND (item.supportedType = decorationType OR item.supportedType = -1)
	 * </p>
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @param decorationType 装修类型（可选）
	 * @return 匹配的明细列表（关联的userRule已按lastFinishTime排序）
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemForAssign(int company, Integer department, Short decorationType) throws FLException;

	/**
	 * 查询匹配指定公司+部门+装修类型的可用预算员（跨公司验证版本）
	 * 
	 * <p>
	 * 在 queryAvailableItemsForAssign 基础上，排除在其他公司有进行中任务的预算员
	 * </p>
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @param decorationType 装修类型（可选）
	 * @return 匹配的明细列表
	 * @throws FLException 业务异常
	 */
	List<QuotationAssignUserRuleItemPO> queryQuotationAssignUserRuleItemForCross(int company, Integer department, Short decorationType) throws FLException;

	/**
	 * 删除规则下的所有明细
	 * 
	 * @param qaurid 规则ID
	 * @throws FLException 业务异常
	 */
	void deleteQuotationAssignUserRuleItemByRuleId(long qaurid) throws FLException;
}
