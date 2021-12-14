package com.fanglin.kingdee.ko;

import java.io.Serializable;

public class ReceivableBillItemKO implements Serializable {

	private static final long serialVersionUID = -4271255584586648134L;
	
	private OrganizationKO FCOSTID; //费用项目编码
	
	private short FPriceQty; //计价数量 1:装修类固定为1
	
	private long FTaxPrice; //含税单价
	
	public ReceivableBillItemKO() {
		super();
	}

	public OrganizationKO getFCOSTID() {
		return FCOSTID;
	}

	public void setFCOSTID(OrganizationKO fCOSTID) {
		FCOSTID = fCOSTID;
	}

	public short getFPriceQty() {
		return FPriceQty;
	}

	public void setFPriceQty(short fPriceQty) {
		FPriceQty = fPriceQty;
	}

	public long getFTaxPrice() {
		return FTaxPrice;
	}

	public void setFTaxPrice(long fTaxPrice) {
		FTaxPrice = fTaxPrice;
	}

	public ReceivableBillItemKO ptk(String costName, long money) {

		this.FCOSTID = new OrganizationKO(costName);;
		this.FPriceQty = 1;
		this.FTaxPrice = money;
		
		return this;
	}

}
