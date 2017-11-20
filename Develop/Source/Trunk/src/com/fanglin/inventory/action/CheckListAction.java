/**
 * @File Name		: CheckListAction.java
 * @Package   	: com.fanglin.inventory.action
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.CheckListService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CheckListAction extends BaseListAction{

	private static final long serialVersionUID = -3303439569720581197L;
	
	@Autowired
	private CheckListService checkListService;
	
	@Action(value = "pageCheckList", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCheckList() throws FLException {
		
		checkListService.pageCheckList(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}

}
