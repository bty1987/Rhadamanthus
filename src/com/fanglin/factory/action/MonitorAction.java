/**
 * @File Name		: MonitorAction.java
 * @Package   	: com.fanglin.monitor.action
 * @Version		: 1.0
 * @Date			: 2017-9-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.factory.service.MonitorService;
import com.fanglin.factory.vo.MonitorVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class MonitorAction extends BaseAction {

	private static final long serialVersionUID = 4668506974851514698L;
	
	@Autowired
	private MonitorService monitorService;
	
	private List<MonitorVO> monitors;
	
	private MonitorVO monitor;
	
	@Action(value = "queryMonitor", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String queryMonitor(){
		
		monitors = monitorService.queryMonitor();
		
		return SUCCESS;
	}
	
	@Action(value = "updateMonitor", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String updateMonitor(){
		
		monitorService.updateMonitor(monitor);
		
		return SUCCESS;
	}

	public List<MonitorVO> getMonitors() {
		return monitors;
	}

	public void setMonitors(List<MonitorVO> monitors) {
		this.monitors = monitors;
	}

	public MonitorVO getMonitor() {
		return monitor;
	}

	public void setMonitor(MonitorVO monitor) {
		this.monitor = monitor;
	}

}
