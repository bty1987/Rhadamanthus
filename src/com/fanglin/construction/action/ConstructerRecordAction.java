package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructerRecordService;
import com.fanglin.construction.vo.ConstructerRecordVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructerRecordAction extends BaseListAction {

	private static final long serialVersionUID = 7912765874220030066L;

	@Autowired
	private ConstructerRecordService constructerRecordService;

	private ConstructerRecordVO constructerRecord;

	private List<ConstructerRecordVO> constructerRecords;

	@Action(value = "pageConstructerRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructerRecord() throws FLException {

		constructerRecordService.pageConstructerRecord(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructerRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructerRecord() throws FLException {

		constructerRecords = constructerRecordService.queryConstructerRecord(constructerRecord);

		return SUCCESS;
	}

	@Action(value = "addConstructerRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructerRecord() throws FLException {

		constructerRecordService.addConstructerRecord(constructerRecord);

		return SUCCESS;
	}

	public List<ConstructerRecordVO> getConstructerRecords() {
		return constructerRecords;
	}

	public void setConstructerRecords(List<ConstructerRecordVO> constructerRecords) {
		this.constructerRecords = constructerRecords;
	}

	public ConstructerRecordVO getConstructerRecord() {
		return constructerRecord;
	}

	public void setConstructerRecord(ConstructerRecordVO constructerRecord) {
		this.constructerRecord = constructerRecord;
	}

}
