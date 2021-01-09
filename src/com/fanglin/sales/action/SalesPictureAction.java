package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.SalesPictureService;
import com.fanglin.sales.vo.SalesPictureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesPictureAction extends BaseListAction {

	private static final long serialVersionUID = -3165398551277430051L;

	@Autowired
	private SalesPictureService salesPictureService;

	private SalesPictureVO salesPicture;

	private List<SalesPictureVO> salesPictures;

	@Action(value = "querySalesPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesPicture() throws FLException {

		salesPictures = salesPictureService.querySalesPicture(salesPicture);

		return SUCCESS;
	}

	@Action(value = "addSalesPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesPicture() throws FLException {

		salesPictureService.addSalesPicture(salesPicture, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteSalesPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteSalesPicture() throws FLException {

		salesPictureService.deleteSalesPicture(salesPicture);

		return SUCCESS;
	}

	public SalesPictureVO getSalesPicture() {
		return salesPicture;
	}

	public void setSalesPicture(SalesPictureVO salesPicture) {
		this.salesPicture = salesPicture;
	}

	public List<SalesPictureVO> getSalesPictures() {
		return salesPictures;
	}

	public void setSalesPictures(List<SalesPictureVO> salesPictures) {
		this.salesPictures = salesPictures;
	}

}
