/**
 * @File Name		: LogIndexAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2015-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.index.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class LogIndexAction extends BaseListAction {

	private static final long serialVersionUID = -4099078353571872493L;
	
	@Action(value = "actionLogIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/log/actionLog.html") })
	public String actionLogIndex(){
		return SUCCESS;
	}
	
	@Action(value = "loginLogIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/log/loginLog.html") })
	public String userIndex(){
		return SUCCESS;
	}

}
