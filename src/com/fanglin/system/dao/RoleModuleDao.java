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
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.ModulePO;
import com.fanglin.system.po.RoleModulePO;
import com.fanglin.system.po.RoleModuleRO;
import com.fanglin.utils.Paging;

public interface RoleModuleDao extends Dao<RoleModulePO> {

	public List<RoleModuleRO> pageRoleByMid(Paging paging, List<Filter> filters, Integer mid, Integer company);

	public List<RoleModulePO> queryRoleModule(int rid, short system, Integer company);

	public List<RoleModulePO> queryRoleModule(List<Integer> rids, short system, Integer company);

	public List<RoleModulePO> queryRoleModule(int rid, short level, short system, Integer company);

	public List<RoleModulePO> queryRoleModule(List<Integer> rids, short level, short system, Integer company);

	public List<RoleModulePO> queryRoleModule(int rid, int fmid, short level, short system, Integer company);

	public List<RoleModulePO> queryRoleModule(List<Integer> rids, int fmid, short level, short system, Integer company);

	public List<RoleModulePO> queryRoleModuleForLink(int rid, short system, Integer company);

	public List<RoleModulePO> queryRoleModuleForLink(List<Integer> rids, short system, Integer company);

	public List<ModulePO> queryRoleModuleForOne(List<Integer> rids, short system, Integer company);

	public List<ModulePO> queryRoleModuleForTwo(List<Integer> rids, int mid, short system, Integer company);

	public RoleModulePO queryRoleModule(List<Integer> rids, int mid, Integer company);

	public RoleModulePO queryRoleModule(int rid, int mid, Integer company);

	public int countRoleModuleByMid(int mid, Integer company);

	public int syncRoleModule(int rid, int cuid, List<Integer> companys, int company);

	public int deleteRoleModule(int rid, int company);

	public int deleteRoleModuleByRid(int rid, int company);

	public int deleteRoleModuleByRid(int rid, short system, int company);

	public int deleteRoleModuleByMid(int mid, int company);

	public int deleteRoleModule(int rid, List<Integer> companys);

}
