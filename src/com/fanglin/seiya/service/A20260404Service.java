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
	 * @param userId 供应商编号（也是 oldUserId 和 loginId）
	 * @param userName 供应商名称
	 * @param phone 联系电话
	 * @param company 公司ID
	 * @return 包含 uid, operation, userId 等信息的 Map
	 * @throws FLException 业务异常
	 */
	Map<String, Object> syncSupplier(String userId, String userName, String phone, Integer company) throws FLException;

}
