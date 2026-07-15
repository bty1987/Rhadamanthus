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
import com.fanglin.personel.service.RecruitmentEducationService;
import com.fanglin.personel.vo.RecruitmentEducationVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RecruitmentEducationAction extends BaseListAction {

	private static final long serialVersionUID = 5763046104948303775L;

	@Autowired
	private RecruitmentEducationService recruitmentEducationService;

	private List<RecruitmentEducationVO> recruitmentEducations;

	private RecruitmentEducationVO recruitmentEducation;

	@Action(value = "queryRecruitmentEducation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRecruitmentEducation() {

		recruitmentEducations = recruitmentEducationService.queryRecruitmentEducation(recruitmentEducation);

		return SUCCESS;
	}

	@Action(value = "addRecruitmentEducation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRecruitmentEducation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		recruitmentEducationService.addRecruitmentEducation(recruitmentEducation);

		return SUCCESS;
	}

	@Action(value = "updateRecruitmentEducation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRecruitmentEducation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		recruitmentEducationService.updateRecruitmentEducation(recruitmentEducation);

		return SUCCESS;
	}

	@Action(value = "deleteRecruitmentEducation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteRecruitmentEducation() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		recruitmentEducationService.deleteRecruitmentEducation(recruitmentEducation);

		return SUCCESS;
	}

	public List<RecruitmentEducationVO> getRecruitmentEducations() {
		return recruitmentEducations;
	}

	public void setRecruitmentEducations(List<RecruitmentEducationVO> recruitmentEducations) {
		this.recruitmentEducations = recruitmentEducations;
	}

	public RecruitmentEducationVO getRecruitmentEducation() {
		return recruitmentEducation;
	}

	public void setRecruitmentEducation(RecruitmentEducationVO recruitmentEducation) {
		this.recruitmentEducation = recruitmentEducation;
	}
}
