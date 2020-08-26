package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.DutmentService;
import com.fanglin.personel.vo.DutmentVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DutmentAction extends BaseListAction {

	private static final long serialVersionUID = 4181987021784136821L;

	@Autowired
	private DutmentService dutmentService;
	
	private List<DutmentVO> dutments;
	
	private DutmentVO dutment;

	@Action(value = "queryDutmentByDeid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDutmentByDeid() throws FLException {
		
		dutments = dutmentService.queryDutmentByDeid(dutment, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "queryDutmentByDuid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDutmentByDuid() throws FLException {
		
		dutments = dutmentService.queryDutmentByDuid(dutment, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "addDutment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDutment() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		dutmentService.addDutment(dutment, queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "updateDutment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDutment() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		dutmentService.updateDutment(dutment);

		return SUCCESS;
	}
	
	@Action(value = "deleteDutment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDutment() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}
		
		dutmentService.deleteDutment(dutment);

		return SUCCESS;
	}
	
	@Action(value = "queryDutmentByDid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDutmentByDid() throws FLException {

		dutment = dutmentService.queryDutmentByDid(dutment);

		return SUCCESS;
	}

	public List<DutmentVO> getDutments() {
		return dutments;
	}

	public void setDutments(List<DutmentVO> dutments) {
		this.dutments = dutments;
	}

	public DutmentVO getDutment() {
		return dutment;
	}

	public void setDutment(DutmentVO dutment) {
		this.dutment = dutment;
	}

	



}
