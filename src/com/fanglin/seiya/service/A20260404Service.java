/**
 * @File Name		: A20260404Service.java
 * @Package   	: com.fanglin.seiya.service
 * @Version		: 1.0
 * @Date			: 2026-04-04
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: Supplier供应商数据同步服务接口
 */

package com.fanglin.seiya.service;

import java.util.Map;

import com.fanglin.core.interceptor.FLException;

public interface A20260404Service {

	/**
	 * 同步供应商数据
	 *
	 * 通过编号(userId)判断是否存在，存在则更新，不存在则创建
	 *
	 * @param userId 供应商编号（也是 loginId）
	 * @param userName 供应商名称
	 * @param phone 联系电话
	 * @param company 公司ID
	 * @param creditCode 统一信用编码（对应 user.oldUserId）
	 * @return 包含 uid, operation, userId 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncSupplier(String userId, String userName, String phone, Integer company, String creditCode) throws FLException;

	/**
	 * 同步驻店人员数据
	 *
	 * 通过编号(userId)判断是否存在：存在且类型为驻店员则更新，不存在则创建；存在但非驻店员则报错
	 * 同时以 brands 品牌编号列表为准全量对齐 brandInstorer 绑定关系（补缺删多）
	 *
	 * @param userId 驻店员编号（也是 loginId）
	 * @param userName 驻店员姓名
	 * @param phone 联系电话
	 * @param company 公司ID
	 * @param supplierUserId 所属厂商编号（user 表 type=1 的供应商用户）
	 * @param brands 品牌编号JSON数组字符串，如 ["B_001","B_002"]（对应 brand.no）
	 * @param agentName 代理名称（可选，落 brandInstorer.agentName）
	 * @param agentPhone 代理电话（可选，落 brandInstorer.agentPhone）
	 * @return 包含 uid, operation, userId, userName, supplierUserId, brands 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncInstorer(String userId, String userName, String phone, Integer company, String supplierUserId, String brands, String agentName, String agentPhone) throws FLException;

}
