package com.fanglin.quotation.service;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationAssignUserRulePO;
import com.fanglin.quotation.vo.QuotationAssignUserRuleItemVO;
import com.fanglin.utils.Paging;

/**
 * 预算员规则明细 Service 接口
 * 
 * @author AI
 */
public interface QuotationAssignUserRuleItemService {

	/**
	 * 根据规则ID查询明细列表
	 */
	List<QuotationAssignUserRuleItemVO> queryQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO quotationAssignUserRuleItem) throws FLException;

	/**
	 * 根据规则ID查询明细列表（内部调用，不含 qaurid 填充）
	 */
	List<QuotationAssignUserRuleItemVO> queryItemsByRuleId(long qaurid) throws FLException;

	/**
	 * 分页查询预算规则明细列表（含预算员姓名）
	 */
	void pageQuotationAssignUserRuleItem(Paging paging, List<Filter> filters) throws FLException;

	/**
	 * 新增预算规则明细
	 */
	int createQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO itemVO) throws FLException;

	/**
	 * 更新预算规则明细
	 */
	int updateQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO itemVO) throws FLException;

	/**
	 * 删除预算规则明细
	 */
	int deleteQuotationAssignUserRuleItem(QuotationAssignUserRuleItemVO itemVO) throws FLException;

	/**
	 * 批量保存规则明细（Rule 创建/更新时调用）
	 */
	void saveItems(QuotationAssignUserRulePO rulePO, List<QuotationAssignUserRuleItemVO> items, Timestamp currentTime) throws FLException;

	/**
	 * 根据规则ID删除全部明细（Rule 删除时调用）
	 */
	void deleteItemsByRuleId(long qaurid) throws FLException;
}
