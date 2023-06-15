package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CustomerRecordPO;
import com.fanglin.core.dao.Dao;

public interface CustomerRecordDao extends Dao<CustomerRecordPO> {

	public List<CustomerRecordPO> queryCustomerRecord(long cid);

}
