package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.RoleChartPO;
import com.fanglin.core.dao.Dao;

public interface RoleChartDao extends Dao<RoleChartPO>  {

	public List<RoleChartPO> queryChartByRid(Integer rid);
	
	public int deleteRoleChartByRid(int rid);
}
