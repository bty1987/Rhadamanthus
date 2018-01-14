package com.fanglin.production.action;



import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.ProductionPictureService;
import com.fanglin.production.vo.ProductionPictureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ProductionPictureAction extends BaseListAction{

	private static final long serialVersionUID = -708873723861052408L;
	
	@Autowired
	private ProductionPictureService productionPictureService;
	
	private ProductionPictureVO productionPicture;
	
	private List<ProductionPictureVO> productionPictures;

	@Action(value = "queryProductionPictureByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryProductionPictureByPid(){
		
		productionPictures = productionPictureService.queryProductionPictureByPid(productionPicture);
		
		return SUCCESS;
	}
	
	@Action(value = "addProductionPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addProductionPicture() throws FLException{
		
		productionPictureService.addProductionPicture(productionPicture, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "deleteProductionPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteProductionPicture() throws FLException{
		
		productionPictureService.deleteProductionPicture(productionPicture);
		
		return SUCCESS;
	}
	
	public ProductionPictureVO getProductionPicture() {
		return productionPicture;
	}

	public void setProductionPicture(ProductionPictureVO productionPicture) {
		this.productionPicture = productionPicture;
	}

	public List<ProductionPictureVO> getProductionPictures() {
		return productionPictures;
	}

	public void setProductionPictures(List<ProductionPictureVO> productionPictures) {
		this.productionPictures = productionPictures;
	}

}
