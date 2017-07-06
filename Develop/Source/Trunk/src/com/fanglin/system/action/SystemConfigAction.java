package com.fanglin.system.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.system.service.SystemConfigService;
import com.fanglin.system.vo.SystemConfigVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SystemConfigAction extends BaseListAction {

	private static final long serialVersionUID = 8986443997879484379L;
	
	@Autowired
	private SystemConfigService systemConfigService;
	
	private SystemConfigVO systemConfigVO;
	
	private List<SystemConfigVO> systemConfigVOs;

	@Action(value = "pageSystemConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCityProper(){
		
		 systemConfigVOs = systemConfigService.pageSystemConfig(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	public SystemConfigVO getSystemConfigVO() {
		return systemConfigVO;
	}

	public void setSystemConfigVO(SystemConfigVO systemConfigVO) {
		this.systemConfigVO = systemConfigVO;
	}

	public List<SystemConfigVO> getSystemConfigVOs() {
		return systemConfigVOs;
	}

	public void setSystemConfigVOs(List<SystemConfigVO> systemConfigVOs) {
		this.systemConfigVOs = systemConfigVOs;
	}

}
