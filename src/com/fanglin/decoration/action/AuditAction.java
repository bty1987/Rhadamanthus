package com.fanglin.decoration.action;

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
public class AuditAction extends BaseListAction {

	private static final long serialVersionUID = -8019583459964543470L;

	@Autowired
	private AuditService auditService;

	private AuditVO audit;

	@Action(value = "pageAudit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAudit() throws FLException {

		auditService.pageAudit(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "applyAudit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String applyAudit() throws FLException {

		auditService.applyAudit(audit, queryUserId());

		return SUCCESS;
	}

	public AuditVO getAudit() {
		return audit;
	}

	public void setAudit(AuditVO audit) {
		this.audit = audit;
	}

}
