package com.fanglin.data.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.NoodsService;
import com.fanglin.data.material.vo.NoodsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NoodsAction extends BaseListAction {

	private static final long serialVersionUID = -4000273924323761395L;

	@Autowired
	private NoodsService noodsService;

	private List<NoodsVO> noodes;

	private NoodsVO noods;

	@Action(value = "pageNoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageNoods() throws FLException {

		noodsService.pageNoods(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryNoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNoods() throws FLException {

		noods = noodsService.queryNoods(noods);

		return SUCCESS;
	}

	@Action(value = "queryNoodsByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNoodsByName() throws FLException {

		noodes = noodsService.queryNoodsByName(noods, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addNoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNoods() throws FLException {

		noodsService.addNoods(noods, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateNoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateNoods() throws FLException {

		noodsService.updateNoods(noods);

		return SUCCESS;
	}

	@Action(value = "updateNoodsForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateNoodsForStatus() throws FLException {

		noodsService.updateNoodsForStatus(noods);

		return SUCCESS;
	}

	@Action(value = "updateNoodsForCalc", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateNoodsForCalc() throws FLException {

		noodsService.updateNoodsForCalc(noods);

		return SUCCESS;
	}

	public List<NoodsVO> getNoodes() {
		return noodes;
	}

	public void setNoodes(List<NoodsVO> noodes) {
		this.noodes = noodes;
	}

	public NoodsVO getNoods() {
		return noods;
	}

	public void setNoods(NoodsVO noods) {
		this.noods = noods;
	}

}
