/**
 * @File Name		: RankAction.java
 * @Package   	: com.fanglin.report.action
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.DecorationRankService;
import com.fanglin.report.service.MaterialRankService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RankAction extends BaseListAction {

	private static final long serialVersionUID = -4004574085957114814L;
	
	@Autowired
	private DecorationRankService decorationRankService;
	
	@Autowired
	private MaterialRankService materialRankService;
	
	private String decorationRank;
	
	private String decorationPlace;
	
	private String materialRank;
	
	private String materialPlace;
	
	private String zaterialRank;
	
	private String zaterialPlace;
	
	@Action(value="queryRankForPlace", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryRankForPlace() throws FLException{
		
		String userId = getUserId();
		
		List<String> decoration = decorationRankService.queryDecorationDesignerForPlaceByUserId(userId);
		List<String> material = materialRankService.queryMaterialDesignerRankForPlaceByUserId(userId);
		List<String> zaterial= materialRankService.queryZaterialDesignerRankForPlaceByUserId(userId);
		
		decorationRank = decoration.get(0);
		decorationPlace = decoration.get(1);
		
		materialRank = material.get(0);
		materialPlace = material.get(1);
		
		zaterialRank = zaterial.get(0);
		zaterialPlace = zaterial.get(1);
		
		return SUCCESS;
	}

	public DecorationRankService getDecorationRankService() {
		return decorationRankService;
	}

	public void setDecorationRankService(DecorationRankService decorationRankService) {
		this.decorationRankService = decorationRankService;
	}

	public MaterialRankService getMaterialRankService() {
		return materialRankService;
	}

	public void setMaterialRankService(MaterialRankService materialRankService) {
		this.materialRankService = materialRankService;
	}

	public String getDecorationRank() {
		return decorationRank;
	}

	public void setDecorationRank(String decorationRank) {
		this.decorationRank = decorationRank;
	}

	public String getDecorationPlace() {
		return decorationPlace;
	}

	public void setDecorationPlace(String decorationPlace) {
		this.decorationPlace = decorationPlace;
	}

	public String getMaterialRank() {
		return materialRank;
	}

	public void setMaterialRank(String materialRank) {
		this.materialRank = materialRank;
	}

	public String getMaterialPlace() {
		return materialPlace;
	}

	public void setMaterialPlace(String materialPlace) {
		this.materialPlace = materialPlace;
	}

	public String getZaterialRank() {
		return zaterialRank;
	}

	public void setZaterialRank(String zaterialRank) {
		this.zaterialRank = zaterialRank;
	}

	public String getZaterialPlace() {
		return zaterialPlace;
	}

	public void setZaterialPlace(String zaterialPlace) {
		this.zaterialPlace = zaterialPlace;
	}

}
