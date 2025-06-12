package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.sales.po.SalesActivityRecordPO;

public interface SalesActivityRecordDao extends Dao<SalesActivityRecordPO> {

	public List<SalesActivityRecordPO> querySalesActivityRecord(long saiid);

}
