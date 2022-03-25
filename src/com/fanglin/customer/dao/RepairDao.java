package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.RepairPO;

public interface RepairDao extends Dao<RepairPO> {

	public List<RepairPO> queryRepair(long aid);

}
