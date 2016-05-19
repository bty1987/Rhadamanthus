/**
 * @File Name		: ManagementAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2015-3-20
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
public class ManagementIndexAction extends BaseListAction{

	private static final long serialVersionUID = 8752073283954319341L;
	
	@Action(value="managementIndex", results={@Result(name="success", type="dispatcher", location="/views/management/management.html")})
	public String managementIndex(){
		return SUCCESS;
	}
	
}
