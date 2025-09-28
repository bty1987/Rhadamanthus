package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalancePictureService;
import com.fanglin.balance.vo.BalancePictureVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalancePictureAction extends BaseListAction {

	private static final long serialVersionUID = -3165398551277430051L;

	@Autowired
	private BalancePictureService balancePictureService;

	private BalancePictureVO balancePicture;

	private List<BalancePictureVO> balancePictures;

	@Action(value = "queryBalancePicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalancePicture() throws FLException {

		balancePictures = balancePictureService.queryBalancePicture(balancePicture);

		return SUCCESS;
	}

	@Action(value = "addBalancePicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBalancePicture() throws FLException {

		balancePictureService.addBalancePicture(balancePicture, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteBalancePicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBalancePicture() throws FLException {

		balancePictureService.deleteBalancePicture(balancePicture);

		return SUCCESS;
	}

	public BalancePictureVO getBalancePicture() {
		return balancePicture;
	}

	public void setBalancePicture(BalancePictureVO balancePicture) {
		this.balancePicture = balancePicture;
	}

	public List<BalancePictureVO> getBalancePictures() {
		return balancePictures;
	}

	public void setBalancePictures(List<BalancePictureVO> balancePictures) {
		this.balancePictures = balancePictures;
	}

}
