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
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.inventory.vo.ManifestItemVO;
import com.fanglin.inventory.vo.ManifestVO;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.sales.vo.SalesVO;

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

	private List<Long> sids;

	private List<Long> siids;

	private List<Long> aids;

	private List<Long> pids;

	private List<PurchaseVO> purchases;

	private List<ManifestVO> manifests;

	private List<PurchaseItemVO> purchaseItems;

	private List<ManifestItemVO> manifestItems;

	private List<AccessoriesVO> accessories;

	private List<AccessoriesItemVO> accessoriesItems;

	private ManifestItemVO manifestItem;

	private SalesVO sales;

	@Action(value = "pageManifest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageManifest() throws FLException {

		manifestService.pageManifest(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryManifestByMid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestByMid() {

		manifest = manifestService.queryManifestByMid(manifest);

		return SUCCESS;
	}

	@Action(value = "queryManifestItemByMid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestItemByMid() {

		manifestItems = manifestItemService.queryManifestItemByMid(manifest);

		return SUCCESS;
	}

	@Action(value = "queryManifestItemBySiids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestItemBySiids() {

		manifestItems = manifestItemService.queryManifestItemBySiids(siids);

		return SUCCESS;
	}

	@Action(value = "queryManifestForPUByPids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestForPUByPids() {

		manifests = manifestService.queryManifestForPUByPids(pids);

		return SUCCESS;
	}

	@Action(value = "queryManifestForXGBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryManifestForXGBySid() {

		manifests = manifestService.queryManifestForXGBySid(sales);

		return SUCCESS;
	}

	@Action(value = "addManifestForCG", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForCG() throws FLException {

		manifestService.addManifestForCG(manifest, manifestItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addManifestForXG", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForXG() throws FLException {

		manifestService.addManifestForXG(manifest, manifestItems, sids, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addManifestForCR", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForCR() throws FLException {

		manifestService.addManifestForCR(manifest, manifestItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addManifestForXB", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForXB() throws FLException {

		manifestService.addManifestForXB(manifest, manifestItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addManifestForPU", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForPU() throws FLException {

		manifestService.addManifestForPU(purchases, purchaseItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addManifestForAS", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForAS() throws FLException {

		manifestService.addManifestForAS(accessories, accessoriesItems, queryUserId(), queryCompany());

		return SUCCESS;
	}
	
	@Action(value = "addManifestForAR", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestForAR() throws FLException {

		manifestService.addManifestForAR(accessories, accessoriesItems, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "addManifestItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addManifestItem() throws FLException {

		manifestItemService.addManifestItem(manifest, manifestItem);

		return SUCCESS;
	}

	@Action(value = "updateManifest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateManifest() throws FLException {

		manifestService.updateManifest(manifest);

		return SUCCESS;
	}

	@Action(value = "updateManifestItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateManifestItem() throws FLException {

		manifestItemService.updateManifestItem(manifest, manifestItem);

		return SUCCESS;
	}

	@Action(value = "confirmManifest", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmManifest() throws FLException {

		manifestService.confirmManifest(manifest);

		return SUCCESS;
	}

	@Action(value = "deleteManifestItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteManifestItem() throws FLException {

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

	public List<Long> getAids() {
		return aids;
	}

	public void setAids(List<Long> aids) {
		this.aids = aids;
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

	public List<Long> getSids() {
		return sids;
	}

	public void setSids(List<Long> sids) {
		this.sids = sids;
	}

	public List<PurchaseVO> getPurchases() {
		return purchases;
	}

	public void setPurchases(List<PurchaseVO> purchases) {
		this.purchases = purchases;
	}

	public List<AccessoriesVO> getAccessories() {
		return accessories;
	}

	public void setAccessories(List<AccessoriesVO> accessories) {
		this.accessories = accessories;
	}

	public List<AccessoriesItemVO> getAccessoriesItems() {
		return accessoriesItems;
	}

	public void setAccessoriesItems(List<AccessoriesItemVO> accessoriesItems) {
		this.accessoriesItems = accessoriesItems;
	}

	public List<ManifestVO> getManifests() {
		return manifests;
	}

	public void setManifests(List<ManifestVO> manifests) {
		this.manifests = manifests;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

}
