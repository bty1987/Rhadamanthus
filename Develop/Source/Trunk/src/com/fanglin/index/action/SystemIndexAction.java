/**
 * @File Name		: SystemIndexAction.java
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
public class SystemIndexAction extends BaseListAction{

	private static final long serialVersionUID = 2208446706322809492L;
	
	@Action(value = "cityIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/system/city.html") })
	public String cityIndex(){
		return SUCCESS;
	}
	
	@Action(value = "cityProperIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/system/cityProper.html") })
	public String cityProperIndex(){
		return SUCCESS;
	}
	
	@Action(value = "regionIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/system/region.html") })
	public String regionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "roleIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/system/role.html") })
	public String roleIndex(){
		return SUCCESS;
	}
	
	@Action(value = "roleActionIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/system/roleRight.html") })
	public String roleActionIndex() throws UnsupportedEncodingException {
		return SUCCESS;
	}
	
	@Action(value = "subFunctionActionIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/system/subFunctionAction.html") })
	public String subFunctionActionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "userApproveIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/approval/userApprove.html") })
	public String userApproveIndex(){
		return SUCCESS;
	}
	
	@Action(value = "userProfile", results = { @Result(name = "success", type = "dispatcher", location = "/views/system/userProfile.html") })
	public String userProfile(){
		return SUCCESS;
	}

	@Action(value = "changePasswordIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/system/changePassword.html") })
	public String changePasswordIndex(){
		return SUCCESS;
	}

	@Action(value = "resetPasswordIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/system/resetPassword.html") })
	public String resetPasswordIndex(){
		return SUCCESS;
	}
	
	@Action(value="approvalTrackIndex", results={@Result(name="success", type="dispatcher", location="/views/approval/approvalTrack.html")})
	public String approvalTrackIndex(){
		return SUCCESS;
	}
	
	@Action(value="versionIndex", results={@Result(name="success", type="dispatcher", location="/version.html")})
	public String versionIndex(){
		return SUCCESS;
	}
	
}