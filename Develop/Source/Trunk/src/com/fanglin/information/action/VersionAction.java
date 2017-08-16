package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.VersionService;
import com.fanglin.information.vo.VersionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VersionAction extends BaseListAction{

	private static final long serialVersionUID = -6929762321931073057L;
	
	@Autowired
	private VersionService versionService;
	
	private List<VersionVO> versions;
	
	private VersionVO version;
	
	@Action(value = "pageVersion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageVersion(){
		
		versionService.pageVersion(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryVersion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryVersion(){
		
		versions = versionService.queryVersion(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "addVersion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addVersion() throws FLException{
		
		versionService.addVersion(version);
		
		return SUCCESS;
	}
	
	@Action(value = "updateVersion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVersion() throws FLException{
		
		versionService.updateVersion(version);
		
		return SUCCESS;
	}
	
	@Action(value = "updateVersionForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateVersionForStatus() throws FLException{
		
		versionService.updateVersionForStatus(version);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteVersion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteVersion() throws FLException{
		
		versionService.deleteVersion(version);
		
		return SUCCESS;
	}

	public List<VersionVO> getVersions() {
		return versions;
	}

	public void setVersions(List<VersionVO> versions) {
		this.versions = versions;
	}

	public VersionVO getVersion() {
		return version;
	}

	public void setVersion(VersionVO version) {
		this.version = version;
	}

}
