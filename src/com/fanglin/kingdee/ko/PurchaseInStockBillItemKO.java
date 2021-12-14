package com.fanglin.kingdee.ko;

import java.io.Serializable;

import com.fanglin.utils.Arith;

public class PurchaseInStockBillItemKO implements Serializable {

	private static final long serialVersionUID = -5860290438983771556L;
	
	private OrganizationKO FMaterialID; //物料编码
	
	private OrganizationKO FStockID; //仓库
	
	private OrganizationKO FUnitID; //库存单位
	
	private OrganizationKO FPriceUnitID; //计价单位
	
	private OrganizationKO FRemainInStockUnitId; //采购单位
	
	private int FRemainInStockQty; //采购数量

	public PurchaseInStockBillItemKO() {
		super();
	}

	public OrganizationKO getFMaterialID() {
		return FMaterialID;
	}

	public void setFMaterialID(OrganizationKO fMaterialID) {
		FMaterialID = fMaterialID;
	}

	public OrganizationKO getFStockID() {
		return FStockID;
	}

	public void setFStockID(OrganizationKO fStockID) {
		FStockID = fStockID;
	}

	public OrganizationKO getFUnitID() {
		return FUnitID;
	}

	public void setFUnitID(OrganizationKO fUnitID) {
		FUnitID = fUnitID;
	}

	public OrganizationKO getFPriceUnitID() {
		return FPriceUnitID;
	}

	public void setFPriceUnitID(OrganizationKO fPriceUnitID) {
		FPriceUnitID = fPriceUnitID;
	}

	public OrganizationKO getFRemainInStockUnitId() {
		return FRemainInStockUnitId;
	}

	public void setFRemainInStockUnitId(OrganizationKO fRemainInStockUnitId) {
		FRemainInStockUnitId = fRemainInStockUnitId;
	}

	public int getFRemainInStockQty() {
		return FRemainInStockQty;
	}

	public void setFRemainInStockQty(int fRemainInStockQty) {
		FRemainInStockQty = fRemainInStockQty;
	}

	public PurchaseInStockBillItemKO ptk(String materialNo, String stockNo, String unitNo, String priceUnitNo, String purchaseCompany, int num) {
		
		this.FMaterialID = new OrganizationKO(materialNo);
		this.FStockID = new OrganizationKO(stockNo);
		this.FUnitID = new OrganizationKO(unitNo);
		this.FPriceUnitID = new OrganizationKO(priceUnitNo);
		this.FRemainInStockUnitId = new OrganizationKO(purchaseCompany);
		this.FRemainInStockQty = (int) Arith.div(num, 1000.0);
		
		return this;
		
	}

}
