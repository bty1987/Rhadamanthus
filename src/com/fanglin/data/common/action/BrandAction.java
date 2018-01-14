/**
 * @File Name		: BrandAction.java
 * @Package   	: com.fanglin.data.action
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.BrandService;
import com.fanglin.data.common.vo.BrandVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandAction extends BaseListAction {

	private static final long serialVersionUID = 5720132465639995345L;
	
	@Autowired
	private BrandService brandService;
	
	private BrandVO brand;
	
	private List<BrandVO> brands;
	
	private List<Long> bIds;
	
	private String pinyinName;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	private List<String> autoFillList;
	
	@Action(value="pageBrand", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageBrand() throws FLException{
		
		brandService.pageBrand(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryBrand", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBrand() throws FLException{
		
		brands = brandService.queryBrand(queryCompany());
		
		return SUCCESS;
	}

	@Action(value="queryBrandByBId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBrandByBId(){
		
		brand = brandService.queryBrandByBId(brand);
		
		return SUCCESS;
	}
	
	@Action(value="queryBrandByBrandId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBrandByBrandId(){
		
		brand = brandService.queryBrandByBrandId(brand);
		
		return SUCCESS;
	}
	
	@Action(value="queryBrandByCategoryId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBrandByCategoryId(){
		
		brands = brandService.queryBrandByCategoryId(brand);
		
		return SUCCESS;
	}
	
	@Action(value="queryBrandForPinYinName", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBrandForPinYinName() throws FLException{
		
		brands = brandService.queryBrandForPinYinName(pinyinName,queryCompany());
		
		for(BrandVO brandVO: brands){
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(brandVO.getBrandId()); 
			keyValueVO.setValue(brandVO.getBrandName());
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(brandVO.getBrandName());
		}
		
		return SUCCESS;
	}
	
	@Action(value="queryBrandForPinYinNameACategoryName", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBrandForPinYinNameACategoryName() throws FLException{
		
		brands = brandService.queryBrandForPinYinName(pinyinName,queryCompany());
		
		for(BrandVO brandVO: brands){
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(brandVO.getBrandId());
			keyValueVO.setValue(String.format("%s-%s", brandVO.getBrandName(), brandVO.getCategoryName()));
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(brandVO.getCategoryName());
		}
		
		return SUCCESS;
	}

	public BrandVO getBrand() {
		return brand;
	}

	public void setBrand(BrandVO brand) {
		this.brand = brand;
	}

	public List<BrandVO> getBrands() {
		return brands;
	}

	public void setBrands(List<BrandVO> brands) {
		this.brands = brands;
	}

	public List<Long> getbIds() {
		return bIds;
	}

	public void setbIds(List<Long> bIds) {
		this.bIds = bIds;
	}

	public List<KeyValueVO> getAutoFillKeyValue() {
		if(autoFillKeyValue == null){
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue) {
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public List<String> getAutoFillList() {
		if(autoFillList == null){
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList) {
		this.autoFillList = autoFillList;
	}

	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}
	
}
