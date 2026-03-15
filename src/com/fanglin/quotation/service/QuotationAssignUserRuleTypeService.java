package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.quotation.po.QuotationAssignUserRuleTypePO;

/**
 * 报价单预算员类型支持表 Service 接口
 * 职责: 管理预算员支持的装修类型（半包/整装）
 */
public interface QuotationAssignUserRuleTypeService {

	/**
	 * 根据预算员规则ID查询支持的类型列表
	 * @param qaurid 预算员规则ID
	 * @return 类型支持列表
	 */
	List<QuotationAssignUserRuleTypePO> queryQuotationAssignUserRuleTypeByQaurid(long qaurid);

	/**
	 * 根据预算员规则ID和类型查询支持记录
	 * @param qaurid 预算员规则ID
	 * @param type 装修类型（1-半包，2-整装）
	 * @return 类型支持记录
	 */
	QuotationAssignUserRuleTypePO queryQuotationAssignUserRuleTypeByQauridAndType(long qaurid, short type);

	/**
	 * 检查预算员是否支持指定类型
	 * @param qaurid 预算员规则ID
	 * @param type 装修类型
	 * @return 数量（0表示不支持，>0表示支持）
	 */
	int existQuotationAssignUserRuleType(long qaurid, short type);

	/**
	 * 统计预算员支持的类型数量
	 * @param qaurid 预算员规则ID
	 * @return 类型数量
	 */
	int countQuotationAssignUserRuleTypeByQaurid(long qaurid);

	/**
	 * 删除预算员的所有类型支持
	 * @param qaurid 预算员规则ID
	 * @return 影响行数
	 */
	int deleteQuotationAssignUserRuleTypeByQaurid(long qaurid);

	/**
	 * 批量保存类型支持
	 * @param types 类型支持列表
	 * @return 保存的记录数
	 */
	int batchSaveQuotationAssignUserRuleType(List<QuotationAssignUserRuleTypePO> types);

	/**
	 * 保存预算员类型支持
	 * @param qaurid 预算员规则ID
	 * @param types 类型列表（如：[1,2] 表示支持半包和整装）
	 * @return 保存的记录数
	 */
	int saveQuotationAssignUserRuleTypes(long qaurid, List<Short> types);
}
