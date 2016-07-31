/**
 * @File Name		: WMCodeAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2016-6-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.WMCodeUtil;

@ParentPackage("login")
@Namespace("/")
@Controller
public class WMCodeAction extends BaseAction {

	private static final long serialVersionUID = 8870921012656189842L;
	
	private String watermark;

	@Action(value = "wmCode", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String wmCode() throws Exception {
		
		watermark = WMCodeUtil.createImage(getUserName(), DateUtil.current("yyyyMMdd"));
		
		return SUCCESS;
	}

	public String getWatermark() {
		return watermark;
	}

	public void setWatermark(String watermark) {
		this.watermark = watermark;
	}
	
	
}