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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface ModuleService {
	
	public void pageModule(Paging paging, List<FilterVO> filters);
	
	public List<ModuleVO> queryModule();
	
	public List<ModuleVO> queryModuleBySystem(ModuleVO moduleVO);
	
	public List<ModuleVO> queryModuleByRoleId(ModuleVO moduleVO, RoleVO roleVO) throws FLException;
	
	public int updateRoleModuleByRoleId(List<Integer> mIds, ModuleVO moduleVO, RoleVO roleVO) throws FLException;
	
	public List<ModuleVO> queryModuleByUserId(ModuleVO moduleVO, UserVO userVO) throws FLException;
	
	public int updateUserModuleByUserId(List<Integer> mIds, ModuleVO moduleVO, UserVO userVO) throws FLException;
	
}
