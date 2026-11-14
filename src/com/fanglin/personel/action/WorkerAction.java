package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.WorkerService;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkerAction extends BaseListAction {

	private static final long serialVersionUID = 4903124049746001830L;

	@Autowired
	private WorkerService workerService;

	private List<UserVO> workers;

	private UserVO worker;

	@Action(value = "pageWorker", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageWorker() throws FLException {

		workerService.pageWorker(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addWorker", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWorker() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		workerService.addWorker(worker, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateWorker", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorker() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		workerService.updateWorker(worker);

		return SUCCESS;
	}

	public UserVO getWorker() {
		return worker;
	}

	public void setWorker(UserVO worker) {
		this.worker = worker;
	}

	public List<UserVO> getWorkers() {
		return workers;
	}

	public void setWorkers(List<UserVO> workers) {
		this.workers = workers;
	}

}
