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
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface ModuleService {

	public void pageModule(Paging paging, List<Filter> filters);

	public List<ModuleVO> queryModule(ModuleVO moduleVO);

	public List<ModuleVO> queryModuleByRid(ModuleVO moduleVO, RoleVO roleVO) throws FLException;

	public List<ModuleVO> queryModuleForLinkByRid(ModuleVO moduleVO, RoleVO roleVO) throws FLException;

	public List<ModuleVO> queryModuleByUserId(ModuleVO moduleVO, UserVO userVO) throws FLException;

	public List<ModuleVO> queryModuleByFatherModule(ModuleVO moduleVO) throws FLException;

	public ModuleVO checkModule(ModuleVO moduleVO, String userId) throws FLException;

	public int addModule(ModuleVO moduleVO) throws FLException;

	public int updateRoleModuleByRid(ModuleVO moduleVO, RoleVO roleVO, List<ModuleVO> moduleVOs, int rid, String userId) throws FLException;

	public int deleteModule(ModuleVO moduleVO) throws FLException;

}
