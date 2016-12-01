package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.Paging;

public interface RoleDao extends Dao<RolePO> {
	
	public List<RolePO> pageRole(Paging paging, List<Filter> filters);

	public List<RolePO> queryRole();
	
	public RolePO queryRoleByRoleName(String roleName);
	
}
