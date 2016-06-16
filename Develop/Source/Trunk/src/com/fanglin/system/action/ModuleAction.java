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

import java.util.Collections;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.system.service.ModuleService;
import com.fanglin.system.vo.ModuleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ModuleAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	private ModuleVO module;
	
	@SuppressWarnings("unchecked")
	private List<ModuleVO> moduleList = Collections.EMPTY_LIST;

	@Autowired
	private ModuleService moduleService;
	
	@Action(value = "queryModule", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String queryModule(){
		
		moduleList = moduleService.queryModule();
		
		return SUCCESS;
	}

	public ModuleVO getModule(){
		return module;
	}

	public void setModule(ModuleVO module){
		this.module = module;
	}

	public List<ModuleVO> getModuleList(){
		return moduleList;
	}

	public void setModuleList(List<ModuleVO> moduleList){
		this.moduleList = moduleList;
	}

}
