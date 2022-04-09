/**
 * Title: UserContractAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

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
import com.fanglin.personel.service.RecruitmentOperationService;
import com.fanglin.personel.vo.RecruitmentOperationVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("common")
@Namespace("/")
@Controller
public class RecruitmentOperationAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private RecruitmentOperationService recruitmentOperationService;

	private List<RecruitmentOperationVO> recruitmentOperations;

	private RecruitmentOperationVO recruitmentOperation;

	@Action(value = "queryRecruitmentOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRecruitmentOperation() {

		recruitmentOperations = recruitmentOperationService.queryRecruitmentOperation(recruitmentOperation);

		return SUCCESS;
	}

	@Action(value = "addRecruitmentOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRecruitmentOperation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		recruitmentOperationService.addRecruitmentOperation(recruitmentOperation);

		return SUCCESS;
	}

	@Action(value = "updateRecruitmentOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRecruitmentOperation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		recruitmentOperationService.updateRecruitmentOperation(recruitmentOperation);

		return SUCCESS;
	}

	@Action(value = "deleteRecruitmentOperation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteRecruitmentOperation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		recruitmentOperationService.deleteRecruitmentOperation(recruitmentOperation);

		return SUCCESS;
	}

	public List<RecruitmentOperationVO> getRecruitmentOperations() {
		return recruitmentOperations;
	}

	public void setRecruitmentOperations(List<RecruitmentOperationVO> recruitmentOperations) {
		this.recruitmentOperations = recruitmentOperations;
	}

	public RecruitmentOperationVO getRecruitmentOperation() {
		return recruitmentOperation;
	}

	public void setRecruitmentOperation(RecruitmentOperationVO recruitmentOperation) {
		this.recruitmentOperation = recruitmentOperation;
	}
}
