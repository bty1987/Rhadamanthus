package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationInclusiveService;
import com.fanglin.decoration.vo.DecorationInclusiveVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationInclusiveAction extends BaseListAction {

	private static final long serialVersionUID = 6608494422500416917L;
	
	@Autowired
	private DecorationInclusiveService decorationInclusiveService;
	
	private DecorationInclusiveVO decorationInclusive;

	@Action(value = "pageDecorationInclusive", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationInclusive() throws FLException{

		decorationInclusiveService. pageDecorationInclusive(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationInclusive", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationInclusive() throws FLException{

		decorationInclusive = decorationInclusiveService.queryDecorationInclusive(decorationInclusive);

		return SUCCESS;
	}
	
	@Action(value = "makeDecorationInclusive", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDecorationInclusive() throws FLException{

		decorationInclusiveService.makeDecorationInclusive(decorationInclusive, queryUserId());

		return SUCCESS;
	}

	public DecorationInclusiveVO getDecorationInclusive() {
		return decorationInclusive;
	}

	public void setDecorationInclusive(DecorationInclusiveVO decorationInclusive) {
		this.decorationInclusive = decorationInclusive;
	}


	
	
}