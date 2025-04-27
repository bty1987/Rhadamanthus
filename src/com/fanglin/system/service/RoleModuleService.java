/**
 * @File Name		: ModuleService.java
 * @Package   	: com.fanglin.system.service
 * @Version		: 1.0
 * @Date			: 2015-12-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.system.vo.RoleVO;

public interface RoleModuleService {

	public int updateRoleModule(ModuleVO moduleVO, RoleVO roleVO, List<ModuleVO> moduleVOs, int rid, String userId, Integer company) throws FLException;

	public int syncRoleModule(RoleVO roleVO, List<CompanyVO> companyVOs, String userId, Integer company) throws FLException;

}
