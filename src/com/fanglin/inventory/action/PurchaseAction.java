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
import com.fanglin.inventory.service.PurchaseItemService;
import com.fanglin.inventory.service.PurchaseService;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.sales.vo.SalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PurchaseAction extends BaseListAction {

	private static final long serialVersionUID = -4027935021572817915L;

	@Autowired
	private PurchaseService purchaseService;
	
	@Autowired
	private PurchaseItemService purchaseItemService;
	
	private PurchaseVO purchase;
	
	private PurchaseItemVO purchaseItem;
	
	private List<PurchaseItemVO> purchaseItems;
	
	private List<PurchaseVO> purchases;
	
	private List<Long> sids;
	
	private List<Long> pids;
	
	private List<Long> siids;
	
	private SalesVO sales;
	
	@Action(value = "pagePurchase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePurchase() throws FLException{
		
		purchaseService.pagePurchase(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryPurchaseItemByPids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPurchaseItemByPids(){
		
		purchaseItems = purchaseItemService.queryPurchaseItemByPids(pids);
		
		return SUCCESS;
	}
	
	@Action(value = "queryPurchaseItemByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPurchaseItemByPid(){
		
		purchaseItems = purchaseItemService.queryPurchaseItemByPid(purchase);
		
		return SUCCESS;
	}
	
	@Action(value = "queryPurchaseByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPurchaseByPid() throws FLException {
		
		purchase = purchaseService.queryPurchaseByPid(purchase);
		
		return SUCCESS;
	}
	
	@Action(value = "queryPurchaseBySid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPurchaseBySid(){
		
		purchases = purchaseService.queryPurchaseBySid(sales);
		
		return SUCCESS;
	}
	
	@Action(value = "addPurchase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPurchase() throws FLException{
		
		purchaseService.addPurchase(purchase, sids,purchaseItems, queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "addPurchaseItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPurchaseItem() throws FLException{
		
		purchaseItemService.addPurchaseItem(purchase,purchaseItem);
		
		return SUCCESS;
	}
	
	@Action(value = "updatePurchase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePurchase() throws FLException{
		
		purchaseService.updatePurchase(purchase);
		
		return SUCCESS;
	}
	
	@Action(value = "updatePurchaseForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePurchaseForStatus() throws FLException{
		
		purchaseService.updatePurchaseForStatus(purchase);
		
		return SUCCESS;
	}
	
	@Action(value = "updatePurchaseForBalanceStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePurchaseForBalanceStatus() throws FLException{
		
		purchaseService.updatePurchaseForBalanceStatus(purchase);
		
		return SUCCESS;
	}
	
	@Action(value = "updatePurchaseItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePurchaseItem() throws FLException{
		
		purchaseItemService.updatePurchaseItem(purchase,purchaseItem);
		
		return SUCCESS;
	}
	
	@Action(value = "deletePurchaseItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePurchaseItem() throws FLException{
		
		purchaseItemService.deletePurchaseItem(purchase,purchaseItem);
		
		return SUCCESS;
	}
	
	
	public PurchaseVO getPurchase() {
		return purchase;
	}

	public void setPurchase(PurchaseVO purchase) {
		this.purchase = purchase;
	}

	public PurchaseItemVO getPurchaseItem() {
		return purchaseItem;
	}

	public void setPurchaseItem(PurchaseItemVO purchaseItem) {
		this.purchaseItem = purchaseItem;
	}

	public List<PurchaseItemVO> getPurchaseItems() {
		return purchaseItems;
	}

	public void setPurchaseItems(List<PurchaseItemVO> purchaseItems) {
		this.purchaseItems = purchaseItems;
	}
	
	public List<PurchaseVO> getPurchases() {
		return purchases;
	}

	public void setPurchases(List<PurchaseVO> purchases) {
		this.purchases = purchases;
	}

	public List<Long> getPids() {
		return pids;
	}

	public void setPids(List<Long> pids) {
		this.pids = pids;
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

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}
	
}
