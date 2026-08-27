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
import com.fanglin.data.quotation.service.NormaddService;
import com.fanglin.data.quotation.vo.NormaddVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormaddAction extends BaseListAction{

	private static final long serialVersionUID = -514623839013952517L;
	
	@Autowired
	private NormaddService normaddService; 
	
	private List<NormaddVO> normadds;

	private NormaddVO normadd;

	private DecorationVO decoration;
	
	@Action(value = "pageNormadd", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageNormadd() throws FLException {

		normaddService.pageNormadd(getPaging(), getFilters(),queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "queryNormadd", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormadd() throws FLException {

		normadds = normaddService.queryNormadd(normadd, decoration, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "addNormadd", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addNormadd() throws FLException {

		normaddService.addNormadd(normadd, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "updateNormadd", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateNormadd() throws FLException {

		normaddService.updateNormadd(normadd);

		return SUCCESS;
	}

	@Action(value = "updateNormaddForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateNormaddForStatus() throws FLException {

		normaddService.updateNormaddForStatus(normadd);

		return SUCCESS;
	}
	
	@Action(value = "deleteNormadd", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteNormadd() throws FLException {

		normaddService.deleteNormadd(normadd);

		return SUCCESS;
	}
	
	public List<NormaddVO> getNormadds() {
		return normadds;
	}

	public void setNormadds(List<NormaddVO> normadds) {
		this.normadds = normadds;
	}

	public NormaddVO getNormadd() {
		return normadd;
	}

	public void setNormadd(NormaddVO normadd) {
		this.normadd = normadd;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}
}
