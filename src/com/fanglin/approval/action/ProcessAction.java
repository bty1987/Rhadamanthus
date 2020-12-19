package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ProcessService;
import com.fanglin.approval.vo.ProcessItemVO;
import com.fanglin.approval.vo.ProcessVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProcessAction extends BaseListAction {

	private static final long serialVersionUID = -8817172347438908947L;

	@Autowired
	private ProcessService processService;
	
	private List<ProcessVO> processes;

	private ProcessVO process;
	
	private List<ProcessItemVO> processItems;
	
	private ProcessItemVO processItem;

	@Action(value = "pageProcess", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageProcess() throws FLException {

		processService.pageProcess(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryProcess", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProcess() {

		processes = processService.queryProcess();

		return SUCCESS;
	}
	
	@Action(value = "queryProcessByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProcessByPid() {
		
		process = processService.queryProcessByPid(process);
		
		return SUCCESS;
	}
	
	@Action(value = "queryProcessItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProcessItem() {
		
		processItems = processService.queryProcessItem(process);
		
		return SUCCESS;
	}

	@Action(value = "addProcess", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProcess() throws FLException {

		processService.addProcess(process, processItems, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateProcess", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProcess() throws FLException {

		processService.updateProcess(process, processItems);

		return SUCCESS;
	}

	@Action(value = "updateProcessForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProcessForStatus() throws FLException {

		processService.updateProcessForStatus(process);

		return SUCCESS;
	}
	
	@Action(value = "updateProcessItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProcessItem() {
		
		processService.updateProcessItem(processItem);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteProcess", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteProcess() throws FLException {
		
		processService.deleteProcess(process);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteProcessItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteProcessItem() throws FLException {
		
		processService.deleteProcessItem(processItem);
		
		return SUCCESS;
	}

	public List<ProcessVO> getProcesses() {
		return processes;
	}

	public void setProcesses(List<ProcessVO> processes) {
		this.processes = processes;
	}

	public ProcessVO getProcess() {
		return process;
	}

	public void setProcess(ProcessVO process) {
		this.process = process;
	}

	public List<ProcessItemVO> getProcessItems() {
		return processItems;
	}

	public void setProcessItems(List<ProcessItemVO> processItems) {
		this.processItems = processItems;
	}

	public ProcessItemVO getProcessItem() {
		return processItem;
	}

	public void setProcessItem(ProcessItemVO processItem) {
		this.processItem = processItem;
	}

}
