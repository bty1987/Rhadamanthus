package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.SalesActivityRecordService;
import com.fanglin.sales.vo.SalesActivityRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesActivityRecordAction extends BaseListAction {

	private static final long serialVersionUID = 4558556608040379292L;

	@Autowired
	private SalesActivityRecordService salesActivityRecordService;

	private List<SalesActivityRecordVO> salesActivityRecords;

	private SalesActivityRecordVO salesActivityRecord;

	@Action(value = "querySalesActivityRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesActivityRecord() throws FLException {

		salesActivityRecords = salesActivityRecordService.querySalesActivityRecord(salesActivityRecord);

		return SUCCESS;
	}

	@Action(value = "addSalesActivityRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesActivityRecord() throws FLException {

		salesActivityRecordService.addSalesActivityRecord(salesActivityRecord, queryUserId());

		return SUCCESS;
	}

	public List<SalesActivityRecordVO> getSalesActivityRecords() {
		return salesActivityRecords;
	}

	public void setSalesActivityRecords(List<SalesActivityRecordVO> salesActivityRecords) {
		this.salesActivityRecords = salesActivityRecords;
	}

	public SalesActivityRecordVO getSalesActivityRecord() {
		return salesActivityRecord;
	}

	public void setSalesActivityRecord(SalesActivityRecordVO salesActivityRecord) {
		this.salesActivityRecord = salesActivityRecord;
	}

}
