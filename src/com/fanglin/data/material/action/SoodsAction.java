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
import com.fanglin.data.material.service.SoodsService;
import com.fanglin.data.material.vo.SoodsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SoodsAction extends BaseListAction {

	private static final long serialVersionUID = 6771368786758871433L;

	@Autowired
	private SoodsService soodsService;

	private List<SoodsVO> soodes;

	private SoodsVO soods;

	@Action(value = "pageSoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSoods() throws FLException {

		soodsService.pageSoods(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySoodsByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySoodsByName() throws FLException {

		soodes = soodsService.querySoodsByName(soods, queryCompany());

		return SUCCESS;
	}

	@Action(value = "querySoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySoods() throws FLException {

		soods = soodsService.querySoods(soods);

		return SUCCESS;
	}

	@Action(value = "addSoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSoods() throws FLException {

		soodsService.addSoods(soods, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateSoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSoods() throws FLException {

		soodsService.updateSoods(soods);

		return SUCCESS;
	}

	@Action(value = "updateSoodsForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSoodsForStatus() throws FLException {

		soodsService.updateSoodsForStatus(soodes);

		return SUCCESS;
	}

	@Action(value = "copySoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String copySoods() throws FLException {

		soodsService.copySoods(soods);

		return SUCCESS;
	}

	@Action(value = "deleteSoods", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSoods() throws FLException {

		soodsService.deleteSoods(soods);

		return SUCCESS;
	}

	public List<SoodsVO> getSoodes() {
		return soodes;
	}

	public void setSoodes(List<SoodsVO> soodes) {
		this.soodes = soodes;
	}

	public SoodsVO getSoods() {
		return soods;
	}

	public void setSoods(SoodsVO soods) {
		this.soods = soods;
	}

}
