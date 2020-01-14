package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionCostPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructionCostDao extends Dao<ConstructionCostPO> {

	public List<ConstructionCostPO> pageConstructionCost(Paging paging, List<Filter> filters, int company);

	public List<ConstructionCostPO> queryConstructionCost(int company);

	public ConstructionCostPO queryConstructionCost(int area, int company);

}
