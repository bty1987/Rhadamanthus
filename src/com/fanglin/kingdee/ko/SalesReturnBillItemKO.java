/**
 * @File Name		: SalesReturnBillItemKO.java
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

import com.alibaba.fastjson.annotation.JSONField;
import com.fanglin.kingdee.handle.Bean;
import com.fanglin.utils.Arith;

public class SalesReturnBillItemKO extends Bean implements Serializable {

	private static final long serialVersionUID = -3900031279027000108L;
	
	@JSONField(ordinal=1)
	private OrganizationKO FMaterialId; //物料编码
	
	@JSONField(ordinal=2)
	private float FRealQty; //实退数量
	
	@JSONField(ordinal=3)
	private OrganizationKO FStockId; //仓库
	
	public SalesReturnBillItemKO() {
		super();
	}

	public OrganizationKO getFMaterialId() {
		return FMaterialId;
	}

	public void setFMaterialId(OrganizationKO fMaterialId) {
		FMaterialId = fMaterialId;
	}

	public float getFRealQty() {
		return FRealQty;
	}

	public void setFRealQty(float fRealQty) {
		FRealQty = fRealQty;
	}

	public OrganizationKO getFStockId() {
		return FStockId;
	}

	public void setFStockId(OrganizationKO fStockId) {
		FStockId = fStockId;
	}

	public SalesReturnBillItemKO ptk(String no, float num, String stockId) {

		this.FMaterialId = new OrganizationKO(no);
		this.FRealQty = (float) Arith.div(num, 1000.0);
		this.FStockId = new OrganizationKO(stockId);
		
		return this;
	}

}
