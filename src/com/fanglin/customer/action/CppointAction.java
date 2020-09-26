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
import com.fanglin.customer.service.CppointService;
import com.fanglin.customer.vo.CppointRecordVO;
import com.fanglin.customer.vo.CppointVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CppointAction extends BaseListAction {

	private static final long serialVersionUID = -8825208607348364693L;

	@Autowired
	private CppointService cppointService;

	@Autowired
	private CppointRecordService cppointRecordService;

	private CppointVO cppoint;

	private List<CppointRecordVO> cppointRecords;

	@Action(value = "queryCppoint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCppoint() throws FLException {

		cppoint = cppointService.queryCppoint(cppoint);

		return SUCCESS;
	}

	@Action(value = "queryCppointRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCppointRecord() throws FLException {

		cppointRecords = cppointRecordService.queryCppointRecord(cppoint);

		return SUCCESS;
	}

	@Action(value = "createCppoint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createCppoint() throws FLException {

		cppoint = cppointService.createCppoint(cppoint, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addupCppoint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addupCppoint() throws FLException {

		cppointService.addupCppoint(cppoint, queryUserId());

		return SUCCESS;
	}

	@Action(value = "useupCppoint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String useupCppoint() throws FLException {

		cppoint = cppointService.useupCppoint(cppoint, queryUserId());

		return SUCCESS;
	}

	public CppointVO getCppoint() {
		return cppoint;
	}

	public void setCppoint(CppointVO cppoint) {
		this.cppoint = cppoint;
	}

	public List<CppointRecordVO> getCppointRecords() {
		return cppointRecords;
	}

	public void setCppointRecords(List<CppointRecordVO> cppointRecords) {
		this.cppointRecords = cppointRecords;
	}

}
