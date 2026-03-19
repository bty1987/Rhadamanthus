/**
 * @File Name		: QuotationAssignConfigDao.java
 * @Package  	: com.fanglin.quotation.dao
 * @Version		: 1.0
 * @Date			: 2026-03-19
 * @Copyright	: Copyright Creators 2026
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 预算配置表 DAO 接口
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;
import com.fanglin.utils.Paging;

/**
 * 预算配置表 DAO 接口
 *
 * <p>职责：提供预算配置的数据库访问操作</p>
 *
 * <p>主要功能：</p>
 * <ul>
 *   <li>分页查询配置列表</li>
 *   <li>根据公司部门查询配置</li>
 *   <li>查询启用的配置</li>
 *   <li>创建、更新、删除配置</li>
 *   <li>启用/禁用配置</li>
 * </ul>
 *
 * @author bty1987
 * @version 1.0
 */
public interface QuotationAssignConfigDao extends Dao<QuotationAssignConfigPO> {

	/**
	 * 分页查询配置列表
	 *
	 * @param paging 分页对象
	 * @param company 公司ID（可选，NULL表示查询所有公司）
	 * @return 配置列表
	 */
	List<QuotationAssignConfigPO> pageQuotationAssignConfig(Paging paging, Integer company);

	/**
	 * 根据公司和部门查询配置
	 *
	 * <p>注意：company + department 组合是唯一的</p>
	 *
	 * @param company 公司ID
	 * @param department 部门ID（NULL表示该公司所有部门）
	 * @return 配置对象，不存在则返回 NULL
	 */
	QuotationAssignConfigPO queryQuotationAssignConfigByCompanyAndDepartment(int company, Integer department);

	/**
	 * 查询公司的所有配置（包括全局配置和部门配置）
	 *
	 * @param company 公司ID
	 * @return 配置列表
	 */
	List<QuotationAssignConfigPO> queryQuotationAssignConfigByCompany(int company);

	/**
	 * 查询启用的配置列表
	 *
	 * <p>用于检查某个公司/部门是否启用了预算员分配功能</p>
	 *
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示查询所有部门）
	 * @return 启用的配置列表
	 */
	List<QuotationAssignConfigPO> queryEnabledQuotationAssignConfig(int company, Integer department);

	/**
	 * 查询公司是否有启用自动分配的配置
	 *
	 * <p>用于反向自动分配前检查是否启用</p>
	 *
	 * @param company 公司ID
	 * @return true-至少有一个启用配置，false-无启用配置
	 */
	boolean hasEnabledAutoAssignConfig(int company);

	/**
	 * 删除配置
	 *
	 * @param qacid 配置ID
	 * @return 影响行数
	 */
	int deleteQuotationAssignConfig(long qacid);

	/**
	 * 启用/禁用配置（更新 enabled 状态）
	 *
	 * @param qacid 配置ID
	 * @param enabled 启用状态（0-禁用，1-启用）
	 * @return 影响行数
	 */
	int updateQuotationAssignConfigForStatus(long qacid, short enabled);

	/**
	 * 切换自动分配模式（更新 autoAssign）
	 *
	 * @param qacid 配置ID
	 * @param autoAssign 自动分配模式（0-手动，1-自动）
	 * @return 影响行数
	 */
	int updateQuotationAssignConfigForAssign(long qacid, short autoAssign);
}
