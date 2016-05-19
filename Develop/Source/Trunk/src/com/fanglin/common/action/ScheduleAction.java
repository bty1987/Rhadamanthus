/**
 * @File Name		: ReprotAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-12-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.BackVisitService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ScheduleAction extends BaseListAction{
	
	private static final long serialVersionUID = -3963941259393741504L;
	
	private Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private BackVisitService backVisitService;
	
	@Action(value = "dayReportSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String dayReportSchedule() throws FLException{
		
		// 0 1 * * * curl http://192.168.1.63/dayReportSchedule.do
		log.info("---------Daily Report Schedule----------");
		
//		Date date = new Date();
//		Date beforeDay = new Date(date.getTime() - 24*60*60*1000);
		
		backVisitService.remindBackVisitForDesigner();
		
		return SUCCESS;
	}
	
	@Action(value = "monthReportSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String monthReportSchedule(){
		
		// 10 1 1 */1 * curl http://192.168.1.63/monthReportSchedule.do
		log.info("---------Month Report Schedule----------");
		
//		Date date = new Date();
//		Date beforeDay = new Date(date.getTime() - 24*60*60*1000);
		
		return SUCCESS;
	}
	
	@Action(value = "quarterReportSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String quarterReportSchedule(){
		
		// 20 1 1 3,6,9,12 * curl http://192.168.1.63/quarterReportSchedule.do
		log.info("---------Quarter Report Schedule----------");
		
//		Date date = new Date();
//		Date beforeDay = new Date(date.getTime() - 24*60*60*1000);
		
		return SUCCESS;
	}
	
	@Action(value = "halfyearReportSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String halfyearReportSchedule(){
		
		// 30 1 1 1,7 * curl http://192.168.1.63/halfyearReportSchedule.do
		log.info("---------Half Year Report Schedule----------");
		
//		Date date = new Date();
//		Date beforeDay = new Date(date.getTime() - 24*60*60*1000);
		
		return SUCCESS;
	}
	
	@Action(value = "yearReportSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String yearReportSchedule(){
		
		// 40 1 1 1 * curl http://192.168.1.63/yearReportSchedule.do
		log.info("---------Year Report Schedule----------");
		
//		Date date = new Date();
//		Date beforeDay = new Date(date.getTime() - 24*60*60*1000);
		
		return SUCCESS;
	}
	
}
