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
import com.fanglin.decoration.service.DecorationAuditScaleService;
import com.fanglin.decoration.vo.DecorationAuditScaleVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAuditScaleAction extends BaseListAction {

	private static final long serialVersionUID = -1381344052280090030L;

	@Autowired
	DecorationAuditScaleService decorationAuditScaleService;

	private DecorationAuditScaleVO auditScale;

	private List<DecorationAuditScaleVO> auditScales;

	@Action(value = "queryDecorationAuditScaleByArid", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationAuditScaleByArid() throws FLException{

		auditScales = decorationAuditScaleService.queryDecorationAuditScaleByArid(auditScale);

		return SUCCESS;
	}

	@Action(value = "makeDecorationAuditScale", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDecorationAuditScale() throws FLException{

		decorationAuditScaleService.makeDecorationAuditScale(auditScales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateDecorationAuditScaleForStatus", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationAuditScaleForStatus() throws FLException{

		decorationAuditScaleService.updateDecorationAuditScaleForStatus(auditScale);

		return SUCCESS;
	}

	@Action(value = "addDecorationAuditScale", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationAuditScale() throws FLException{

		decorationAuditScaleService.addDecorationAuditScale(auditScale, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteDecorationAuditScale", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDecorationAuditScale() throws FLException{

		decorationAuditScaleService.deleteDecorationAuditScale(auditScale);

		return SUCCESS;
	}

	public DecorationAuditScaleVO getAuditScale() {
		return auditScale;
	}

	public void setAuditScale(DecorationAuditScaleVO auditScale) {
		this.auditScale = auditScale;
	}

	public List<DecorationAuditScaleVO> getAuditScales() {
		return auditScales;
	}

	public void setAuditScales(List<DecorationAuditScaleVO> auditScales) {
		this.auditScales = auditScales;
	}

}
