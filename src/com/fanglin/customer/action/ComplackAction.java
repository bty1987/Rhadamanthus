package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.ComplackService;
import com.fanglin.customer.vo.ComplackVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ComplackAction extends BaseListAction {

	private static final long serialVersionUID = 3141946183128408686L;
	
	@Autowired
	private ComplackService complackService;
	
	private List<ComplackVO> complacks;
	
	private ComplackVO complack;
	
	@Action(value = "queryComplack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryComplack() throws FLException {

		complacks = complackService.queryComplack(complack);

		return SUCCESS;
	}
	
	@Action(value = "trackComplack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String trackComplack() throws FLException {

		complackService.trackComplack(complack, queryUserId());

		return SUCCESS;
	}

	public List<ComplackVO> getComplacks() {
		return complacks;
	}

	public void setComplacks(List<ComplackVO> complacks) {
		this.complacks = complacks;
	}

	public ComplackVO getComplack() {
		return complack;
	}

	public void setComplack(ComplackVO complack) {
		this.complack = complack;
	}
	
}
