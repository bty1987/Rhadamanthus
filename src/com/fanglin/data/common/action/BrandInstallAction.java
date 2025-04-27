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
import com.fanglin.data.common.service.BrandInstallService;
import com.fanglin.data.common.vo.BrandInstallVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandInstallAction extends BaseListAction {

	private static final long serialVersionUID = 2875588624113780015L;

	@Autowired
	private BrandInstallService brandInstallService;

	private List<BrandInstallVO> brandInstalls;

	private BrandInstallVO brandInstall;

	@Action(value = "queryBrandInstall", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandInstall() throws FLException {

		brandInstalls = brandInstallService.queryBrandInstall(brandInstall);

		return SUCCESS;
	}

	@Action(value = "addBrandInstall", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBrandInstall() throws FLException {

		brandInstallService.addBrandInstall(brandInstall);

		return SUCCESS;
	}

	@Action(value = "updateBrandInstall", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBrandInstall() throws FLException {

		brandInstallService.updateBrandInstall(brandInstall);

		return SUCCESS;
	}

	@Action(value = "deleteBrandInstall", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBrandInstall() throws FLException {

		brandInstallService.deleteBrandInstall(brandInstall);

		return SUCCESS;
	}

	public List<BrandInstallVO> getBrandInstalls() {
		return brandInstalls;
	}

	public void setBrandInstalls(List<BrandInstallVO> brandInstalls) {
		this.brandInstalls = brandInstalls;
	}

	public BrandInstallVO getBrandInstall() {
		return brandInstall;
	}

	public void setBrandInstall(BrandInstallVO brandInstall) {
		this.brandInstall = brandInstall;
	}

}
