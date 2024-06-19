/**
 * @File Name		: OperationAction.java
 * @Package   	: com.fanglin.system.action
 * @Version		: 1.0
 * @Date			: 2016-4-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

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
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.service.OperationService;
import com.fanglin.system.vo.OperationVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OperationAction extends BaseListAction {

	private static final long serialVersionUID = 4693120315577831019L;

	@Autowired
	private OperationService operationService;

	private List<OperationVO> operations;

	private List<Integer> oids;

	private UserVO user;

	private OperationVO operation;

	private RoleVO role;

	@Action(value = "pageOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String pageOperation() {

		operationService.pageOperation(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String queryOperation() {

		operations = operationService.queryOperation(operation);

		return SUCCESS;
	}

	@Action(value = "queryOperationForLogin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String queryOperationForLogin() throws FLException {

		operations = operationService.queryOperationByUserId(operation, new UserVO(queryUserId()), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryOperationByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String queryOperationByUserId() throws FLException {

		operations = operationService.queryOperationByUserId(operation, user, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryOperationByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String queryOperationByRid() throws FLException {

		operations = operationService.queryOperationByRid(operation, role, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryOperationForSelf", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String queryOperationForSelf() throws FLException {

		operations = operationService.queryOperationForSelf(queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String addOperation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		operationService.addOperation(operation);

		return SUCCESS;
	}

	@Action(value = "updateOpperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOpperation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		operationService.updateOpperation(operation);

		return SUCCESS;
	}

	@Action(value = "updateRoleOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String updateRoleOperation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		operationService.updateRoleOperation(role, operation, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateRoleOperationByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String updateRoleOperationByRid() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		operationService.updateRoleOperationByRid(oids, role, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateRoleOperationByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String updateRoleOperationByUserId() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		operationService.updateRoleOperationByUserId(oids, user, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String deleteOperation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		operationService.deleteOperation(operation, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteRoleOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String deleteRoleOperation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		operationService.deleteRoleOperation(role, operation, queryCompany());

		return SUCCESS;
	}

	public List<OperationVO> getOperations() {
		return operations;
	}

	public void setOperations(List<OperationVO> operations) {
		this.operations = operations;
	}

	public List<Integer> getOids() {
		return oids;
	}

	public void setOids(List<Integer> oids) {
		this.oids = oids;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public OperationVO getOperation() {
		return operation;
	}

	public void setOperation(OperationVO operation) {
		this.operation = operation;
	}

	public RoleVO getRole() {
		return role;
	}

	public void setRole(RoleVO role) {
		this.role = role;
	}

}