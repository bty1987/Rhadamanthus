/**
 * @File Name		: RoleOperationService.java
 * @Package   	: com.fanglin.system.service
 * @Version		: 1.0
 * @Date			: 2026-07-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Describing	: 角色-操作关联的跨公司同步
 */

package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.system.vo.RoleVO;

public interface RoleOperationService {

	public int syncRoleOperation(RoleVO roleVO, List<CompanyVO> companyVOs, String userId, Integer company) throws FLException;

}
