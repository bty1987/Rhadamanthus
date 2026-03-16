package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;

/**
 * 报价单预算配置表 DAO 接口 职责: 控制哪些公司/部门启用预算员分配功能
 */
public interface QuotationAssignConfigDao extends Dao<QuotationAssignConfigPO> {

	/**
	 * 根据公司和部门查询配置
	 * 
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示公司级别配置）
	 * @return 预算配置
	 */
	QuotationAssignConfigPO queryQuotationAssignConfigByDid(int company, Integer department);

	/**
	 * 查询公司的配置列表
	 * 
	 * @param company 公司ID
	 * @return 配置列表
	 */
	List<QuotationAssignConfigPO> queryQuotationAssignConfig(int company);

	/**
	 * 查询公司级别配置（部门为NULL）
	 * 
	 * @param company 公司ID
	 * @return 配置
	 */
	QuotationAssignConfigPO queryQuotationAssignConfigForCompany(int company);

	/**
	 * 查询部门级别配置列表
	 * 
	 * @param company 公司ID
	 * @return 配置列表
	 */
	List<QuotationAssignConfigPO> queryQuotationAssignConfigForDepartment(int company);

	/**
	 * 查询所有启用的配置
	 * 
	 * @param company 公司ID
	 * @return 配置列表
	 */
	List<QuotationAssignConfigPO> queryQuotationAssignConfigForEnable(int company);

	/**
	 * 查询所有启用自动分配的配置
	 * 
	 * @param company 公司ID
	 * @return 配置列表
	 */
	List<QuotationAssignConfigPO> queryQuotationAssignConfigForAuto(int company);

	/**
	 * 检查公司是否启用预算分配功能
	 * 
	 * @param company 公司ID
	 * @return 数量（0表示未启用，>0表示已启用）
	 */
	int existQuotationAssignConfigForEnable(int company);

	/**
	 * 检查部门是否启用预算分配功能
	 * 
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 数量（0表示未启用，>0表示已启用）
	 */
	int existQuotationAssignConfigByDidForEnable(int company, int department);

	/**
	 * 检查公司是否启用自动分配
	 * 
	 * @param company 公司ID
	 * @return 数量（0表示未启用，>0表示已启用）
	 */
	int existQuotationAssignConfigForAuto(int company);

	/**
	 * 检查部门是否启用自动分配
	 * 
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 数量（0表示未启用，>0表示已启用）
	 */
	int existQuotationAssignConfigByDidForAuto(int company, int department);

	/**
	 * 更新配置的启用状态
	 * 
	 * @param qacid 配置ID
	 * @param enabled 启用状态
	 * @return 影响行数
	 */
	int updateQuotationAssignConfigForEnable(long qacid, short enabled);

	/**
	 * 更新配置的自动分配状态
	 * 
	 * @param qacid 配置ID
	 * @param autoAssign 自动分配状态
	 * @return 影响行数
	 */
	int updateQuotationAssignConfigForAuto(long qacid, short autoAssign);

	/**
	 * 统计公司的配置数量
	 * 
	 * @param company 公司ID
	 * @return 配置数量
	 */
	int countQuotationAssignConfigByCompany(int company);

	/**
	 * 删除公司的所有配置
	 * 
	 * @param company 公司ID
	 * @return 影响行数
	 */
	int deleteQuotationAssignConfigByCompany(int company);

	/**
	 * 删除指定部门的配置
	 * 
	 * @param company 公司ID
	 * @param department 部门ID
	 * @return 影响行数
	 */
	int deleteQuotationAssignConfigByDDid(int company, int department);
}
