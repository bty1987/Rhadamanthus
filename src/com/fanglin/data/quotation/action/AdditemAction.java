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
import com.fanglin.data.quotation.service.AdditemService;
import com.fanglin.data.quotation.vo.AdditemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AdditemAction extends BaseListAction{

	private static final long serialVersionUID = -514623839013952517L;
	
	@Autowired
	private AdditemService additemService; 
	
	private List<AdditemVO> additems;
	
	private AdditemVO additem;
	
	@Action(value = "pageAdditem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAdditem() throws FLException {

		additemService.pageAdditem(getPaging(), getFilters(),queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "queryAdditem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAdditem() throws FLException {

		additems = additemService.queryAdditem(additem, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "addAdditem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAdditem() throws FLException {

		additemService.addAdditem(additem, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "updateAdditemForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAdditemForStatus() throws FLException {

		additemService.updateAdditemForStatus(additem);

		return SUCCESS;
	}
	
	@Action(value = "deleteAdditem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAdditem() throws FLException {

		additemService.deleteAdditem(additem);

		return SUCCESS;
	}
	
	public List<AdditemVO> getAdditems() {
		return additems;
	}

	public void setAdditems(List<AdditemVO> additems) {
		this.additems = additems;
	}

	public AdditemVO getAdditem() {
		return additem;
	}

	public void setAdditem(AdditemVO additem) {
		this.additem = additem;
	}
}
