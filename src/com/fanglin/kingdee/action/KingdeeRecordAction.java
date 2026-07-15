package com.fanglin.kingdee.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.kingdee.service.KingdeeRecordService;
import com.fanglin.kingdee.vo.KingdeeRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class KingdeeRecordAction extends BaseListAction{
	
	private static final long serialVersionUID = 4543848791230140486L;

	@Autowired
	private KingdeeRecordService kingdeeRecordService;
	
	private List<KingdeeRecordVO> kingdeeRecords;
	
	private KingdeeRecordVO kingdeeRecord;
	
	@Action(value = "pageKingdeeRecord", results = {@Result(name = "success", type = "json", params = {"ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String pageKingdeeRecord(){
		
		kingdeeRecordService.pageKingdeeRecord(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "addKingdeeRecord", results = {@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false"})}, params = {"contentType", "text/html"})
	public String addKingdeeRecord() throws FLException {

		kingdeeRecordService.addKingdeeRecord(kingdeeRecord);

		return SUCCESS;
	}

	public List<KingdeeRecordVO> getKingdeeRecords() {
		return kingdeeRecords;
	}

	public void setKingdeeRecords(List<KingdeeRecordVO> kingdeeRecords) {
		this.kingdeeRecords = kingdeeRecords;
	}

	public KingdeeRecordVO getKingdeeRecord() {
		return kingdeeRecord;
	}

	public void setKingdeeRecord(KingdeeRecordVO kingdeeRecord) {
		this.kingdeeRecord = kingdeeRecord;
	}
	
}
