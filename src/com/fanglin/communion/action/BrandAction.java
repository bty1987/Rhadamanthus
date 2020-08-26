package com.fanglin.communion.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.communion.service.BrandService;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

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

	@Action(value = "pageBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageBrand() throws FLException {

		brandService.pageBrand(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrand() throws FLException {

		brands = brandService.queryBrand(queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryBrandByBid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandByBid() {

		brand = brandService.queryBrandByBid(brand);

		return SUCCESS;
	}

	@Action(value = "queryBrandByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandByNo() {

		brand = brandService.queryBrandByNo(brand);

		return SUCCESS;
	}

	@Action(value = "queryBrandByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandByCid() {

		brands = brandService.queryBrandByCid(brand);

		return SUCCESS;
	}

	@Action(value = "queryBrandByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandByPinyin() throws FLException {

		brands = brandService.queryBrandForPinYinName(pinyinName, queryCompany());

		for (BrandVO brandVO : brands) {
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(brandVO.getNo());
			keyValueVO.setValue(String.format("%s-%s", brandVO.getName(), brandVO.getCategoryName()));
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(brandVO.getCategoryName());
			brandVO.setAlias(String.format("%s-%s", brandVO.getName(), brandVO.getCategoryName()));
		}

		return SUCCESS;
	}

	@Action(value = "queryBrandByPinYin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandByPinYin() throws FLException {

		brands = brandService.queryBrandForPinYinName(pinyinName, queryCompany());

		for (BrandVO brandVO : brands) {
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(brandVO.getNo());
			keyValueVO.setValue(String.format("%s-%s", brandVO.getName(), brandVO.getCategoryName()));
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(brandVO.getCategoryName());
			brandVO.setAlias(String.format("%s-%s", brandVO.getName(), brandVO.getCategoryName()));
		}

		return SUCCESS;
	}

	@Action(value = "queryBrandByPinyinForAll", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBrandByPinyinForAll() throws FLException {

		brands = brandService.queryBrandForPinYinName(pinyinName, null);

		for (BrandVO brandVO : brands) {
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(brandVO.getNo());
			keyValueVO.setValue(String.format("%s-%s", brandVO.getName(), brandVO.getCategoryName()));
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(brandVO.getCategoryName());
			brandVO.setAlias(String.format("%s-%s", brandVO.getName(), brandVO.getCategoryName()));
		}

		return SUCCESS;
	}

	@Action(value = "addBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addBrand() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		brandService.addBrand(brand, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateBrand() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		brandService.updateBrand(brand);

		return SUCCESS;
	}

	@Action(value = "deleteBrandByBIds", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteBrandByBIds() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		brandService.deleteBrandByBIds(bIds);

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
		if (autoFillKeyValue == null) {
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue) {
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public List<String> getAutoFillList() {
		if (autoFillList == null) {
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
