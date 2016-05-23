/*
 * @File Name	: UserAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 用户管理相关action
 */

package com.fanglin.system.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.system.service.SubFunctionActionService;
import com.fanglin.system.vo.SubFunctionActionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SubFunctionActionAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;
	
	@Autowired
	private SubFunctionActionService subFunctionActionService;

	private SubFunctionActionVO subFunctionActions;
	
	private List<Integer> actionIds;

	@Action(value = "pageSubFunctionAction", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String pageSubFunctionAction(){
		
		subFunctionActionService.pageSubFunctionAction(getPaging(), getFilters());	
		
		return SUCCESS;
	}

	@Action(value = "querySubFunctionActionByName", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String querySubFunctionActionByName(){
		
		subFunctionActions = subFunctionActionService.querySubFunctionActionByName(subFunctionActions);
		
		return SUCCESS;
	}
	
	public SubFunctionActionVO getSubFunctionActions(){
		return subFunctionActions;
	}

	public void setSubFunctionActions(SubFunctionActionVO subFunctionActions){
		this.subFunctionActions = subFunctionActions;
	}

	public List<Integer> getActionIds(){
		return actionIds;
	}

	public void setActionIds(List<Integer> actionIds){
		this.actionIds = actionIds;
	}
	
}
