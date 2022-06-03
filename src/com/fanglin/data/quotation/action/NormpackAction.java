package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.NormpackService;
import com.fanglin.data.quotation.vo.NormpackVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormpackAction extends BaseListAction {

	private static final long serialVersionUID = -514623839013952517L;

	@Autowired
	private NormpackService normpackService;

	private List<NormpackVO> normpacks;

	private NormpackVO normpack;

	@Action(value = "pageNormpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageNormpack() throws FLException {

		normpackService.pageNormpack(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryNormpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormpack() throws FLException {

		normpacks = normpackService.queryNormpack(normpack, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addNormpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNormpack() throws FLException {

		normpackService.addNormpack(normpack, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateNormpackForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateNormpackForStatus() throws FLException {

		normpackService.updateNormpackForStatus(normpack);

		return SUCCESS;
	}

	@Action(value = "deleteNormpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteNormpack() throws FLException {

		normpackService.deleteNormpack(normpack);

		return SUCCESS;
	}

	public List<NormpackVO> getNormpacks() {
		return normpacks;
	}

	public void setNormpacks(List<NormpackVO> normpacks) {
		this.normpacks = normpacks;
	}

	public NormpackVO getNormpack() {
		return normpack;
	}

	public void setNormpack(NormpackVO normpack) {
		this.normpack = normpack;
	}
}
