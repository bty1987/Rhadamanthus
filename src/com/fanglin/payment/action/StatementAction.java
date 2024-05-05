package com.fanglin.payment.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.StatementService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class StatementAction extends BaseListAction {

	private static final long serialVersionUID = 6415360053665935861L;

	@Autowired
	private StatementService statementService;

	@Action(value = "pageStatement", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageStatement() throws FLException {

		statementService.pageStatement(getPaging(), getFilters());

		return SUCCESS;
	}

}
