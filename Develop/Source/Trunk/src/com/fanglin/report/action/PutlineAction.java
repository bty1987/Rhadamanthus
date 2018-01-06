package com.fanglin.report.action;

import java.text.ParseException;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.report.service.PutlineService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PutlineAction extends BaseListAction {

	private static final long serialVersionUID = -8859191009003512537L;

	@Autowired
	private PutlineService putlineService;
	
	@Action(value = "pagePutline", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePutline() throws ParseException{

		putlineService.pagePutline(getPaging(), getFilters());
		
		return SUCCESS;
	}
}
