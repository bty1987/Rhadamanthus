package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.BuildingPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingDao extends Dao<BuildingPO> {

	public List<BuildingPO> pageBuilding(Paging paging, List<Filter> filters);

	public BuildingPO queryBuildingByHsid(Long hsid);

	public BuildingPO queryBuildingByCsid(Long csid);

}
