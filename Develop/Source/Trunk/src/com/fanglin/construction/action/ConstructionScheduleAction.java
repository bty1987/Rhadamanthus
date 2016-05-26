/**
 * @File Name		: ConstructionScheduleAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionScheduleAction extends BaseListAction{

	private static final long serialVersionUID = 3579553772365688946L;
	
	@Autowired
	private ConstructionScheduleService constructionScheduleService;
	
	private ConstructionScheduleVO constructionSchedule;
	
	public Map<String, List<ConstructionScheduleWorkerVO>> constructionScheduleWorkers;
	
	@Action(value = "pageDecorationOrderForConstructionSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForConstructionSchedule(){
		
		constructionScheduleService.pageDecorationOrderForConstructionSchedule(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForConstructionScheduleByPlace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForConstructionScheduleByPlace() throws FLException{
		
		constructionScheduleService.pageDecorationOrderForConstructionScheduleByPlace(getPaging(), getFilters(), getUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForSupervisionByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForSupervisionByUserId() throws FLException{
		
		constructionScheduleService.pageDecorationOrderForSupervisionByUserId(getPaging(), getFilters(), getUserId(), null);
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForQualityByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForQualityByUserId() throws FLException{
		
		constructionScheduleService.pageDecorationOrderForQualityByUserId(getPaging(), getFilters(), getUserId(), null);
		
		return SUCCESS;
	}
	
	@Action(value = "pageDecorationOrderForAcceptance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationOrderForAcceptance(){
		
		constructionScheduleService.pageDecorationOrderForAcceptance(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionScheduleByOrderId() throws FLException{
		
		constructionSchedule = constructionScheduleService.queryConstructionScheduleByOrderId(constructionSchedule, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryConstructionScheduleForWorkerNameByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionScheduleForWorkerNameByOrderId(){
		
		constructionSchedule = constructionScheduleService.queryConstructionScheduleForWorkerNameByOrderId(constructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "updateConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionScheduleByOrderId(){
		
		constructionScheduleService.saveOrUpdateConstructionScheduleByOrderId(constructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "nextConstructionScheduleByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String nextConstructionScheduleByOrderId() throws FLException{
		
		constructionScheduleService.nextConstructionScheduleByOrderId(constructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "checkConstructionScheduleForChanStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkConstructionScheduleForChanStatus() throws FLException{
		
		constructionScheduleService.checkConstructionScheduleForChanStatus(constructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "checkFirstPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkFirstPayment() throws FLException{
		
		constructionScheduleService.checkFirstPayment(constructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "checkSecondPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkSecondPayment() throws FLException{
		
		constructionScheduleService.checkSecondPayment(constructionSchedule);
		
		return SUCCESS;
	}
	
	@Action(value = "checkFinalyPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkFinalyPayment() throws FLException{
		
		constructionScheduleService.checkFinalyPayment(constructionSchedule, getUserId());
		
		return SUCCESS;
	}

	public ConstructionScheduleVO getConstructionSchedule(){
		return constructionSchedule;
	}

	public void setConstructionSchedule(ConstructionScheduleVO constructionSchedule){
		this.constructionSchedule = constructionSchedule;
	}

	public Map<String, List<ConstructionScheduleWorkerVO>> getConstructionScheduleWorkers() {
		return constructionScheduleWorkers;
	}

	public void setConstructionScheduleWorkers(
			Map<String, List<ConstructionScheduleWorkerVO>> constructionScheduleWorkers) {
		this.constructionScheduleWorkers = constructionScheduleWorkers;
	}

}
