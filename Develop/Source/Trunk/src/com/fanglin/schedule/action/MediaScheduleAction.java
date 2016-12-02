/**
 * @File Name		: MediaScheduleAction.java
 * @Package   	: com.fanglin.schedule.action
 * @Version		: 1.0
 * @Date			: 2016-5-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.schedule.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.schedule.service.MediaScheduleService;

@ParentPackage("dingding")
@Namespace("/")
@Controller
public class MediaScheduleAction extends BaseListAction {

	private static final long serialVersionUID = -4770659186083356341L;
	
	@Autowired
	private MediaScheduleService mediaScheduleService;
	
	@Action(value = "viaSwitchMediaForDing", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String viaSwitchMediaForDing(){
		
		mediaScheduleService.switchMediaForDing();
		
		return SUCCESS;
	}
	
}
