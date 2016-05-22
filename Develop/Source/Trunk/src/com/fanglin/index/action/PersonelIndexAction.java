/**
 * @File Name		: PersonelIndexAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2015-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.index.action;

import java.io.UnsupportedEncodingException;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PersonelIndexAction extends BaseListAction {
	
	private static final long serialVersionUID = -7877696974727218298L;

	@Action(value = "userIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/personnel/user.html") })
	public String userIndex(){
		return SUCCESS;
	}
	
	@Action(value = "userContractIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/personnel/userContract.html") })
	public String userContractIndex(){
		return SUCCESS;
	}
	
	@Action(value = "userExperienceIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/personnel/userExperience.html") })
	public String userExperienceIndex() throws UnsupportedEncodingException {
		return SUCCESS;
	}
	
	@Action(value = "userSalaryIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/finance/userSalary.html") })
	public String userSalaryIndex(){
		return SUCCESS;
	}

}
