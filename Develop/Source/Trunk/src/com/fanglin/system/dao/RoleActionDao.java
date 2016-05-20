package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.system.po.RoleActionPO;

public interface RoleActionDao extends Dao<RoleActionPO> {

	public List<RoleActionPO> queryRoleActionByRoleId(String roleId);
	
	public List<RoleActionPO> queryRoleActionByActionName(String actionName);

	public List<RoleActionPO> queryRoleActionByActionId(int actionId);
	
	public RoleActionPO queryRoleActionByActionIdARoleId(String roleId, int actionId);
	
	public RoleActionPO queryRoleActionByActionNameARoleId(String roleId, String actionName);
}
