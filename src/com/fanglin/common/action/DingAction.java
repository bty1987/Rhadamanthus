/**
 * @File Name	: LoginAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 登陆相关action
 */

package com.fanglin.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("login")
@Namespace("/")
@Controller
public class DingAction extends BaseListAction {
	
	private static final long serialVersionUID = 7985653006549768692L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Action(value = "requestDDConfig", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String requestDDConfig() throws FLException{

		
		return SUCCESS;
	}


}
