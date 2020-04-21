package com.fanglin.construction.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructionInfoService;
import com.fanglin.construction.vo.ConstructionInfoVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;


@ParentPackage("common")
@Namespace("/")
@Controller("ConstructionCommonAction")
public class ConstructionCommonAction extends BaseListAction{

	private static final long serialVersionUID = 2260215313530479171L;

	@Autowired
	private ConstructionInfoService constructionInfoService;

	private ConstructionInfoVO constructionInfo;
	
	@Action(value = "confirmConstructionInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmConstructionInfo() throws FLException {

		constructionInfoService.confirmConstructionInfo(constructionInfo);

		return SUCCESS;
	}

	public ConstructionInfoVO getConstructionInfo() {
		return constructionInfo;
	}

	public void setConstructionInfo(ConstructionInfoVO constructionInfo) {
		this.constructionInfo = constructionInfo;
	}
	
	
}
