package com.fanglin.construction.dao;

import java.util.List;
import com.fanglin.construction.po.ConstructionDiaryDrawingPO;
import com.fanglin.core.dao.Dao;

public interface ConstructionDiaryDrawingDao extends Dao<ConstructionDiaryDrawingPO> {
	
	public List<ConstructionDiaryDrawingPO> queryConstructionDiaryDrawingByCdid(Long cdid);
	
	public int countConstructionDiaryDrawing(Long cdid);

}
