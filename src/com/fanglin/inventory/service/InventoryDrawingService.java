package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.InventoryDrawingVO;

public interface InventoryDrawingService {

	public List<InventoryDrawingVO> queryInventoryDrawing(InventoryDrawingVO inventoryDrawingVO);

	public int addInventoryDrawing(InventoryDrawingVO inventoryDrawingVO, String userId) throws FLException;

	public int deleteInventoryDrawing(InventoryDrawingVO inventoryDrawingVO) throws FLException;

}
