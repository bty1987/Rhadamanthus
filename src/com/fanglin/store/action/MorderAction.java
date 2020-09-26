package com.fanglin.store.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.MorderService;
import com.fanglin.store.vo.MorderVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MorderAction extends BaseListAction {

	private static final long serialVersionUID = -6773935450546457207L;

	@Autowired
	private MorderService morderService;

	private MorderVO morder;

	@Action(value = "pageMorder", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMorder() {

		morderService.pageMorder(getPaging(), getFilters(), false);

		return SUCCESS;
	}

	@Action(value = "deleteMorder", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteMorder() throws FLException {

		morderService.deleteMorder(morder);

		return SUCCESS;
	}

	public MorderVO getMorder() {
		return morder;
	}

	public void setMorder(MorderVO morder) {
		this.morder = morder;
	}

}
