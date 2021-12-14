/**
 * @File Name		: SalesInStockBillKO.java
 * @Package   	: com.fanglin.kingdee.ko
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.ko;

import java.io.Serializable;
import java.util.List;

import com.fanglin.kingdee.handle.Bean;

public class SalesInStockBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 8868230442705055693L;

	public static String FormId = "STK_InStock"; //采购入库单

	private OrganizationKO FStockOrgId; //收料组织

	private String FDate; //入库日期
	
	private OrganizationKO FBillTypeID; //单据类型

	private OrganizationKO FPurchaseOrgId; //采购组织

	private OrganizationKO FSupplierId; //供应商
	
	private List<SalesInStockBillItemKO> FInStockEntry; //单据体明细

	public SalesInStockBillKO() {
		super();
		super.setFormId(FormId);
	}

	public OrganizationKO getFStockOrgId() {
		return FStockOrgId;
	}

	public void setFStockOrgId(OrganizationKO fStockOrgId) {
		FStockOrgId = fStockOrgId;
	}

	public String getFDate() {
		return FDate;
	}

	public void setFDate(String fDate) {
		FDate = fDate;
	}

	public OrganizationKO getFBillTypeID() {
		return FBillTypeID;
	}

	public void setFBillTypeID(OrganizationKO fBillTypeID) {
		FBillTypeID = fBillTypeID;
	}

	public OrganizationKO getFPurchaseOrgId() {
		return FPurchaseOrgId;
	}

	public void setFPurchaseOrgId(OrganizationKO fPurchaseOrgId) {
		FPurchaseOrgId = fPurchaseOrgId;
	}

	public OrganizationKO getFSupplierId() {
		return FSupplierId;
	}

	public void setFSupplierId(OrganizationKO fSupplierId) {
		FSupplierId = fSupplierId;
	}

	public List<SalesInStockBillItemKO> getFInStockEntry() {
		return FInStockEntry;
	}

	public void setFInStockEntry(List<SalesInStockBillItemKO> fInStockEntry) {
		FInStockEntry = fInStockEntry;
	}

	public SalesInStockBillKO ptk(String inCompany, String collectTime, String purchaseCompany, String supplier, List<SalesInStockBillItemKO> item) {

		this.FStockOrgId = new OrganizationKO(inCompany);
		this.FDate = collectTime;
		this.FBillTypeID = new OrganizationKO("RKD01_SYS"); //标准采购入库
		this.FPurchaseOrgId = new OrganizationKO(purchaseCompany);
		this.FSupplierId = new OrganizationKO(supplier);
		this.FInStockEntry = item;

		return this;
	}

}
