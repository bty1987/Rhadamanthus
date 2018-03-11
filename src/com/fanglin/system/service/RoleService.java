package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface RoleService {
	
	public void pageRole(Paging paging, List<Filter> filters);
	
	public List<RoleVO> querylRole();
	
	public RoleVO queryRoleByRid(RoleVO roleVO);
	
	public RoleVO queryRoleByName(RoleVO roleVO);
	
	public int addRole(RoleVO roleVO) throws FLException;
	
	public int updateRole(RoleVO roleVO);

	public int deleteRole(RoleVO roleVO);

	public int deleteRoleByRid(Integer rid) throws FLException;
	
}
