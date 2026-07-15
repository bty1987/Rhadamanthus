package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.service.DecorationContractService;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationCommonAction extends BaseListAction {

	private static final long serialVersionUID = 1619707140383979773L;

	@Autowired
	private DecorationAdditionService decorationAdditionService;

	@Autowired
	private DecorationContractService decorationContractService;

	private DecorationVO decoration;

	private List<DecorationContractVO> decorationContracts;

	private DecorationContractVO decorationContract;

	private short result;

	private String redirect;

	@Action(value = "queryDecorationSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationProcess() throws FLException {

		result = decorationAdditionService.queryDecorationSchedule(decoration);

		return SUCCESS;
	}

	@Action(value = "queryDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationContract() throws FLException {

		decorationContracts = decorationContractService.queryDecorationContractByOrderId(decorationContract);

		return SUCCESS;
	}

	@Action(value = "redirectDecorationContract", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String redirectDecorationContract() throws FLException {

		redirect = decorationContractService.redirectDecorationContract(decorationContract);

		return SUCCESS;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public List<DecorationContractVO> getDecorationContracts() {
		return decorationContracts;
	}

	public void setDecorationContracts(List<DecorationContractVO> decorationContracts) {
		this.decorationContracts = decorationContracts;
	}

	public DecorationContractVO getDecorationContract() {
		return decorationContract;
	}

	public void setDecorationContract(DecorationContractVO decorationContract) {
		this.decorationContract = decorationContract;
	}

	public short getResult() {
		return result;
	}

	public void setResult(short result) {
		this.result = result;
	}

	public String getRedirect() {
		return redirect;
	}

	public void setRedirect(String redirect) {
		this.redirect = redirect;
	}

}
