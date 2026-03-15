package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationConfigVO;

/**
 * 报价单预算配置表 Service 接口
 * 职责: 控制哪些公司/部门启用预算员分配功能
 */
public interface QuotationAssignConfigService {

	/**
	 * 根据公司和部门查询配置
	 * @param quotationConfig 配置VO（包含company和department）
	 * @return 预算配置VO
	 */
	QuotationConfigVO findByCompanyAndDepartment(QuotationConfigVO quotationConfig);

	/**
	 * 查询公司的配置列表
	 * @param quotationConfig 配置VO（包含company）
	 * @return 配置列表
	 */
	List<QuotationConfigVO> findByCompany(QuotationConfigVO quotationConfig);

	/**
	 * 添加或更新配置
	 * @param quotationConfig 配置VO
	 * @param userId 当前操作用户ID
	 * @throws FLException
	 */
	void saveQuotationAssignConfig(QuotationConfigVO quotationConfig, String userId) throws FLException;

	/**
	 * 删除配置
	 * @param quotationConfig 配置VO（包含bcid）
	 * @param userId 当前操作用户ID
	 * @throws FLException
	 */
	void deleteQuotationAssignConfig(QuotationConfigVO quotationConfig, String userId) throws FLException;

	/**
	 * 启用配置
	 * @param quotationConfig 配置VO（包含bcid）
	 * @param userId 当前操作用户ID
	 * @throws FLException
	 */
	void enableQuotationAssignConfig(QuotationConfigVO quotationConfig, String userId) throws FLException;

	/**
	 * 禁用配置
	 * @param quotationConfig 配置VO（包含bcid）
	 * @param userId 当前操作用户ID
	 * @throws FLException
	 */
	void disableQuotationAssignConfig(QuotationConfigVO quotationConfig, String userId) throws FLException;

	/**
	 * 检查公司是否启用了预算员分配功能
	 * @param quotationConfig 配置VO（包含company）
	 * @return true-已启用，false-未启用
	 */
	boolean isQuotationAssignEnabled(QuotationConfigVO quotationConfig);

	/**
	 * 检查公司/部门是否启用自动分配
	 * @param quotationConfig 配置VO（包含company和department）
	 * @return true-自动分配，false-手动分配
	 */
	boolean isAutoAssignEnabled(QuotationConfigVO quotationConfig);
}
