/**
 * @File Name		: DataIndexAction.java
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
public class DataIndexAction extends BaseListAction {

	private static final long serialVersionUID = -8088966732669481623L;
	
	@Action(value = "customerIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/data/customer.html") })
	public String customerIndex(){
		return SUCCESS;
	}
	
	@Action(value = "villageIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/data/village.html")})
	public String villageIndex(){
		return SUCCESS;
	}

}
