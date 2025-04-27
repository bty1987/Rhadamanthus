package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationRecordService;
import com.fanglin.quotation.vo.QuotationRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationRecordAction extends BaseListAction {

	private static final long serialVersionUID = 6389180918647571934L;

	@Autowired
	private QuotationRecordService quotationRecordService;

	private QuotationRecordVO quotationRecord;

	private List<QuotationRecordVO> quotationRecords;

	@Action(value = "pageQuotationRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationRecord() throws FLException {

		quotationRecordService.pageQuotationRecord(getPaging(), getFilters(), quotationRecord);

		return SUCCESS;
	}

	@Action(value = "addQuotationRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationRecord() throws FLException {

		quotationRecordService.addQuotationRecord(quotationRecord, queryUserId());

		return SUCCESS;
	}

	public QuotationRecordVO getQuotationRecord() {
		return quotationRecord;
	}

	public void setQuotationRecord(QuotationRecordVO quotationRecord) {
		this.quotationRecord = quotationRecord;
	}

	public List<QuotationRecordVO> getQuotationRecords() {
		return quotationRecords;
	}

	public void setQuotationRecords(List<QuotationRecordVO> quotationRecords) {
		this.quotationRecords = quotationRecords;
	}

}
