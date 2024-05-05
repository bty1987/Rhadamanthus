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
import com.fanglin.personel.service.RecruitmentService;
import com.fanglin.personel.vo.RecruitmentEducationVO;
import com.fanglin.personel.vo.RecruitmentOperationVO;
import com.fanglin.personel.vo.RecruitmentVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class RecruitmentAction extends BaseListAction {

	private static final long serialVersionUID = 5770397152301340601L;

	private RecruitmentVO recruitment;

	private List<RecruitmentEducationVO> recruitmentEducations;

	private List<RecruitmentOperationVO> recruitmentOperations;

	@Autowired
	private RecruitmentService recruitmentService;

	@Action(value = "pageRecruitment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageRecruitment() throws FLException {

		recruitmentService.pageRecruitment(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryRecruitmentByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRecruitmentByRid() throws FLException {

		recruitment = recruitmentService.queryRecruitmentByRid(recruitment);

		return SUCCESS;
	}

	@Action(value = "checkRecruitment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkRecruitment() throws FLException {

		recruitment = recruitmentService.checkRecruitment(recruitment);

		return SUCCESS;
	}

	@Action(value = "addRecruitment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRecruitment() throws FLException {

		recruitmentService.addRecruitment(recruitment, recruitmentEducations, recruitmentOperations);

		return SUCCESS;
	}

	@Action(value = "updateRecruitment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRecruitment() throws FLException {

		recruitmentService.updateRecruitment(recruitment);

		return SUCCESS;
	}

	@Action(value = "updateRecruitmentForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRecruitmentForAdvance() throws FLException {

		recruitmentService.updateRecruitmentForAdvance(recruitment);

		return SUCCESS;
	}

	@Action(value = "entryRecruitment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String entryRecruitment() throws FLException {

		recruitmentService.entryRecruitment(recruitment);

		return SUCCESS;
	}

	@Action(value = "cancelRecruitment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelRecruitment() throws FLException {

		recruitmentService.cancelRecruitment(recruitment);

		return SUCCESS;
	}

	public RecruitmentVO getRecruitment() {
		return recruitment;
	}

	public void setRecruitment(RecruitmentVO recruitment) {
		this.recruitment = recruitment;
	}

	public List<RecruitmentEducationVO> getRecruitmentEducations() {
		return recruitmentEducations;
	}

	public void setRecruitmentEducations(List<RecruitmentEducationVO> recruitmentEducations) {
		this.recruitmentEducations = recruitmentEducations;
	}

	public List<RecruitmentOperationVO> getRecruitmentOperations() {
		return recruitmentOperations;
	}

	public void setRecruitmentOperations(List<RecruitmentOperationVO> recruitmentOperations) {
		this.recruitmentOperations = recruitmentOperations;
	}
}
