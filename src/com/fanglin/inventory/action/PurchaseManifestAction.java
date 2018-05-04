package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.inventory.service.PurchaseManifestService;
import com.fanglin.inventory.vo.PurchaseManifestVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PurchaseManifestAction extends BaseListAction{

	private static final long serialVersionUID = -2083648783144602856L;
	
	@Autowired
	private PurchaseManifestService purchaseManifestService;
	
	private List<Long> pids;
	
	private List<PurchaseManifestVO> purchaseManifests;
	
	@Action(value = "queryPurchaseManifestByPids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPurchaseManifestByPids(){
		
		purchaseManifests = purchaseManifestService.queryPurchaseManifestByPids(pids);
		
		return SUCCESS;
		
	}

	public List<Long> getPids() {
		return pids;
	}

	public void setPids(List<Long> pids) {
		this.pids = pids;
	}

	public List<PurchaseManifestVO> getPurchaseManifests() {
		return purchaseManifests;
	}

	public void setPurchaseManifests(List<PurchaseManifestVO> purchaseManifests) {
		this.purchaseManifests = purchaseManifests;
	}
	
}
