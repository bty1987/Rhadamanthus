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
import com.fanglin.data.common.service.BrandDeliverService;
import com.fanglin.data.common.vo.BrandDeliverVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandDeliverAction extends BaseListAction {

	private static final long serialVersionUID = -539815033465341608L;

	@Autowired
	private BrandDeliverService brandDeliverService;

	private List<BrandDeliverVO> brandDelivers;

	private BrandDeliverVO brandDeliver;

	@Action(value = "queryBrandDeliver", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandDeliver() throws FLException {

		brandDelivers = brandDeliverService.queryBrandDeliver(brandDeliver);

		return SUCCESS;
	}

	@Action(value = "addBrandDeliver", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBrandDeliver() throws FLException {

		brandDeliverService.addBrandDeliver(brandDeliver);

		return SUCCESS;
	}

	@Action(value = "updateBrandDeliver", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBrandDeliver() throws FLException {

		brandDeliverService.updateBrandDeliver(brandDeliver);

		return SUCCESS;
	}

	@Action(value = "deleteBrandDeliver", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBrandDeliver() throws FLException {

		brandDeliverService.deleteBrandDeliver(brandDeliver);

		return SUCCESS;
	}

	public List<BrandDeliverVO> getBrandDelivers() {
		return brandDelivers;
	}

	public void setBrandDelivers(List<BrandDeliverVO> brandDelivers) {
		this.brandDelivers = brandDelivers;
	}

	public BrandDeliverVO getBrandDeliver() {
		return brandDeliver;
	}

	public void setBrandDeliver(BrandDeliverVO brandDeliver) {
		this.brandDeliver = brandDeliver;
	}

}
