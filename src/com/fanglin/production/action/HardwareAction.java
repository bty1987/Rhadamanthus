package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.HardwareItemService;
import com.fanglin.production.service.HardwareService;
import com.fanglin.production.vo.HardwareItemVO;
import com.fanglin.production.vo.HardwareVO;
import com.fanglin.production.vo.ProductionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class HardwareAction extends BaseListAction{

	private static final long serialVersionUID = 7012461874220030069L;

	@Autowired
	private HardwareService hardwareService;
	
	@Autowired
	private HardwareItemService hardwareItemService;
	
	private ProductionVO production;
	
	private HardwareVO hardware;
	
	private HardwareItemVO hardwareItem;
	
	private List<HardwareItemVO> hardwareItems;
	
	@Action(value = "pageHardware", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageHardware(){
		
		hardwareService.pageHardware(getPaging(), getFilters(), production);
		
		return SUCCESS;
	}
	
	@Action(value = "pageHardwareItemByHid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageHardwareItemByHid(){
		
		hardwareItemService.pageHardwareItemByHid(getPaging(), getFilters(), hardware);
		
		return SUCCESS;
	}
	
	
	@Action(value = "addHardware", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addHardware() throws FLException{
		
		hardwareService.addHardware(hardware);
		
		return SUCCESS;
	}
	
	@Action(value = "addHardwareItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addHardwareItem() throws FLException{
		
		hardwareItemService.addHardwareItem(hardwareItems,hardware);
		
		return SUCCESS;
	}
	
	@Action(value = "updateHardware", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHardware() throws FLException{
		
		hardwareService.updateHardware(hardware);
		
		return SUCCESS;
	}
	
	@Action(value = "updateHardwareForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHardwareForStatus() throws FLException{
		
		hardwareService.updateHardwareForStatus(hardware);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteHardware", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteHardware() throws FLException{
		
		hardwareService.deleteHardware(hardware);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteHardwareItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteHardwareItem() throws FLException{
		
		hardwareItemService.deleteHardwareItem(hardwareItem);
		
		return SUCCESS;
	}

	public ProductionVO getProduction() {
		return production;
	}

	public void setProduction(ProductionVO production) {
		this.production = production;
	}

	public HardwareVO getHardware() {
		return hardware;
	}

	public void setHardware(HardwareVO hardware) {
		this.hardware = hardware;
	}

	public HardwareItemVO getHardwareItem() {
		return hardwareItem;
	}

	public void setHardwareItem(HardwareItemVO hardwareItem) {
		this.hardwareItem = hardwareItem;
	}

	public List<HardwareItemVO> getHardwareItems() {
		return hardwareItems;
	}

	public void setHardwareItems(List<HardwareItemVO> hardwareItems) {
		this.hardwareItems = hardwareItems;
	}

	

	
}
