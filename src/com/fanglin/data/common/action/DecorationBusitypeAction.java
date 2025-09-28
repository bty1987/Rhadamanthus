package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.DecorationBusitypeService;
import com.fanglin.data.common.vo.DecorationBusitypeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationBusitypeAction extends BaseListAction {

	private static final long serialVersionUID = -2668902374670924994L;

	@Autowired
	private DecorationBusitypeService decorationBusitypeService;

	private DecorationBusitypeVO decorationBusitype;

	private List<DecorationBusitypeVO> decorationBusitypes;
	
	private String company;

	@Action(value = "pageDecorationBusitype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationBusitype() throws FLException {

		decorationBusitypeService.pageDecorationBusitype(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationBusitype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationBusitype() throws FLException {

		decorationBusitypes = decorationBusitypeService.queryDecorationBusitype(queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationBusitypeByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationBusitypeByName() throws FLException {

		decorationBusitype = decorationBusitypeService.queryDecorationBusitypeByName(decorationBusitype,company);

		return SUCCESS;
	}
	
	@Action(value = "addDecorationBusitype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationBusitype() throws FLException {

		decorationBusitypeService.addDecorationBusitype(decorationBusitype, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateDecorationBusitypeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateServiceNodeForStatus() throws FLException {

		decorationBusitypeService.updateDecorationBusitypeForStatus(decorationBusitype);

		return SUCCESS;
	}

	@Action(value = "updateDecorationBusitype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateServiceNode() throws FLException {

		decorationBusitypeService.updateDecorationBusitype(decorationBusitype);

		return SUCCESS;
	}

	public List<DecorationBusitypeVO> getDecorationBusitypes() {
		return decorationBusitypes;
	}

	public void setDecorationBusitypes(
			List<DecorationBusitypeVO> decorationBusitypes) {
		this.decorationBusitypes = decorationBusitypes;
	}

	public DecorationBusitypeVO getDecorationBusitype() {
		return decorationBusitype;
	}

	public void setDecorationBusitype(DecorationBusitypeVO decorationBusitype) {
		this.decorationBusitype = decorationBusitype;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}
	
	

}
