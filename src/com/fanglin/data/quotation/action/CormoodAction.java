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
import com.fanglin.data.quotation.service.CormoodService;
import com.fanglin.data.quotation.vo.CormoodVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CormoodAction extends BaseListAction {

	private static final long serialVersionUID = 6581325512288639786L;

	@Autowired
	CormoodService cormoodService;

	List<CormoodVO> cormoods;

	CormoodVO cormood;

	@Action(value = "pageCormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCormood() throws FLException {

		cormoodService.pageCormood(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryCormoodByQfid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCormoodByQfid() throws FLException {

		cormoods = cormoodService.queryCormoodByQfid(cormood.getQfid());

		return SUCCESS;
	}

	@Action(value = "addCormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCormood() throws FLException {

		cormoodService.addCormood(cormood);

		return SUCCESS;
	}

	@Action(value = "deleteCormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCormood() throws FLException {

		cormoodService.deleteCormood(cormood);

		return SUCCESS;
	}

	public List<CormoodVO> getCormoods() {
		return cormoods;
	}

	public void setCormoods(List<CormoodVO> cormoods) {
		this.cormoods = cormoods;
	}

	public CormoodVO getCormood() {
		return cormood;
	}

	public void setCormood(CormoodVO cormood) {
		this.cormood = cormood;
	}

}
