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
import com.fanglin.data.quotation.service.NormoodService;
import com.fanglin.data.quotation.vo.NormoodVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormoodAction extends BaseListAction {

	private static final long serialVersionUID = -5568543208164206020L;

	@Autowired
	NormoodService normoodService;

	List<NormoodVO> normoods;

	NormoodVO normood;
	
	@Action(value = "pageNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageNormood() throws FLException {

		normoodService.pageNormood(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryNormoodByQiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormoodByQiid() throws FLException {

		normoods = normoodService.queryNormoodByQiid(normood.getQuotationItem().getQiid());

		return SUCCESS;
	}

	@Action(value = "addNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNormood() throws FLException {

		normoodService.addNormood(normood);

		return SUCCESS;
	}

	@Action(value = "deleteNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteNormood() throws FLException {

		normoodService.deleteNormood(normood);

		return SUCCESS;
	}

	public List<NormoodVO> getNormoods() {
		return normoods;
	}

	public void setNormoods(List<NormoodVO> normoods) {
		this.normoods = normoods;
	}

	public NormoodVO getNormood() {
		return normood;
	}

	public void setNormood(NormoodVO normood) {
		this.normood = normood;
	}

}
