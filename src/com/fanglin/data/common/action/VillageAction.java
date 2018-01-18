/**
 * Title: VillageAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
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
import com.fanglin.data.common.service.VillageService;
import com.fanglin.data.common.vo.VillageVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VillageAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;
	
	@Autowired
	private VillageService villageService;
	
	private VillageVO village;
	
	private List<VillageVO> villages;

	private List<String> autoFillList;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	private String pinyinName;
	
	@Action(value="pageVillage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageVillage(){
		
		villageService.pageVillage(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="queryVillageById", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryVillageById() throws FLException{
		
		village = villageService.queryVillageById(village);
		
		return SUCCESS;
	}
	
	@Action(value="queryVillageForNameByPinyin", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryVillageForNameByPinyin(){
	
		villages = villageService.queryVillageForNameByPinyin(pinyinName);
		
		for(VillageVO villageVO: villages){
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(String.valueOf(villageVO.getNo()));
			keyValueVO.setValue(villageVO.getName() + "-" + villageVO.getCityProper().getCityProperName());
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(villageVO.getName());
		}
		
		return SUCCESS;
	}
	
	//@Action(value="addVillage", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addVillage() throws FLException{
		 
	    villageService.addVillage(village);
	
	    return SUCCESS;
	  }
	
	//@Action(value="updateVillage", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateVillage() throws FLException{
	    
		  villageService.updateVillage(village);
	
		  return SUCCESS;
	  }

	//@Action(value="updateVillageForStatus", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateVillageForStatus() throws FLException{
		  
		  villageService.updateVillageForStatus(village);

		  return SUCCESS;
	  }
	
	//@Action(value="updateVillageForPosition", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateVillageForPosition() throws FLException {
	   
		  villageService.updateVillageForPosition(village);
	
		  return SUCCESS;
	  }
	public VillageVO getVillage() {
		return village;
	}

	public void setVillage(VillageVO village) {
		this.village = village;
	}

	public List<VillageVO> getVillages() {
		return villages;
	}

	public void setVillages(List<VillageVO> villages) {
		this.villages = villages;
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

	public List<KeyValueVO> getAutoFillKeyValue(){
		if(autoFillKeyValue == null){
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue){
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}
	
}
