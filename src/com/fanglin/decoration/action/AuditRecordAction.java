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
import com.fanglin.decoration.service.AuditRecordService;
import com.fanglin.decoration.vo.AuditRecordVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class AuditRecordAction extends BaseListAction {

	private static final long serialVersionUID = 3384431274510843369L;

	@Autowired
	AuditRecordService auditRecordService;
	
	private AuditRecordVO auditRecord;
	
	private List<AuditRecordVO> auditRecords;

	@Action(value = "queryAuditRecordByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAuditRecordByOrderId() throws FLException{

		auditRecords = auditRecordService.queryAuditRecordByOrderId(auditRecord);

		return SUCCESS;
	}
	
	@Action(value = "addAuditRecord", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAuditRecord() throws FLException{

		auditRecordService.addAuditRecord(auditRecord,queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "updateAuditRecord", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAuditRecord() throws FLException{
		
		auditRecordService.updateAuditRecord(auditRecord);

		return SUCCESS;
	}

	public AuditRecordService getAuditRecordService() {
		return auditRecordService;
	}

	public void setAuditRecordService(AuditRecordService auditRecordService) {
		this.auditRecordService = auditRecordService;
	}

	public AuditRecordVO getAuditRecord() {
		return auditRecord;
	}

	public void setAuditRecord(AuditRecordVO auditRecord) {
		this.auditRecord = auditRecord;
	}

	public List<AuditRecordVO> getAuditRecords() {
		return auditRecords;
	}

	public void setAuditRecords(List<AuditRecordVO> auditRecords) {
		this.auditRecords = auditRecords;
	}

	
}
