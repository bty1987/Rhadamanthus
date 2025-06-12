package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.ConstructionPeriodNodePO;

public interface ConstructionPeriodNodeDao extends Dao<ConstructionPeriodNodePO> {

	public List<ConstructionPeriodNodePO> queryConstructionPeriodNodeByCpid(long cpid);

}
