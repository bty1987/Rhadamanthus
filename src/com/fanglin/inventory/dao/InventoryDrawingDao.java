package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.inventory.po.InventoryDrawingPO;

public interface InventoryDrawingDao extends Dao<InventoryDrawingPO> {

	public List<InventoryDrawingPO> queryInventoryDrawing(Long sid);

	public int deleteInventoryDrawing(long idid);

}
