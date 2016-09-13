/**
 * @File Name		: RoleModuleDao.java
 * @Package   	: com.fanglin.system.dao
 * @Version		: 1.0
 * @Date			: 2016-9-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.system.po.RoleModulePO;

public interface RoleModuleDao extends Dao<RoleModulePO> {
	
	public List<RoleModulePO> queryRoleModuleByRId(int rId, short system);
	
	public List<RoleModulePO> queryRoleModuleByRIdALevel(int rId, int level, short system);
	
	public int deleteRoleModuleByRId(int rId, short system);

}
