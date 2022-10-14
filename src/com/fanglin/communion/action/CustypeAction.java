package com.fanglin.communion.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.CustypeService;
import com.fanglin.communion.vo.CustypeVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CustypeAction extends BaseListAction {

	private static final long serialVersionUID = 1107914492882566298L;

	@Autowired
	private CustypeService custypeService;

	private CustypeVO custype;

	@Action(value = "pageCustype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCustype() throws FLException {

		custypeService.pageCustype(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryCustype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCustype() throws FLException {

		custype = custypeService.queryCustype(custype, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addCustype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustype() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		custypeService.addCustype(custype, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateCustype", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustype() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		custypeService.updateCustype(custype);

		return SUCCESS;
	}

	public CustypeVO getCustype() {
		return custype;
	}

	public void setCustype(CustypeVO custype) {
		this.custype = custype;
	}

}
