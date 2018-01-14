package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface RoleService {
	
	public void pageRole(Paging paging, List<Filter> filters);
	
	public List<RoleVO> queryRole();
	
	public RoleVO queryRoleById(RoleVO roleVO);
	
	public RoleVO queryRoleByName(RoleVO roleVO);
	
}
