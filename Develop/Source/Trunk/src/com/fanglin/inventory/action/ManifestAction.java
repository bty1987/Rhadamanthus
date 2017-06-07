/**
 * @File Name		: ManifestAction.java
 * @Package   	: com.fanglin.inventory.action
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.ManifestItemService;
import com.fanglin.inventory.service.ManifestService;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.inventory.vo.PurchaseItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ManifestAction extends BaseListAction {

	private static final long serialVersionUID = -2834769288100660292L;
	
	@Autowired
	private ManifestService manifestService;
	
	@Autowired
	private ManifestItemService manifestItemService;
	
	private ManifestVO manifest;
	
	private List<Long> siids;
	
	private List<Long> aoids;
	
	private List<Long> pids;
	
	private List<PurchaseItemVO> purchaseItems;
	
	private List<ManifestItemVO> manifestItems;
	
	private ManifestItemVO manifestItem;
	
	@Action(value = "pageManifest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageManifest(){
		
		manifestService.pageManifest(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryManifestByMId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestByMId(){
		
		manifest = manifestService.queryManifestByMId(manifest);
		
		return SUCCESS;
	}
	
	@Action(value = "queryManifestItemByMId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestItemByMId(){
		
		manifestItems = manifestItemService.queryManifestItemByMId(manifest);
		
		return SUCCESS;
	}
	
	@Action(value = "queryManifestItemBySiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestItemBySiid(){
		
		manifestItems = manifestItemService.queryManifestItemBySiid(manifestItem);
		
		return SUCCESS;
	}
	
	@Action(value = "queryManifestItemBySiids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestItemBySiids(){
		
		manifestItems = manifestItemService.queryManifestItemBySiids(siids);
		
		return SUCCESS;
	}
	
	@Action(value = "addManifestForCG", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForCG() throws FLException{
		
		manifestService.addManifestForCG(manifest, manifestItems,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addManifestForXG", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForXG() throws FLException{
		
		manifestService.addManifestForXG(manifest, manifestItems, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addManifestForCR", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForCR() throws FLException{
		
		manifestService.addManifestForCR(manifest, manifestItems, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addManifestForXB", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForXB() throws FLException{
		
		manifestService.addManifestForXB(manifest, manifestItems,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addManifestForPU", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForPU() throws FLException{
		
		manifestService.addManifestForPU(manifest, pids,purchaseItems, manifestItems, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addManifestForAS", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForAS() throws FLException{
		
		manifestService.addManifestForAS(manifest, manifestItems, aoids ,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "addManifestItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestItem() throws FLException{
		
		manifestItemService.addManifestItem(manifest, manifestItem);
		
		return SUCCESS;
	}
	
	@Action(value = "updateManifest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateManifest() throws FLException{
		
		manifestService.updateManifest(manifest);
		
		return SUCCESS;
	}
	
	@Action(value = "updateManifestItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateManifestItem() throws FLException{
		
		manifestItemService.updateManifestItem(manifest, manifestItem);
		
		return SUCCESS;
	}
	
	@Action(value = "confirmManifest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmManifest() throws FLException{
		
		manifestService.confirmManifest(manifest);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteManifestItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteManifestItem() throws FLException{
		
		manifestItemService.deleteManifestItem(manifest, manifestItem);
		
		return SUCCESS;
	}

	public ManifestVO getManifest() {
		return manifest;
	}

	public void setManifest(ManifestVO manifest) {
		this.manifest = manifest;
	}

	public List<ManifestItemVO> getManifestItems() {
		return manifestItems;
	}

	public void setManifestItems(List<ManifestItemVO> manifestItems) {
		this.manifestItems = manifestItems;
	}

	public ManifestItemVO getManifestItem() {
		return manifestItem;
	}

	public void setManifestItem(ManifestItemVO manifestItem) {
		this.manifestItem = manifestItem;
	}

	public List<Long> getAoids() {
		return aoids;
	}

	public void setAoids(List<Long> aoids) {
		this.aoids = aoids;
	}

	public List<Long> getPids() {
		return pids;
	}

	public void setPids(List<Long> pids) {
		this.pids = pids;
	}

	public List<PurchaseItemVO> getPurchaseItems() {
		return purchaseItems;
	}

	public void setPurchaseItems(List<PurchaseItemVO> purchaseItems) {
		this.purchaseItems = purchaseItems;
	}

	public List<Long> getSiids() {
		return siids;
	}

	public void setSiids(List<Long> siids) {
		this.siids = siids;
	}

}
