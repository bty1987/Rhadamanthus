package com.fanglin.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.NormChangeRecordService;
import com.fanglin.quotation.vo.NormChangeRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormChangeRecordAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private NormChangeRecordService normChangeRecordService;

	private NormChangeRecordVO normChangeRecord;

	public NormChangeRecordVO getNormChangeRecord() {
		return normChangeRecord;
	}

	public void setNormChangeRecord(NormChangeRecordVO normChangeRecord) {
		this.normChangeRecord = normChangeRecord;
	}

	@Action(value = "pageNormChangeRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageNormChangeRecord() throws FLException {

		normChangeRecordService.pageNormChangeRecord(getPaging(), getNormChangeRecord());

		return SUCCESS;
	}

}
