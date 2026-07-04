package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationAuditService;
import com.fanglin.decoration.vo.DecorationAuditVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAuditAction extends BaseListAction {

	private static final long serialVersionUID = -8019583459964543470L;

	@Autowired
	private DecorationAuditService decorationAuditService;

	private DecorationAuditVO audit;

	@Action(value = "pageDecorationAudit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationAudit() throws FLException {

		decorationAuditService.pageDecorationAudit(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "applyDecorationAudit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String applyDecorationAudit() throws FLException {

		decorationAuditService.applyDecorationAudit(audit, queryUserId());

		return SUCCESS;
	}

	public DecorationAuditVO getAudit() {
		return audit;
	}

	public void setAudit(DecorationAuditVO audit) {
		this.audit = audit;
	}

}
