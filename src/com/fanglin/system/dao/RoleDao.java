package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.RolePO;
import com.fanglin.utils.Paging;

public interface RoleDao extends Dao<RolePO> {
	
	public List<RolePO> pageRole(Paging paging, List<Filter> filters,Integer company);

	public List<RolePO> queryRole(Integer company);
	
	public List<RolePO> queryRoleByName(Paging paging, String name, Integer company);
	
}
