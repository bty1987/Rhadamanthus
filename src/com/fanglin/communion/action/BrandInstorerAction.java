package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.BrandInstorerService;
import com.fanglin.communion.vo.BrandInstorerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandInstorerAction extends BaseListAction {

	private static final long serialVersionUID = -8333313354780774880L;

	@Autowired
	private BrandInstorerService brandInstorerService;

	private BrandInstorerVO brandInstorer;

	private List<BrandInstorerVO> brandInstorers;

	@Action(value = "queryBrandInstorer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandInstorer() throws FLException {

		brandInstorers = brandInstorerService.queryBrandInstorer(brandInstorer);

		return SUCCESS;
	}

	@Action(value = "addBrandInstorer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBrandInstorer() throws FLException {

		brandInstorerService.addBrandInstorer(brandInstorer);

		return SUCCESS;
	}

	@Action(value = "deleteBrandInstorer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBrandInstorer() throws FLException {

		brandInstorerService.deleteBrandInstorer(brandInstorer);

		return SUCCESS;
	}

	public BrandInstorerVO getBrandInstorer() {
		return brandInstorer;
	}

	public void setBrandInstorer(BrandInstorerVO brandInstorer) {
		this.brandInstorer = brandInstorer;
	}

	public List<BrandInstorerVO> getBrandInstorers() {
		return brandInstorers;
	}

	public void setBrandInstorers(List<BrandInstorerVO> brandInstorers) {
		this.brandInstorers = brandInstorers;
	}

}
