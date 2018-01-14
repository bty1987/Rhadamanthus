/**
 * @File Name		: SubjectBalanceUpinfoAction.java
 * @Package   	: com.fanglin.finance.action
 * @Version		: 1.0
 * @Date			: 2016-4-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.service.SubjectBalanceUpinfoService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SubjectBalanceUpinfoAction extends BaseListAction {

	private static final long serialVersionUID = 7341898017276413535L;
	
	@Autowired
	private SubjectBalanceUpinfoService subjectBalanceUpinfoService;
	
	@Action(value = "handleSubjectBalanceUpinfo", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String handleSubjectBalanceUpinfo() throws FLException{
		
		subjectBalanceUpinfoService.handleSubjectBalanceUpinfoForInit();
		
		return SUCCESS;
	}
	
}
