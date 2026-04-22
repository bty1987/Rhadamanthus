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
	 * @param salesmanId 业务员userId - 用于修改 customerchance.creater 和 customersource.creater
	 * @throws FLException 业务异常
	 */
	void updateCustomerLead(String leadCode, String village, String houseNumber,
							Integer buildArea, String phone, String name,
							String referOrderId, String sourceInfo, String contactInfo,
							String userId, Integer orgId, String salesmanId) throws FLException;

	/**
	 * 查询客户线索（装饰订单）
	 *
	 * 支持三种查询方式：
	 * 1. orderId - 单独查询
	 * 2. village + houseNumber - 楼盘+楼号一同查询
	 * 3. phone - 单独查询
	 *
	 * @param orderId 装修单编号
	 * @param village 楼盘名称
	 * @param houseNumber 楼号
	 * @param phone 客户电话
	 * @param orgId 公司ID
	 * @return 装饰订单信息
	 * @throws FLException 业务异常
	 */
	com.fanglin.decoration.vo.DecorationVO queryCustomerLead(String orderId, String village, String houseNumber, String phone, Integer orgId) throws FLException;

	/**
	 * 验证装修单是否存在
	 *
	 * 参考DecorationService.checkOverDecoration逻辑：
	 * 1. 通过电话查询客户cid
	 * 2. 通过楼盘+楼号查询房屋hid
	 * 3. 根据cid和hid查询是否存在有效装修单
	 *
	 * @param village 楼盘名称
	 * @param houseNumber 楼号
	 * @param phone 客户电话
	 * @param orgId 公司ID
	 * @throws FLException 如果存在装修单则抛出异常
	 */
	void checkoverCustomerLead(String village, String houseNumber, String phone, Integer orgId) throws FLException;

	/**
	 * 修改装修单的客户电话和楼盘楼号（SF专用）
	 *
	 * 通过装修单号orderId查询装修单，修改客户电话和楼盘楼号。
	 * 客户不存在则创建，存在则更新；房屋不存在则创建，存在则更新。
	 *
	 * @param orderId 装修单编号（必填）
	 * @param phone 客户电话
	 * @param village 楼盘名称
	 * @param houseNumber 楼号
	 * @param orgId 公司ID
	 * @param userId 操作人userId
	 * @throws FLException 业务异常
	 */
	void updateDecorationForSF(String orderId, String phone, String village, String houseNumber, Integer orgId, String userId) throws FLException;

}
