package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.BrandServerService;
import com.fanglin.data.common.vo.BrandServerVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandServerAction extends BaseListAction {

	private static final long serialVersionUID = -1211888197211569300L;

	@Autowired
	private BrandServerService brandServerService;

	private List<BrandServerVO> brandServers;

	private BrandServerVO brandServer;

	@Action(value = "queryBrandServer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandServer() throws FLException {

		brandServers = brandServerService.queryBrandServer(brandServer);

		return SUCCESS;
	}

	@Action(value = "addBrandServer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBrandServer() throws FLException {

		brandServerService.addBrandServer(brandServer);

		return SUCCESS;
	}

	@Action(value = "updateBrandServer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBrandServer() throws FLException {

		brandServerService.updateBrandServer(brandServer);

		return SUCCESS;
	}

	@Action(value = "deleteBrandServer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBrandServer() throws FLException {

		brandServerService.deleteBrandServer(brandServer);

		return SUCCESS;
	}

	public List<BrandServerVO> getBrandServers() {
		return brandServers;
	}

	public void setBrandServers(List<BrandServerVO> brandServers) {
		this.brandServers = brandServers;
	}

	public BrandServerVO getBrandServer() {
		return brandServer;
	}

	public void setBrandServer(BrandServerVO brandServer) {
		this.brandServer = brandServer;
	}

}
