/**
 * Title: VillageAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 */

package com.fanglin.data.action;

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
import com.fanglin.data.service.VillageService;
import com.fanglin.data.vo.VillageVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VillageAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;
	
	@Autowired
	private VillageService villageService;
	
	private VillageVO village;
	
	private List<VillageVO> villages;
	
	private List<String> villageIds;
	
	private String pinyinName;
	
	private List<String> autoFillList;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	@Action(value="pageVillage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageVillage(){
		
		villageService.pageVillage(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="queryVillage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryVillage(){
		
		villages = villageService.queryVillage(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="queryVillageById", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryVillageById(){
		
		village = villageService.queryVillageById(village);
		
		return SUCCESS;
	}
	
	@Action(value="queryVillageForNameByPinyin", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryVillageForNameByPinyin(){
		
		List<VillageVO> villageVOs = villageService.queryVillageForNameByPinyin(pinyinName);
		
		for(VillageVO villageVO: villageVOs){
			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(String.valueOf(villageVO.getVillageId()));
			keyValueVO.setValue(villageVO.getVillageName() + "-" + villageVO.getCityProper().getCityProperName());
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(villageVO.getVillageName());
		}
		
		return SUCCESS;
	}
	
	public VillageVO getVillage(){
		return village;
	}

	public void setVillage(VillageVO village){
		this.village = village;
	}

	public List<String> getVillageIds(){
		return villageIds;
	}

	public void setVillageIds(List<String> villageIds){
		this.villageIds = villageIds;
	}

	public String getPinyinName(){
		return pinyinName;
	}

	public void setPinyinName(String pinyinName){
		this.pinyinName = pinyinName;
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

	public List<VillageVO> getVillages(){
		return villages;
	}

	public void setVillages(List<VillageVO> villages){
		this.villages = villages;
	}
}
