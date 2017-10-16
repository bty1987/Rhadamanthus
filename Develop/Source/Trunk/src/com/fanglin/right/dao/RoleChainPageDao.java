package com.fanglin.right.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.right.po.RoleChainPagePO;

public interface RoleChainPageDao extends Dao<RoleChainPagePO>{

	public List<RoleChainPagePO> queryRoleChainPageByRid(int rid);
	
	public List<RoleChainPagePO> queryRoleChainPageByCpid (long cpid );
	
	public int deleteRoleChainPage(int rid);
}
