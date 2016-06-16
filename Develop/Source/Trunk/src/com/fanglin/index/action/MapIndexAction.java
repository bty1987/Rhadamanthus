/**
 * @File Name		: MapIndexAction.java
 * @Package   	: com.fanglin.index.action
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
public class MapIndexAction extends BaseListAction {
	
	private static final long serialVersionUID = 7583349130094627170L;

	@Action(value = "mapIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/map/index.html") })
	public String mapIndex() throws Exception {
		return SUCCESS;
	}

}
