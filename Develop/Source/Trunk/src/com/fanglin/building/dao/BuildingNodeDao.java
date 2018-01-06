package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.BuildingNodePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BuildingNodeDao extends Dao<BuildingNodePO>{

	public List<BuildingNodePO> pageBuildingNode(Paging paging, List<Filter> filters);
	
	public List<BuildingNodePO> queryBuildingNodeByType(Short type);
	
}
