package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.BackgroundService;
import com.fanglin.customer.vo.BackgroundVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class BackgroundAction extends BaseListAction {

	private static final long serialVersionUID = -8255431605759864886L;

	@Autowired
	private BackgroundService backgroundService;

	private BackgroundVO background;

	@Action(value = "queryBackground", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBackground() throws FLException {

		background = backgroundService.queryBackground(background);

		return SUCCESS;
	}

	@Action(value = "updateBackground", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBackground() throws FLException {

		backgroundService.updateBackground(background);

		return SUCCESS;
	}

	public BackgroundVO getBackground() {
		return background;
	}

	public void setBackground(BackgroundVO background) {
		this.background = background;
	}

}
