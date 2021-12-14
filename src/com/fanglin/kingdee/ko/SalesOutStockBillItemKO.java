package com.fanglin.kingdee.ko;

import java.io.Serializable;

import com.fanglin.utils.Arith;

public class SalesOutStockBillItemKO implements Serializable {

	private static final long serialVersionUID = -6581136024883267640L;
	
	private OrganizationKO FMaterialID; //物料编码
	
	private float FRealQty; //实发数量
	
	private OrganizationKO FStockID; //仓库

	public SalesOutStockBillItemKO() {
		super();
	}

	public OrganizationKO getFMaterialID() {
		return FMaterialID;
	}

	public void setFMaterialID(OrganizationKO fMaterialID) {
		FMaterialID = fMaterialID;
	}

	public float getFRealQty() {
		return FRealQty;
	}

	public void setFRealQty(float fRealQty) {
		FRealQty = fRealQty;
	}

	public OrganizationKO getFStockID() {
		return FStockID;
	}

	public void setFStockID(OrganizationKO fStockID) {
		FStockID = fStockID;
	}

	public SalesOutStockBillItemKO ptk(String MaterialNo, float num, String stockNo) {
		
		this.FMaterialID = new OrganizationKO(MaterialNo);
		this.FRealQty = (float) Arith.div(num, 1000.0);
		
		if (stockNo != null) {
			this.FStockID = new OrganizationKO(stockNo);
		}
		
		return this;
		
	}
	
}
