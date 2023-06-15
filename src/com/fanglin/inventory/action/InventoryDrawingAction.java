package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.InventoryDrawingService;
import com.fanglin.inventory.vo.InventoryDrawingVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class InventoryDrawingAction extends BaseListAction {

	private static final long serialVersionUID = 5677268838732775190L;

	@Autowired
	private InventoryDrawingService inventoryDrawingService;

	private InventoryDrawingVO inventoryDrawing;

	private List<InventoryDrawingVO> inventoryDrawings;

	@Action(value = "queryInventoryDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryInventoryDrawing() {

		inventoryDrawings = inventoryDrawingService.queryInventoryDrawing(inventoryDrawing);

		return SUCCESS;
	}

	@Action(value = "addInventoryDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addInventoryDrawing() throws FLException {

		inventoryDrawingService.addInventoryDrawing(inventoryDrawing, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteInventoryDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteInventoryDrawing() throws FLException {

		inventoryDrawingService.deleteInventoryDrawing(inventoryDrawing);

		return SUCCESS;
	}

	public InventoryDrawingVO getInventoryDrawing() {
		return inventoryDrawing;
	}

	public void setInventoryDrawing(InventoryDrawingVO inventoryDrawing) {
		this.inventoryDrawing = inventoryDrawing;
	}

	public List<InventoryDrawingVO> getInventoryDrawings() {
		return inventoryDrawings;
	}

	public void setInventoryDrawings(List<InventoryDrawingVO> inventoryDrawings) {
		this.inventoryDrawings = inventoryDrawings;
	}

}
