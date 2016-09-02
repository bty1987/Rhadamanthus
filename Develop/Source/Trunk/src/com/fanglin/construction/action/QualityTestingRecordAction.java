/**
 * @File Name		: QualityTestingRecordAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-12-9
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

import com.fanglin.construction.service.QualityTestingRecordService;
import com.fanglin.construction.vo.QualityTestingRecordVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QualityTestingRecordAction extends BaseListAction{

	private static final long serialVersionUID = 6752789878296915615L;
	
	@Autowired
	private QualityTestingRecordService qualityTestingRecordService;
	
	private QualityTestingRecordVO qualityTestingRecord;
	
	private List<Integer> qtrIds;
	
	@Action(value = "pageQualityTestingRecordByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQualityTestingRecordByOrderId() throws FLException{
		
		qualityTestingRecordService.pageQualityTestingRecordByOrderId(getPaging(), getFilters(), qualityTestingRecord, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addQualityTestingRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQualityTestingRecord() throws FLException{
		
		qualityTestingRecord.setOperaterId(queryUserId());
		qualityTestingRecord.setOperaterName(queryUserName());
		
		qualityTestingRecordService.addQualityTestingRecord(qualityTestingRecord);
		
		return SUCCESS;
	}

	@Action(value = "updateQualityTestingRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQualityTestingRecord(){
		
		qualityTestingRecordService.updateQualityTestingRecord(qualityTestingRecord);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteQualityTestingRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQualityTestingRecord(){
		
		qualityTestingRecordService.deleteQualityTestingRecords(qtrIds);
		
		return SUCCESS;
	}

	public QualityTestingRecordVO getQualityTestingRecord(){
		return qualityTestingRecord;
	}

	public void setQualityTestingRecord(QualityTestingRecordVO qualityTestingRecord){
		this.qualityTestingRecord = qualityTestingRecord;
	}

	public List<Integer> getQtrIds(){
		return qtrIds;
	}

	public void setQtrIds(List<Integer> qtrIds){
		this.qtrIds = qtrIds;
	}
	
}
