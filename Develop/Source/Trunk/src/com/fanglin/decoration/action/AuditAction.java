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
import com.fanglin.decoration.service.AuditService;
import com.fanglin.decoration.vo.AuditVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class AuditAction extends BaseListAction{

	private static final long serialVersionUID = -8019583459964543470L;
	
	@Autowired
	private AuditService auditService;
	
	private List<AuditVO> auditVOs;
	
	private AuditVO auditVO;
	
	@Action(value = "pageAudit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAudit() throws FLException{
		
		auditVOs = auditService.pageAudit(getPaging(), getFilters(), queryCompany());
	
		return SUCCESS;
	}
	
	@Action(value = "applyAudit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String applyAudit() throws FLException{
		
		auditService.applyAudit(auditVO,queryUserId());
		
		return SUCCESS;
	}

	public List<AuditVO> getAuditVOs() {
		return auditVOs;
	}

	public void setAuditVOs(List<AuditVO> auditVOs) {
		this.auditVOs = auditVOs;
	}

	public AuditVO getAuditVO() {
		return auditVO;
	}

	public void setAuditVO(AuditVO auditVO) {
		this.auditVO = auditVO;
	}
	
}
