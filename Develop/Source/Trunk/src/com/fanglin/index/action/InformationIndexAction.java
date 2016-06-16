/**
 * @File Name		: InformationIndexAction.java
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
public class InformationIndexAction extends BaseListAction {

	private static final long serialVersionUID = 6050013452965722433L;
	
	@Action(value="decorationActivityIndex", results={@Result(name="success", type="dispatcher", location="/views/information/decorationActivityMng.html")})
	public String decorationActivityIndex(){
		return SUCCESS;
	}
	
	@Action(value="messageIndex", results={@Result(name="success", type="dispatcher", location="/views/information/messageMng.html")})
	public String messageIndex(){
		return SUCCESS;
	}
	
	@Action(value="moreNoticesIndex", results={@Result(name="success", type="dispatcher", location="/views/information/moreNotices.html")})
	public String moreNoticesIndex(){
		return SUCCESS;
	}
	
	@Action(value="noticeIndex", results={@Result(name="success", type="dispatcher", location="/views/information/noticeMng.html")})
	public String noticeIndex(){
		return SUCCESS;
	}
	
}
