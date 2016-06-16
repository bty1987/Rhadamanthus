/**
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
import com.fanglin.system.service.SubFunctionService;
import com.fanglin.system.vo.SubFunctionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SubFunctionAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;
	
	@Autowired
	private SubFunctionService subFunctionService;

	private SubFunctionVO subFunction;
	
	private List<SubFunctionVO> subFunctionList;

	@Action(value = "querySubFunctionByFunctionId", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String querySubFunctionByFunctionId(){
		
		subFunctionList = subFunctionService.querySubFunctionByFunctionId(subFunction);
		
		return SUCCESS;
	}
	
	@Action(value = "querySubFunctionLikeName", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String querySubFunctionLikeName(){
		
		subFunctionList = subFunctionService.querySubFunctionLikeName(subFunction);
		
		return SUCCESS;
	}
	
	public SubFunctionVO getSubFunction(){
		return subFunction;
	}

	public void setSubFunction(SubFunctionVO subFunction){
		this.subFunction = subFunction;
	}

	public List<SubFunctionVO> getSubFunctionList(){
		return subFunctionList;
	}

	public void setSubFunctionList(List<SubFunctionVO> subFunctionList){
		this.subFunctionList = subFunctionList;
	}

}
