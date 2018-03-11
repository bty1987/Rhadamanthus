package com.fanglin.system.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.service.SystemConfigService;
import com.fanglin.system.vo.SystemConfigVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SystemConfigAction extends BaseListAction {

	private static final long serialVersionUID = 8986443997879484379L;
	
	@Autowired
	private SystemConfigService systemConfigService;
	
	private SystemConfigVO systemConfig;
	
	private List<SystemConfigVO> systemConfigVOs;

	@Action(value = "pageSystemConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCityProper(){
		
		 systemConfigVOs = systemConfigService.pageSystemConfig(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "addSystemConfig", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCityProper() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		 systemConfigService.addSystemConfig(systemConfig,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "querySystemConfigByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySystemConfigByCid() throws FLException{
		
		systemConfigVOs = systemConfigService.querySystemConfigByCid(queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateSystemConfig", results = { @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateSystemConfig() throws FLException {
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
	    systemConfigService.updateSystemConfig(systemConfig);

	    return SUCCESS;
	  }

	public SystemConfigVO getSystemConfig() {
		return systemConfig;
	}

	public void setSystemConfig(SystemConfigVO systemConfig) {
		this.systemConfig = systemConfig;
	}

	public List<SystemConfigVO> getSystemConfigVOs() {
		return systemConfigVOs;
	}

	public void setSystemConfigVOs(List<SystemConfigVO> systemConfigVOs) {
		this.systemConfigVOs = systemConfigVOs;
	}

}
