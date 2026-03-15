package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.quotation.vo.QuotationConfigVO;

/**
 * 预算配置服务接口
 * 提供预算配置的查询、保存等功能
 */
public interface QuotationConfigService {

	/**
	 * 查询预算配置
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 预算配置
	 */
	QuotationConfigVO getQuotationConfig(Integer company, Integer department);

	/**
	 * 根据公司ID查询所有预算配置
	 * @param company 公司ID
	 * @return 预算配置列表
	 */
	List<QuotationConfigVO> getQuotationConfigsByCompany(Integer company);

	/**
	 * 保存预算配置（新增或更新）
	 * @param quotationConfig 预算配置
	 */
	void saveQuotationConfig(QuotationConfigVO quotationConfig);

	/**
	 * 更新预算配置
	 * @param quotationConfig 预算配置
	 */
	void updateQuotationConfig(QuotationConfigVO quotationConfig);

	/**
	 * 删除预算配置
	 * @param qcid 预算配置ID
	 */
	void deleteQuotationConfig(Integer qcid);

	/**
	 * 启用预算分配功能
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 */
	void enableQuotationAssign(Integer company, Integer department);

	/**
	 * 禁用预算分配功能
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 */
	void disableQuotationAssign(Integer company, Integer department);

	/**
	 * 启用自动分配模式
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 */
	void enableAutoAssign(Integer company, Integer department);

	/**
	 * 禁用自动分配模式（改为手动分配模式）
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 */
	void disableAutoAssign(Integer company, Integer department);

	/**
	 * 检查是否启用预算分配功能
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 是否启用
	 */
	boolean isQuotationAssignEnabled(Integer company, Integer department);

	/**
	 * 检查是否启用自动分配模式
	 * @param company 公司ID
	 * @param department 部门ID（可选）
	 * @return 是否自动分配
	 */
	boolean isAutoAssign(Integer company, Integer department);
}
