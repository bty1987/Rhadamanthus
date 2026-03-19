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
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.QuotationAssignConfigVO;
import com.fanglin.utils.Paging;

/**
 * 预算配置表 Service 接口
 * 
 * <p>
 * 职责：提供预算配置的业务逻辑处理
 * </p>
 * 
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>配置查询（分页、详情、启用检查）</li>
 * <li>配置管理（新增、编辑、删除）</li>
 * <li>状态管理（启用/禁用、自动分配切换）</li>
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
	void pageQuotationAssignConfig(Paging paging, List<Filter> filters, Integer company) throws FLException;

	/**
	 * 根据ID查询配置
	 * 
	 * @param qacid 配置ID
	 * @return 配置VO对象，不存在则返回 NULL
	 * @throws FLException 业务异常
	 */
	QuotationAssignConfigVO queryQuotationAssignConfigById(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException;

	/**
	 * 创建配置
	 * 
	 * @param config 配置VO对象
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常（如：公司部门组合重复）
	 */
	int createQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException;

	/**
	 * 更新配置
	 * 
	 * @param config 配置VO对象
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常（如：公司部门组合重复）
	 */
	int updateQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException;

	/**
	 * 删除配置
	 * 
	 * @param config 配置VO对象
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常
	 */
	int deleteQuotationAssignConfig(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException;

	/**
	 * 启用/禁用配置
	 * 
	 * @param config 配置VO对象（包含 qacid 和 enabled）
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常
	 */
	int updateQuotationAssignConfigForStatus(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException;

	/**
	 * 切换自动分配模式
	 * 
	 * @param config 配置VO对象（包含 qacid 和 autoAssign）
	 * @return 成功返回1，失败返回0
	 * @throws FLException 业务异常
	 */
	int updateQuotationAssignConfigForAssign(QuotationAssignConfigVO quotationAssignConfigVO) throws FLException;
}
