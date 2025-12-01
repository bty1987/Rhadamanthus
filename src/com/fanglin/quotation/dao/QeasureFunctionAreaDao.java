package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QeasureFunctionAreaPO;

public interface QeasureFunctionAreaDao extends Dao<QeasureFunctionAreaPO> {

	public List<QeasureFunctionAreaPO> queryQeasureFunctionArea(long qmid);

}
