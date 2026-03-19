/**
 * @File Name		: QuotationAssignConfigService.java
 * @Package  	: com.fanglin.quotation.service
 * @Version		: 1.0
 * @Date			: 2026-03-19
 * @Copyright	: Copyright Creators 2026
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 预算配置表 Service 接口
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.QuotationAssignConfigVO;
import com.fanglin.utils.Paging;

/**
 * 预算配置表 Service 接口
 *
 * <p>职责：提供预算配置的业务逻辑处理</p>
 *
 * <p>主要功能：</p>
 * <ul>
 *   <li>配置查询（分页、详情、启用检查）</li>
 *   <li>配置管理（新增、编辑、删除）</li>
 *   <li>状态管理（启用/禁用、自动分配切换）</li>
 * </ul>
 *
 * @author bty1987
 * @version 1.0
 */
public interface QuotationAssignConfigService {

	/**
	 * 分页查询配置列表
	 *
	 * @param paging 分页对象
	 * @param company 公司ID（可选，NULL表示查询所有公司）
	 * @return 配置VO列表（带关联的公司/部门名称）
	 * @throws FLException 业务异常
	 */
	void pageQuotationAssignConfig(Paging paging, Integer company) throws FLException;

	/**
	 * 根据ID查询配置
	 *
	 * @param qacid 配置ID
	 * @return 配置VO对象，不存在则返回 NULL
	 * @throws FLException 业务异常
	 */
	QuotationAssignConfigVO queryQuotationAssignConfigById(long qacid) throws FLException;

	/**
	 * 检查公司部门是否启用了预算分配
	 *
	 * <p>供其他 Service 调用，用于判断是否使用预算员分配功能</p>
	 *
	 * @param company 公司ID
	 * @param department 部门ID（可选，NULL表示查询所有部门）
	 * @return true-已启用，false-未启用
	 * @throws FLException 业务异常
	 */
	boolean isQuotationAssignEnabled(int company, Integer department) throws FLException;

	/**
	 * 检查公司是否启用了自动分配
	 *
	 * <p>供反向自动分配调用，判断是否需要自动分配预算员</p>
	 *
	 * @param company 公司ID
	 * @return true-启用自动分配，false-未启用
	 * @throws FLException 业务异常
	 */
	boolean isAutoAssignEnabled(int company) throws FLException;

	/**
	 * 创建配置
	 *
	 * @param config 配置VO对象
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常（如：公司部门组合重复）
	 */
	int createQuotationAssignConfig(QuotationAssignConfigVO config) throws FLException;

	/**
	 * 更新配置
	 *
	 * @param config 配置VO对象
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常（如：公司部门组合重复）
	 */
	int updateQuotationAssignConfig(QuotationAssignConfigVO config) throws FLException;

	/**
	 * 删除配置
	 *
	 * @param config 配置VO对象
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常
	 */
	int deleteQuotationAssignConfig(QuotationAssignConfigVO config) throws FLException;

	/**
	 * 启用/禁用配置
	 *
	 * @param config 配置VO对象（包含 qacid 和 enabled）
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常
	 */
	int updateQuotationAssignConfigForStatus(QuotationAssignConfigVO config) throws FLException;

	/**
	 * 切换自动分配模式
	 *
	 * @param config 配置VO对象（包含 qacid 和 autoAssign）
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常
	 */
	int updateQuotationAssignConfigForAssign(QuotationAssignConfigVO config) throws FLException;
}
