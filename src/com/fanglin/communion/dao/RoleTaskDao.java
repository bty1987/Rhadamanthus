package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.RoleTaskPO;
import com.fanglin.core.dao.Dao;

public interface RoleTaskDao extends Dao<RoleTaskPO> {

	public List<RoleTaskPO> queryRoleTask(int rid);

	public List<RoleTaskPO> queryRoleTask(List<Integer> rids);

	public RoleTaskPO queryRoleTask(int rid, Long tid);

	public void deleteRoleTask(int rid);
}
