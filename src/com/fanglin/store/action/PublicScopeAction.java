package com.fanglin.store.action;

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
import com.fanglin.store.service.MbrandService;
import com.fanglin.store.service.McategoryService;
import com.fanglin.store.service.SlideService;
import com.fanglin.store.vo.MbrandVO;
import com.fanglin.store.vo.McategoryVO;
import com.fanglin.store.vo.SlideVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class PublicScopeAction extends BaseListAction {

	private static final long serialVersionUID = 6855331081050963945L;
	
	@Autowired
	private McategoryService mcategoryService;
	
	@Autowired
	private MbrandService mbrandService;
	
	@Autowired
	private SlideService slideService;
	
	private McategoryVO mcategory;
	
	private List<McategoryVO> mcategorys;
	
	private MbrandVO mbrand;
	
	private List<MbrandVO> mbrands;
	
	private List<SlideVO> slides;
		
	private List<KeyValueVO> autoFillKeyValue;
	
	private List<String> autoFillList;
	
	@Action(value="queryMcategory", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMcategory(){
		
		mcategorys = mcategoryService.queryMcategory();
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMcategoryForShow", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMcategoryForShow(){
		
		mcategorys = mcategoryService.queryMcategoryForShow();
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMbrand", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMbrand(){
		
		mbrands = mbrandService.queryMbrand(mbrand);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMbrandByName", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMbrandByName(){
		
		mbrands = mbrandService.queryMbrandByName(mbrand);
		
		packageMgoodsName(mbrands);
		
		return SUCCESS;
		
	}
	
	@Action(value="querySlideForShow", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String querySlideForShow(){
		
		slides = slideService.querySlideForShow();
		
		return SUCCESS;
	}
	
	private void packageMgoodsName(List<MbrandVO> mgoods){
		for(MbrandVO mbrand: mbrands){
			KeyValueVO keyValueVO = new KeyValueVO();
			
			StringBuffer value = new StringBuffer();
			value.append(mbrand.getName());
			
			keyValueVO.setKey(String.valueOf(mbrand.getBid()));
			keyValueVO.setValue(value.toString());
			
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(mbrand.getName());
		}
	}
	
	public McategoryVO getMcategory() {
		return mcategory;
	}

	public void setMcategory(McategoryVO mcategory) {
		this.mcategory = mcategory;
	}
	
	public List<McategoryVO> getMcategorys() {
		return mcategorys;
	}

	public void setMcategorys(List<McategoryVO> mcategorys) {
		this.mcategorys = mcategorys;
	}
	
	public MbrandVO getMbrand() {
		return mbrand;
	}

	public void setMbrand(MbrandVO mbrand) {
		this.mbrand = mbrand;
	}

	public List<MbrandVO> getMbrands() {
		return mbrands;
	}

	public void setMbrands(List<MbrandVO> mbrands) {
		this.mbrands = mbrands;
	}
	
	public List<SlideVO> getSlides() {
		return slides;
	}

	public void setSlides(List<SlideVO> slides) {
		this.slides = slides;
	}
	
	public List<KeyValueVO> getAutoFillKeyValue(){
		if(autoFillKeyValue == null){
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue){
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public List<String> getAutoFillList(){
		if(autoFillList == null){
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList){
		this.autoFillList = autoFillList;
	}
	
	
}
