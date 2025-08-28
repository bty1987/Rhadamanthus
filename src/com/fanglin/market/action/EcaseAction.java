package com.fanglin.market.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.EcaseService;
import com.fanglin.market.vo.EcaseVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EcaseAction extends BaseListAction {

	private static final long serialVersionUID = 6343058646875475735L;

	@Autowired
	private EcaseService caseService;

	private EcaseVO caser;

	private List<EcaseVO> cases;

	@Action(value = "pageEcase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageEcase() throws FLException {

		caseService.pageEcase(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryEcase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEcase() throws FLException {

		caseService.pageEcase(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryEcaseByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEcaseByCid() throws FLException {

		caser = caseService.queryEcaseByCid(caser);

		return SUCCESS;
	}

	@Action(value = "queryEcaseByTypeAndStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEcaseByTypeAndStatus() throws FLException {

		cases = caseService.queryEcase(caser);

		return SUCCESS;
	}

	@Action(value = "addEcase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addEcase() throws FLException {

		caseService.addEcase(caser);

		return SUCCESS;
	}

	@Action(value = "updateEcase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateEcase() throws FLException {

		caseService.updateEcase(caser);

		return SUCCESS;
	}

	@Action(value = "updateEcaseForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateEcaseForStatus() throws FLException {

		caseService.updateEcaseForStatus(caser);

		return SUCCESS;
	}

	@Action(value = "deleteEcase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteEcase() throws FLException {

		caseService.deleteEcase(caser);

		return SUCCESS;
	}

	public EcaseVO getCaser() {
		return caser;
	}

	public void setCaser(EcaseVO caser) {
		this.caser = caser;
	}

	public List<EcaseVO> getCases() {
		return cases;
	}

	public void setCases(List<EcaseVO> cases) {
		this.cases = cases;
	}

}
