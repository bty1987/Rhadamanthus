package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructionDrawingPO;
import com.fanglin.core.dao.Dao;

public interface ConstructionDrawingDao extends Dao<ConstructionDrawingPO> {
	
	public List<ConstructionDrawingPO> queryConstructionDrawingByCid(Long cid, Short schedule);
	
	public List<ConstructionDrawingPO> queryConstructionDrawingByType(Short type);
	
	public int countConstructionDrawing(Long cid, Short type);

}
