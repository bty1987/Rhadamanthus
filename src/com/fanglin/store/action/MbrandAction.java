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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.MbrandService;
import com.fanglin.store.vo.MbrandVO;

@ParentPackage("login")
@Namespace("/")
@Controller
public class MbrandAction extends BaseListAction{

	private static final long serialVersionUID = 6606015629580300464L;

	@Autowired
	private MbrandService mbrandService;
	
	private MbrandVO mbrand;
	
	private List<MbrandVO> mbrands;
	
	private String pinyinName;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	private List<String> autoFillList;
	
	@Action(value="pageMbrand", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMbrand(){
		
		mbrandService.pageMbrand(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMbrandByCid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMbrandByCid(){
		
		mbrands = mbrandService.queryMbrandByCid(mbrand);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMbrandByName", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMbrandByName(){
		
		mbrands = mbrandService.queryMbrandByName(pinyinName);
		
		packageMgoodsName(mbrands);
		
		return SUCCESS;
		
	}
	
	@Action(value="addMbrand", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMbrand() throws FLException{
		
		mbrandService.addMbrand(mbrand);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMbrand", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMbrand() throws FLException{
		
		mbrandService.updateMbrand(mbrand);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMbrandForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMbrandForStatus() throws FLException{
		
		mbrandService.updateMbrandForStatus(mbrand);
		
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
	
	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
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
