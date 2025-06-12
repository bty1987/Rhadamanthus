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
import com.fanglin.decoration.service.DecorationActivityRecordService;
import com.fanglin.decoration.vo.DecorationActivityRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationActivityRecordAction extends BaseListAction {

	private static final long serialVersionUID = 3779510966927809446L;

	@Autowired
	private DecorationActivityRecordService decorationActivityRecordService;

	private List<DecorationActivityRecordVO> decorationActivityRecords;

	private DecorationActivityRecordVO decorationActivityRecord;

	@Action(value = "queryDecorationActivityRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationActivityRecord() throws FLException {

		decorationActivityRecords = decorationActivityRecordService.queryDecorationActivityRecord(decorationActivityRecord);

		return SUCCESS;
	}

	@Action(value = "addDecorationActivityRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationActivityRecord() throws FLException {

		decorationActivityRecordService.addDecorationActivityRecord(decorationActivityRecord, queryUserId());

		return SUCCESS;
	}

	public List<DecorationActivityRecordVO> getDecorationActivityRecords() {
		return decorationActivityRecords;
	}

	public void setDecorationActivityRecords(List<DecorationActivityRecordVO> decorationActivityRecords) {
		this.decorationActivityRecords = decorationActivityRecords;
	}

	public DecorationActivityRecordVO getDecorationActivityRecord() {
		return decorationActivityRecord;
	}

	public void setDecorationActivityRecord(DecorationActivityRecordVO decorationActivityRecord) {
		this.decorationActivityRecord = decorationActivityRecord;
	}

}
