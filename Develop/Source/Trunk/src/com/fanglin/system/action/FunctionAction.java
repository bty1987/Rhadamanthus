/**
 * @File Name	: UserAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
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
import com.fanglin.system.service.FunctionService;
import com.fanglin.system.vo.FunctionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FunctionAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;
	
	@Autowired
	private FunctionService functionService;

	private FunctionVO function;
	
	private List<FunctionVO> functionList;

	@Action(value = "queryFunctionByModuleId", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String queryFunctionByModuleId(){
		
		functionList = functionService.queryFunctionByModuleId(function);
		
		return SUCCESS;
	}

	public FunctionVO getFunction(){
		return function;
	}

	public void setFunction(FunctionVO function){
		this.function = function;
	}

	public List<FunctionVO> getFunctionList(){
		return functionList;
	}

	public void setFunctionList(List<FunctionVO> functionList){
		this.functionList = functionList;
	}

}
