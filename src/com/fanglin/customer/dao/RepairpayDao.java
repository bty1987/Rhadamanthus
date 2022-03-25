package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.RepairpayPO;

public interface RepairpayDao extends Dao<RepairpayPO> {

	public List<RepairpayPO> queryRepairpay(long aid);

}
