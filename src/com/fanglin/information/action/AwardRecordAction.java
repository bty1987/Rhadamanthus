package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.AwardRecordService;
import com.fanglin.information.vo.AwardRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AwardRecordAction extends BaseListAction{

	private static final long serialVersionUID = 3275601378781403080L;

	@Autowired
	private AwardRecordService awardRecordService;
	
	private AwardRecordVO awardRecord;

	private List<AwardRecordVO> awardRecords;

	
	@Action(value = "pageAwardRecord", results = {@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAwardRecords() throws FLException{
		
		awardRecordService.pageAwardRecord(getPaging(),getFilters(),authentication(), awardRecord,queryCompany());
		
		return SUCCESS;
	}
	
	public AwardRecordVO getAwardRecord() {
		return awardRecord;
	}

	public void setAwardRecord(AwardRecordVO awardRecord) {
		this.awardRecord = awardRecord;
	}

	public List<AwardRecordVO> getAwardRecords() {
		return awardRecords;
	}

	public void setAwardRecords(List<AwardRecordVO> awardRecords) {
		this.awardRecords = awardRecords;
	}
}
