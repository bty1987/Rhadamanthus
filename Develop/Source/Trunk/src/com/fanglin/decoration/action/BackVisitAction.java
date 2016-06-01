/**
 * @File Name		: BackVisitAction
 * @Package   	: com.fanglin.action.backVisit
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.BackVisitService;
import com.fanglin.decoration.vo.BackVisitVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BackVisitAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;
	
	@Autowired
	private BackVisitService backVisitService;

	private BackVisitVO backVisit;
	
	private List<BackVisitVO> backVisits;

	@Action(value = "pageBackVisitByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBackVisitByOrderId(){

		backVisitService.pageBackVisitByOrderId(getPaging(), getFilters(), backVisit);
	    
		return SUCCESS;
	}
	
	@Action(value = "queryBackVisitByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBackVisitByOrderId(){
		
		backVisits = backVisitService.queryBackVisitByOrderId(backVisit);
		
		return SUCCESS;
	}
	
	@Action(value = "addBackVisit", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBackVisit() throws FLException{

		backVisitService.addBackVisit(backVisit, getUserId());

		return SUCCESS;
	}

	@Action(value = "deleteBackVisitById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBackVisitById(){

		backVisitService.deleteBackVisitById(backVisit);
	    
		return SUCCESS;
	}
	
	public BackVisitVO getBackVisit(){
		return backVisit;
	}

	public void setBackVisit(BackVisitVO backVisit){
		this.backVisit = backVisit;
	}

	public void setBackVisits(List<BackVisitVO> backVisits){
		this.backVisits = backVisits;
	}

	public List<BackVisitVO> getBackVisits(){
		return backVisits;
	}
	
}
