/**
 * @File Name	: ConstructionAction.java
 * @Package   	: com.fanglin.action.construction
 * @Version		: 1.0
 * @Date		: 2014-9-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
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

import com.fanglin.construction.service.ConstructionRecordService;
import com.fanglin.construction.vo.ConstructionRecordVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionRecordAction extends BaseListAction {

	private static final long serialVersionUID = 3579553772365688946L;

	@Autowired
	private ConstructionRecordService constructionRecordService;

	private ConstructionRecordVO constructionRecord;

	private List<ConstructionRecordVO> constructionRecords;

	@Action(value = "queryConstructionRecordByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionByOrderId() throws FLException {

		constructionRecords = constructionRecordService.queryConstructionRecordByOrderId(constructionRecord);

		return SUCCESS;
	}

	public ConstructionRecordVO getConstructionRecord() {
		return constructionRecord;
	}

	public void setConstructionRecord(ConstructionRecordVO constructionRecord) {
		this.constructionRecord = constructionRecord;
	}

	public List<ConstructionRecordVO> getConstructionRecords() {
		return constructionRecords;
	}

	public void setConstructionRecords(List<ConstructionRecordVO> constructionRecords) {
		this.constructionRecords = constructionRecords;
	}

}
