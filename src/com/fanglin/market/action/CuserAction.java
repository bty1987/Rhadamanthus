package com.fanglin.market.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.CuserService;
import com.fanglin.market.vo.CuserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CuserAction extends BaseListAction {

	private static final long serialVersionUID = 2775369665896294411L;

	@Autowired
	private CuserService cuserService;

	private CuserVO cuser;

	@Action(value = "queryCuserByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCuserByUnionId() throws FLException {

		cuser = cuserService.queryCuserByUnionId(cuser);

		return SUCCESS;
	}

	@Action(value = "addCuser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCuser() throws FLException {

		cuserService.addCuser(cuser);

		return SUCCESS;
	}

	public CuserVO getCuser() {
		return cuser;
	}

	public void setCuser(CuserVO cuser) {
		this.cuser = cuser;
	}

}
