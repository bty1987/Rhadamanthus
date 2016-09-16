package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface RoleService {
	
	public void pageRole(Paging paging, List<FilterVO> filters);
	
	public List<RoleVO> queryRole();
	
	public RoleVO queryRoleById(RoleVO roleVO);
	
	public RoleVO queryRoleByName(RoleVO roleVO);
	
}
