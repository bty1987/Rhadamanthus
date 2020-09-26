package com.fanglin.store.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.store.service.MuserService;
import com.fanglin.store.vo.MuserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MuserAction extends BaseListAction {

	private static final long serialVersionUID = 6605965645950300464L;

	@Autowired
	private MuserService muserService;

	private MuserVO muser;

	@Action(value = "pageMuser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMuser() {

		muserService.pageMuser(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "updateMuser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMuser() {

		muserService.saveMuser(muser);

		return SUCCESS;
	}

	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
	}

}
