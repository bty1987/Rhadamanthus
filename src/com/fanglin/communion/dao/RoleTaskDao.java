package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.RoleTaskPO;
import com.fanglin.core.dao.Dao;

public interface RoleTaskDao extends Dao<RoleTaskPO> {

	public List<RoleTaskPO> queryRoleTask(int rid, Integer company);

	public List<RoleTaskPO> queryRoleTask(List<Integer> rids, Integer company);

	public RoleTaskPO queryRoleTask(int rid, Long tid, Integer company);

	public void deleteRoleTask(int rid, Integer company);

	public int deleteRoleTask(int rid, List<Integer> companys);

	public int syncRoleTask(int rid, int cuid, List<Integer> companys, int company);
}
