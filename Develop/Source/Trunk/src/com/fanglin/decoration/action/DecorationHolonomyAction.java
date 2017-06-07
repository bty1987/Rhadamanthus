package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationHolonomyService;
import com.fanglin.decoration.vo.DecorationHolonomyVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationHolonomyAction extends BaseListAction {

	private static final long serialVersionUID = 6608494422500416917L;
	
	@Autowired
	private DecorationHolonomyService decorationHolonomyService;
	
	private DecorationHolonomyVO decorationHolonomy;

	@Action(value = "pageDecorationHolonomy", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationHolonomy() throws FLException{

		decorationHolonomyService.pageDecorationHolonomy(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "queryDecorationHolonomy", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationHolonomy() throws FLException{

		decorationHolonomy = decorationHolonomyService.queryDecorationHolonomy(decorationHolonomy);

		return SUCCESS;
	}
	
	@Action(value = "makeDecorationHolonomy", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDecorationHolonomy() throws FLException{

		decorationHolonomyService.makeDecorationHolonomy(decorationHolonomy, queryUserId());

		return SUCCESS;
	}

	public DecorationHolonomyVO getDecorationHolonomy() {
		return decorationHolonomy;
	}

	public void setDecorationHolonomy(DecorationHolonomyVO decorationHolonomy) {
		this.decorationHolonomy = decorationHolonomy;
	}
	
	
}