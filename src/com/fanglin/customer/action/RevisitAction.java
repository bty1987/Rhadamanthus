package com.fanglin.customer.action;

import java.io.Serializable;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;


import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.RevisitService;
import com.fanglin.customer.vo.RevisitVO;
@ParentPackage("base")
@Namespace("/")
@Controller
public class RevisitAction extends BaseListAction implements Serializable {
	
	private static final long serialVersionUID = 186880858640658693L;
	
	@Autowired
	private RevisitService revisitService;
	
	private RevisitVO revisit;
	
	private List<RevisitVO> revisits;
	
	//分页
	@Action(value = "pageRevisit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageRevisit() throws FLException {
		
		revisitService.pageRevisit(getPaging(),getFilters());
		return SUCCESS;
	}
	
	//通过装修单号获取回访信息
	@Action(value = "queryRevisitByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRevisitByOrderId() throws FLException {
		revisits = revisitService.queryRevisitByOrderId(revisit);
		return SUCCESS;
		
	}
	//获取报修类型回访信息
	@Action(value = "queryRevisitForAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRevisitForAepair() throws FLException {
		revisits = revisitService.queryRevisitForAepair(revisit);
		return SUCCESS;
		
	}
	//获取投诉类型回访信息
	@Action(value = "queryRevisitForComplain", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRevisitForComplain() throws FLException {
		revisits = revisitService.queryRevisitForComplain(revisit);
		return SUCCESS;
	}
	
	//回访
	@Action(value = "visitRevisit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String visitRevisit() throws FLException {
		revisitService.visitRevisit(revisit,queryUserId());
		return SUCCESS;
	}
	public RevisitService getRevisitService() {
		return revisitService;
	}

	public void setRevisitService(RevisitService revisitService) {
		this.revisitService = revisitService;
	}
	public List<RevisitVO> getRevisits() {
		return revisits;
	}

	public void setRevisits(List<RevisitVO> revisits) {
		this.revisits = revisits;
	}
	public RevisitVO getRevisit() {
		return revisit;
	}

	public void setRevisit(RevisitVO revisit) {
		this.revisit = revisit;
	}

}
