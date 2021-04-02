/**
 * @File Name		: SecretAction.java
 * @Package   	: com.fanglin.system.action
 * @Version		: 1.0
 * @Date			: 2017-8-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.factory.service.SecretService;

@ParentPackage("common")
@Namespace("/")
@Controller
public class SecretAction extends BaseListAction {

	private static final long serialVersionUID = -6224539280975146026L;
	
	@Autowired
	private SecretService viequppl;
	
	private List<String> authentications;
	
	//Action(value = "OXCKSFRD", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String OXCKSFRD(){
		
		authentications = viequppl.OXCKSFRD();
		
		return SUCCESS;
	}
	
	//Action(value = "HASIPHXW", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String HASIPHXW() throws FLException{
		
		String cmd = "sh /home/fanglin/bin/upfiner";
		
		Runtime run = Runtime.getRuntime();
		
		try {
			run.exec(cmd);
		} catch (Exception e) {
			setErrorCode(110000);
			setErrorMsg("系统处理问题");
		}
		
		return SUCCESS;
	}

	public List<String> getAuthentications() {
		return authentications;
	}

	public void setAuthentications(List<String> authentications) {
		this.authentications = authentications;
	}

}
