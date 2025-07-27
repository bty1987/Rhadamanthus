package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionRecordPO;
import com.fanglin.core.dao.Dao;

public interface ConstructionRecordDao extends Dao<ConstructionRecordPO> {

	public List<ConstructionRecordPO> queryConstructionRecordByOrderId(String orderId);

}
