package com.fanglin.store.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.MgoodsService;
import com.fanglin.store.vo.MgoodsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MgoodsAction extends BaseListAction {

	private static final long serialVersionUID = 6606011256580300464L;

	@Autowired
	private MgoodsService mgoodsService;

	private MgoodsVO mgoods;

	@Action(value = "pageMgoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMgoods() {

		mgoodsService.pageMgoods(getPaging(), getFilters(), false);

		return SUCCESS;
	}

	@Action(value = "addMgoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMgoods() {

		mgoodsService.addMgoods(mgoods);

		return SUCCESS;
	}

	@Action(value = "updateMgoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMgoods() throws FLException {

		mgoodsService.updateMgoods(mgoods);

		return SUCCESS;
	}

	@Action(value = "updateMgoodsForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMgoodsForStatus() throws FLException {

		mgoodsService.updateMgoodsForStatus(mgoods);

		return SUCCESS;
	}

	public MgoodsVO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsVO mgoods) {
		this.mgoods = mgoods;
	}

}
