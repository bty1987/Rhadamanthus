/**
 * @File Name		: QuotationAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.ProtationService;
import com.fanglin.quotation.vo.ProtationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProtationAction extends BaseListAction {

	private static final long serialVersionUID = -2809177074896626413L;

	@Autowired
	private ProtationService protationService;

	private ProtationVO protation;

	private List<ProtationVO> protations;

	@Action(value = "queryProtationByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProtationByOrderId() {

		protations = protationService.queryProtationByOrderId(protation);

		return SUCCESS;
	}

	@Action(value = "queryProtationForDefaultByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProtationForDefaultByOrderId() {

		protation = protationService.queryProtationForDefaultByOrderId(protation);
		return SUCCESS;
	}

	@Action(value = "queryProtationByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProtationByPid() {

		protation = protationService.queryProtationByPid(protation);

		return SUCCESS;
	}

	@Action(value = "addProtation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProtation() throws FLException {

		protationService.addProtation(protation, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateProtation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProtation() throws FLException {

		protationService.updateProtation(protation);

		return SUCCESS;
	}

	@Action(value = "updateProtationForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProtationForAdvance() throws FLException {

		protationService.updateProtationForAdvance(protation);

		return SUCCESS;
	}

	@Action(value = "updateProtationForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateProtationForStatus() throws FLException {

		protationService.updateProtationForStatus(protation);

		return SUCCESS;
	}

	@Action(value = "changeProtationForDefault", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeProtationForDefault() throws FLException {

		protationService.changeProtationForDefault(protation);

		return SUCCESS;
	}

	@Action(value = "deleteProtation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteProtation() throws FLException {

		protationService.deleteProtation(protation);

		return SUCCESS;
	}
	
	@Action(value = "lockProtation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String lockProtation() throws FLException {

		protationService.lockProtation(protation);

		return SUCCESS;
	}
	
	@Action(value = "unlockProtation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unlockProtation() throws FLException {

		protationService.unlockProtation(protation);

		return SUCCESS;
	}

	public ProtationVO getProtation() {
		return protation;
	}

	public void setProtation(ProtationVO protation) {
		this.protation = protation;
	}

	public List<ProtationVO> getProtations() {
		return protations;
	}

	public void setProtations(List<ProtationVO> protations) {
		this.protations = protations;
	}

}
