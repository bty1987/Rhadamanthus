package com.fanglin.information.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.information.po.PlanParamPO;

public interface PlanParamDao extends Dao<PlanParamPO> {

	public PlanParamPO queryPlanParam(Long pid);

}
