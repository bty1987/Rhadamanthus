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
import com.fanglin.decoration.service.DecorationAuditRecordService;
import com.fanglin.decoration.vo.DecorationAuditRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationAuditRecordAction extends BaseListAction {

	private static final long serialVersionUID = 3384431274510843369L;

	@Autowired
	DecorationAuditRecordService decorationAuditRecordService;

	private DecorationAuditRecordVO auditRecord;

	private List<DecorationAuditRecordVO> auditRecords;

	@Action(value = "queryDecorationAuditRecordByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationAuditRecordByOrderId() throws FLException {

		auditRecords = decorationAuditRecordService.queryDecorationAuditRecordByOrderId(auditRecord);

		return SUCCESS;
	}

	@Action(value = "addDecorationAuditRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationAuditRecord() throws FLException {

		decorationAuditRecordService.addDecorationAuditRecord(auditRecord, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateDecorationAuditRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationAuditRecord() throws FLException {

		decorationAuditRecordService.updateDecorationAuditRecord(auditRecord);

		return SUCCESS;
	}

	public DecorationAuditRecordVO getAuditRecord() {
		return auditRecord;
	}

	public void setAuditRecord(DecorationAuditRecordVO auditRecord) {
		this.auditRecord = auditRecord;
	}

	public List<DecorationAuditRecordVO> getAuditRecords() {
		return auditRecords;
	}

	public void setAuditRecords(List<DecorationAuditRecordVO> auditRecords) {
		this.auditRecords = auditRecords;
	}

}
