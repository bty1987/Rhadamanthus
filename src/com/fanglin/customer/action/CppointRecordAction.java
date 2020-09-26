package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;


import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.CppointRecordService;
import com.fanglin.customer.vo.CppointRecordVO;
import com.fanglin.customer.vo.CppointVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class CppointRecordAction extends BaseListAction{


	private static final long serialVersionUID = -6191275292550189192L;
	
	@Autowired
	CppointRecordService cppointRecordService;
	
	CppointVO cppoint;
	
	List<CppointRecordVO> cppointRecords;
	 

	@Action(value = "queryCppointRecord", results = { @Result(name = "success", type = "json", params = {
			"ignoreHierarchy", "false" }) }, params = { "contentType",
			"text/html" })
	public String queryCppointRecord() throws FLException {

		cppointRecords = cppointRecordService.queryCppointRecord(cppoint);

		return SUCCESS;
	}
	
	public List<CppointRecordVO> getCppointRecords() {
		return cppointRecords;
	}


	public void setCppointRecords(List<CppointRecordVO> cppointRecords) {
		this.cppointRecords = cppointRecords;
	}


	public CppointVO getCppoint() {
		return cppoint;
	}

	public void setCppoint(CppointVO cppoint) {
		this.cppoint = cppoint;
	}

	
}
