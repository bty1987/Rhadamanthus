/**
 * @File Name     : A20260103Service.java
 * @Package       : com.fanglin.seiya.service
 * @Version       : 1.0
 * @Date          : 2026-01-03
 * @Copyright     : Copyright Creators 2026
 * @Author        : Fanglin ERP Team
 * @Email         : support@fanglin.com
 * @Describing    : 2026-01-03 接口服务层 - 客户线索接入
 */

package com.fanglin.seiya.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.CustomerChanceVO;

public interface A20260103Service {

	/**
	 * 根据线索编号查询客户机会
	 *
	 * @param cno 线索编号
	 * @return 客户机会信息
	 * @throws FLException 业务异常
	 */
	CustomerChanceVO queryCustomerChanceByCno(String cno) throws FLException;

	/**
	 * 更新客户线索
	 *
	 * 通过线索编号更新现有客户线索信息
	 *
	 * 更新规则：
	 * 1. 楼盘+楼号必须一起更新，缺一不可
	 * 2. house存在则关联，不存在则创建
	 * 3. customer存在则关联，不存在则创建
	 *
	 * @param leadCode 线索编号
	 * @param village 楼盘名称
	 * @param houseNumber 楼号
	 * @param buildArea 面积
	 * @param phone 客户电话
	 * @param name 客户名称
	 * @param referOrderId 转介绍订单ID
	 * @param sourceInfo 来源（三方信息）
	 * @param contactInfo 联系方式（三方信息）
	 * @param userId 操作用户ID
	 * @param orgId 公司ID
	 * @throws FLException 业务异常
	 */
	void updateCustomerLead(String leadCode, String village, String houseNumber,
							Integer buildArea, String phone, String name,
							String referOrderId, String sourceInfo, String contactInfo,
							String userId, Integer orgId) throws FLException;

}
