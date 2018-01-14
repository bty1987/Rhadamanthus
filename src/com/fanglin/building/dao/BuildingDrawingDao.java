package com.fanglin.building.dao;

import java.util.List;

import com.fanglin.building.po.BuildingDrawingPO;
import com.fanglin.core.dao.Dao;

public interface BuildingDrawingDao extends Dao<BuildingDrawingPO>{

	public List<BuildingDrawingPO> queryBuildingDrawing(Long sid, Short type);
}
