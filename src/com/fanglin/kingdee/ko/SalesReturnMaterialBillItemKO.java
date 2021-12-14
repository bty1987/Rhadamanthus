package com.fanglin.kingdee.ko;

import java.io.Serializable;

import com.fanglin.utils.Arith;

public class SalesReturnMaterialBillItemKO implements Serializable {

	private static final long serialVersionUID = -5753567219966494996L;
	
	private OrganizationKO FPRICEUNITID; //计价单位
	
	private OrganizationKO FUNITID; //库存单位
	
	private OrganizationKO FCARRYUNITID; //采购单位
	
	private OrganizationKO FMATERIALID; //物料编码
	
	private OrganizationKO FSTOCKID; //仓库
	
	private int FRMREALQTY; //实退数量

	public SalesReturnMaterialBillItemKO() {
		super();
	}

	public OrganizationKO getFPRICEUNITID() {
		return FPRICEUNITID;
	}

	public void setFPRICEUNITID(OrganizationKO fPRICEUNITID) {
		FPRICEUNITID = fPRICEUNITID;
	}

	public OrganizationKO getFUNITID() {
		return FUNITID;
	}

	public void setFUNITID(OrganizationKO fUNITID) {
		FUNITID = fUNITID;
	}

	public OrganizationKO getFCARRYUNITID() {
		return FCARRYUNITID;
	}

	public void setFCARRYUNITID(OrganizationKO fCARRYUNITID) {
		FCARRYUNITID = fCARRYUNITID;
	}

	public OrganizationKO getFMATERIALID() {
		return FMATERIALID;
	}

	public void setFMATERIALID(OrganizationKO fMATERIALID) {
		FMATERIALID = fMATERIALID;
	}

	public OrganizationKO getFSTOCKID() {
		return FSTOCKID;
	}

	public void setFSTOCKID(OrganizationKO fSTOCKID) {
		FSTOCKID = fSTOCKID;
	}

	public int getFRMREALQTY() {
		return FRMREALQTY;
	}

	public void setFRMREALQTY(int fRMREALQTY) {
		FRMREALQTY = fRMREALQTY;
	}

	public SalesReturnMaterialBillItemKO ptk(String priceUnitNo, String unitNo, String purchaseCompany, String materialNo, String stockNo, int num) {
		
		this.FPRICEUNITID = new OrganizationKO(priceUnitNo);
		this.FUNITID = new OrganizationKO(unitNo);
		this.FCARRYUNITID = new OrganizationKO(purchaseCompany);
		this.FMATERIALID = new OrganizationKO(materialNo);
		this.FSTOCKID = new OrganizationKO(stockNo);
		this.FRMREALQTY = (int) Arith.div(num, 1000.0);
		
		return this;
		
	}

}
