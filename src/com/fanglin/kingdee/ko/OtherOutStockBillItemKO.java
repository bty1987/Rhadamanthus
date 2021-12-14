package com.fanglin.kingdee.ko;

import java.io.Serializable;

import com.alibaba.fastjson.annotation.JSONField;
import com.fanglin.utils.Arith;

public class OtherOutStockBillItemKO implements Serializable {

	private static final long serialVersionUID = 5350010748849086778L;

	@JSONField(ordinal=1)
	private OrganizationKO FMaterialId; //物料编码
	
	@JSONField(ordinal=2)
	private float FQty; //实发数量
	
	@JSONField(ordinal=3)
	private OrganizationKO FStockId; //发货仓库

	public OtherOutStockBillItemKO() {
		super();
	}

	public OrganizationKO getFMaterialId() {
		return FMaterialId;
	}

	public void setFMaterialId(OrganizationKO fMaterialId) {
		FMaterialId = fMaterialId;
	}

	public float getFQty() {
		return FQty;
	}

	public void setFQty(float fQty) {
		FQty = fQty;
	}

	public OrganizationKO getFStockId() {
		return FStockId;
	}

	public void setFStockId(OrganizationKO fStockId) {
		FStockId = fStockId;
	}

	public OtherOutStockBillItemKO ptk(String materialNO, float num, String stockId) {

		this.FMaterialId = new OrganizationKO(materialNO);
		this.FQty = (float) Arith.div(num, 1000.0);
		this.FStockId = new OrganizationKO(stockId);

		return this;
	}

}
