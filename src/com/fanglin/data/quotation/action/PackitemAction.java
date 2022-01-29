package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.PackitemService;
import com.fanglin.data.quotation.vo.PackitemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PackitemAction extends BaseListAction{

	private static final long serialVersionUID = -514623839013952517L;
	
	@Autowired
	private PackitemService packitemService; 
	
	private List<PackitemVO> packitems;
	
	private PackitemVO packitem;
	
	@Action(value = "pagePackitem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePackitem() throws FLException {

		packitemService.pagePackitem(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "queryPackitem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPackitem() throws FLException {

		packitems = packitemService.queryPackitem(packitem);

		return SUCCESS;
	}
	
	@Action(value = "addPackitem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPackitem() throws FLException {

		packitemService.addPackitem(packitem);

		return SUCCESS;
	}
	
	@Action(value = "updatePackitemForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePackitemForStatus() throws FLException {

		packitemService.updatePackitemForStatus(packitem);

		return SUCCESS;
	}
	
	@Action(value = "deletePackitem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePackitem() throws FLException {

		packitemService.deletePackitem(packitem);

		return SUCCESS;
	}

	public List<PackitemVO> getPackitems() {
		return packitems;
	}

	public void setPackitems(List<PackitemVO> packitems) {
		this.packitems = packitems;
	}

	public PackitemVO getPackitem() {
		return packitem;
	}

	public void setPackitem(PackitemVO packitem) {
		this.packitem = packitem;
	}	
}
