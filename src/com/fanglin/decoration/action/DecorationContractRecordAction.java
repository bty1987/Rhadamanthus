package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.decoration.service.DecorationContractRecordService;
import com.fanglin.decoration.vo.DecorationContractRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationContractRecordAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private DecorationContractRecordService decorationContractRecordService;

	private List<DecorationContractRecordVO> decorationContractRecords;

	private DecorationContractRecordVO decorationContractRecord;

	@Action(value = "queryDecorationContractRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationContractRecord() {

		decorationContractRecords = decorationContractRecordService.queryDecorationContractRecord(decorationContractRecord.getOrderId());

		return SUCCESS;
	}

	public List<DecorationContractRecordVO> getDecorationContractRecords() {
		return decorationContractRecords;
	}

	public void setDecorationContractRecords(List<DecorationContractRecordVO> decorationContractRecords) {
		this.decorationContractRecords = decorationContractRecords;
	}

	public DecorationContractRecordVO getDecorationContractRecord() {
		return decorationContractRecord;
	}

	public void setDecorationContractRecord(DecorationContractRecordVO decorationContractRecord) {
		this.decorationContractRecord = decorationContractRecord;
	}

}
