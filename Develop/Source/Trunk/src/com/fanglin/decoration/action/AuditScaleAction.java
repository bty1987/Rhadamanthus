package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.AuditScaleService;
import com.fanglin.decoration.vo.AuditScaleVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class AuditScaleAction extends BaseListAction {

	private static final long serialVersionUID = -1381344052280090030L;
	
	@Autowired
	AuditScaleService auditScaleService;
	
	private AuditScaleVO auditScale;
	
	private List<AuditScaleVO> auditScales;
	
	@Action(value = "queryAuditScaleByArid", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAuditScaleByArid() throws FLException{

		auditScales = auditScaleService.queryAudtiScaleByArid(auditScale);
		
		return SUCCESS;
	}
	
	@Action(value = "makeAuditScale", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeAuditScale() throws FLException{

		auditScaleService.makeAuditScale(auditScales, queryUserId());
		
		return SUCCESS;
	}

	@Action(value = "updateAuditScaleForStatus", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAudtiScaleForStatus() throws FLException{

		auditScaleService.updateAuditScaleForStatus(auditScale);
		
		return SUCCESS;
	}
	
	@Action(value = "addAuditScale", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAudtiScale() throws FLException{

		auditScaleService.addAuditScale(auditScale, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "deleteAuditScale", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAudtiScale() throws FLException{

		auditScaleService.deleteAuditScale(auditScale);
		
		return SUCCESS;
	}

	public AuditScaleVO getAuditScale() {
		return auditScale;
	}

	public void setAuditScale(AuditScaleVO auditScale) {
		this.auditScale = auditScale;
	}

	public List<AuditScaleVO> getAuditScales() {
		return auditScales;
	}

	public void setAuditScales(List<AuditScaleVO> auditScales) {
		this.auditScales = auditScales;
	}

}
