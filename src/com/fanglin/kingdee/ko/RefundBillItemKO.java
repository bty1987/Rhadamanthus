package com.fanglin.kingdee.ko;

import java.io.Serializable;

public class RefundBillItemKO implements Serializable {

	private static final long serialVersionUID = 5004287182660562807L;
	
	private OrganizationKO FSETTLETYPEID; //结算方式
	
	private OrganizationKO FPURPOSEID; //原收款用途
	
	private long FREFUNDAMOUNTFOR; //应退金额
	
	private OrganizationKO FACCOUNTID; //我方银行账号
	
	private String FNOTE; //备注

	public RefundBillItemKO() {
		super();
	}

	public OrganizationKO getFSETTLETYPEID() {
		return FSETTLETYPEID;
	}

	public void setFSETTLETYPEID(OrganizationKO fSETTLETYPEID) {
		FSETTLETYPEID = fSETTLETYPEID;
	}

	public OrganizationKO getFPURPOSEID() {
		return FPURPOSEID;
	}

	public void setFPURPOSEID(OrganizationKO fPURPOSEID) {
		FPURPOSEID = fPURPOSEID;
	}

	public long getFREFUNDAMOUNTFOR() {
		return FREFUNDAMOUNTFOR;
	}

	public void setFREFUNDAMOUNTFOR(long fREFUNDAMOUNTFOR) {
		FREFUNDAMOUNTFOR = fREFUNDAMOUNTFOR;
	}

	public OrganizationKO getFACCOUNTID() {
		return FACCOUNTID;
	}

	public void setFACCOUNTID(OrganizationKO fACCOUNTID) {
		FACCOUNTID = fACCOUNTID;
	}

	public String getFNOTE() {
		return FNOTE;
	}

	public void setFNOTE(String fNOTE) {
		FNOTE = fNOTE;
	}

	public RefundBillItemKO ptk(String settleType, String purpose, long money, String bankNo, String comment) {
		
		this.FSETTLETYPEID = new OrganizationKO(settleType);
		this.FPURPOSEID = new OrganizationKO(purpose);
		this.FREFUNDAMOUNTFOR = money;
		
		if (bankNo != null) {
			this.FACCOUNTID = new OrganizationKO(bankNo);
		}
		
		this.FNOTE = comment;
		
		return this;
	}

}
