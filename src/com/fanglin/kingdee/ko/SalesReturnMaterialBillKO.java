/**
 * @File Name		: SalesReturnMaterialBillKO.java
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

public class SalesReturnMaterialBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 1908026682100179769L;

	public static String FormId = "PUR_MRB";

	private OrganizationKO FStockOrgId; //退料组织

	private String FDate; //退料日期

	private OrganizationKO FBillTypeID; //单据类型
	
	private OrganizationKO FPurchaseOrgId; //采购组织
	
	private OrganizationKO FRequireOrgId; //需求组织
	
	private OrganizationKO FSupplierID; //供应商
	
	private List<SalesReturnMaterialBillItemKO> FPURMRBENTRY; //单据体明细

	public SalesReturnMaterialBillKO() {
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

	public OrganizationKO getFRequireOrgId() {
		return FRequireOrgId;
	}

	public void setFRequireOrgId(OrganizationKO fRequireOrgId) {
		FRequireOrgId = fRequireOrgId;
	}

	public OrganizationKO getFSupplierID() {
		return FSupplierID;
	}

	public void setFSupplierID(OrganizationKO fSupplierID) {
		FSupplierID = fSupplierID;
	}

	public List<SalesReturnMaterialBillItemKO> getFPURMRBENTRY() {
		return FPURMRBENTRY;
	}

	public void setFPURMRBENTRY(List<SalesReturnMaterialBillItemKO> fPURMRBENTRY) {
		FPURMRBENTRY = fPURMRBENTRY;
	}

	public SalesReturnMaterialBillKO ptk(String returnCompany, String returnTime, String purchaseCompany, String requireCompany, String supplier, List<SalesReturnMaterialBillItemKO> item) {

		this.FStockOrgId = new OrganizationKO(returnCompany);
		this.FDate = returnTime;
		this.FBillTypeID = new OrganizationKO("TLD01_SYS");
		this.FPurchaseOrgId = new OrganizationKO(purchaseCompany);
		this.FRequireOrgId = new OrganizationKO(requireCompany);
		this.FSupplierID = new OrganizationKO(supplier);
		this.FPURMRBENTRY = item;

		return this;
	}

}
