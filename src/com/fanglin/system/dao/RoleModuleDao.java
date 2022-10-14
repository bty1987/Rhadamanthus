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

	public List<RoleModulePO> queryRoleModule(int rid, short system);

	public List<RoleModulePO> queryRoleModule(List<Integer> rids, short system);

	public List<RoleModulePO> queryRoleModule(int rid, int level, short system);

	public List<RoleModulePO> queryRoleModule(List<Integer> rids, int level, short system);

	public List<RoleModulePO> queryRoleModuleForLink(int rid, short system);

	public List<RoleModulePO> queryRoleModuleForLink(List<Integer> rids, short system);

	public RoleModulePO queryRoleModule(int rid, int mid);

	public int countRoleModuleByMid(int mid);

	public int deleteRoleModuleByRid(int rid);

	public int deleteRoleModuleByRid(int rid, short system);

	public int deleteRoleModuleByMid(int mid);

}
