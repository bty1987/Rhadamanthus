package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.AepairService;
import com.fanglin.customer.vo.AepairVO;
import com.fanglin.customer.vo.ConsultionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AepairAction extends BaseListAction {

	private static final long serialVersionUID = 955307519477721026L;

	@Autowired
	private AepairService aepairService;

	private AepairVO aepair;

	private List<AepairVO> aepairs;

	private ConsultionVO consultion;

	private String code;

	@Action(value = "pageAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAepair() throws FLException {

		aepairService.pageAepair(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAepair() throws FLException {

		aepairs = aepairService.queryAepair(aepair);

		return SUCCESS;
	}

	@Action(value = "queryAepairByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRepair() throws FLException {

		aepairs = aepairService.queryAepairByOrderId(aepair);

		return SUCCESS;
	}

	@Action(value = "addAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAepair() throws FLException {

		aepairService.addAepair(aepair, consultion, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAepair() throws FLException {

		aepairService.updateAepair(aepair, queryUserId());

		return SUCCESS;
	}

	@Action(value = "receiveAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String receiveAepair() throws FLException {

		aepairService.receiveAepair(aepair, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deliveAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deliveAepair() throws FLException {

		aepairService.deliveAepair(aepair, queryUserId());

		return SUCCESS;
	}

	@Action(value = "tranAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String tranAepair() throws FLException {

		aepairService.tranAepair(aepair, queryUserId());

		return SUCCESS;
	}

	@Action(value = "finishAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishAepair() throws FLException {

		aepairService.finishAepair(aepair, queryUserId());

		return SUCCESS;
	}

	@Action(value = "closeAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String closeAepair() throws FLException {

		aepairService.closeAepair(aepair, queryUserId());

		return SUCCESS;
	}

	@Action(value = "sendAepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendAepair() throws FLException {

		aepairService.sendAepair(code, aepair);

		return SUCCESS;
	}

	public AepairVO getAepair() {
		return aepair;
	}

	public void setAepair(AepairVO aepair) {
		this.aepair = aepair;
	}

	public List<AepairVO> getAepairs() {
		return aepairs;
	}

	public void setAepairs(List<AepairVO> aepairs) {
		this.aepairs = aepairs;
	}

	public ConsultionVO getConsultion() {
		return consultion;
	}

	public void setConsultion(ConsultionVO consultion) {
		this.consultion = consultion;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
