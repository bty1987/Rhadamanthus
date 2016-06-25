/**
 * @File Name		: InspectionRecordAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.InspectionRecordService;
import com.fanglin.construction.vo.InspectionRecordVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class InspectionRecordAction extends BaseListAction{

	private static final long serialVersionUID = -4286508443372258380L;
	
	@Autowired
	private InspectionRecordService inspectionRecordService;
	
	private InspectionRecordVO inspectionRecord;
	
	private List<String> irIds;
	
	@Action(value = "pageInspectionRecordByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageInspectionRecordByOrderId(){
		
		inspectionRecordService.pageInspectionRecordByOrderId(getPaging(), getFilters(), inspectionRecord);
		
		return SUCCESS;
	}
	
	@Action(value = "addInspectionRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addInspectionRecord() throws FLException{
		
		inspectionRecord.setOperaterId(getUserId());
		inspectionRecord.setOperaterName(getUserName());
		
		inspectionRecordService.saveOrUpdateInspectionRecord(inspectionRecord);
		
		return SUCCESS;
	}
	
	@Action(value = "updateInspectionRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateInspectionRecord(){
		
		inspectionRecordService.updateInspectionRecord(inspectionRecord);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteInspectionRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteInspectionRecord() throws FLException{
		
		inspectionRecordService.deleteInspectionRecords(irIds, getUserId());
		
		return SUCCESS;
	}

	public InspectionRecordVO getInspectionRecord(){
		return inspectionRecord;
	}

	public void setInspectionRecord(InspectionRecordVO inspectionRecord){
		this.inspectionRecord = inspectionRecord;
	}

	public List<String> getIrIds(){
		return irIds;
	}

	public void setIrIds(List<String> irIds){
		this.irIds = irIds;
	}
	
}
