package com.fanglin.kingdee.ko;

import java.io.Serializable;

public class PayBillItemKO implements Serializable {

	private static final long serialVersionUID = -4700851126742220555L;
	
	private OrganizationKO FPURPOSEID; //付款用途
	
	private OrganizationKO FSETTLETYPEID; //结算方式
	
	private long FPAYTOTALAMOUNTFOR; //应付金额
	
	private OrganizationKO FACCOUNTID; //银行账号

	public PayBillItemKO() {
		super();
	}

	public OrganizationKO getFPURPOSEID() {
		return FPURPOSEID;
	}

	public void setFPURPOSEID(OrganizationKO fPURPOSEID) {
		FPURPOSEID = fPURPOSEID;
	}

	public OrganizationKO getFSETTLETYPEID() {
		return FSETTLETYPEID;
	}

	public void setFSETTLETYPEID(OrganizationKO fSETTLETYPEID) {
		FSETTLETYPEID = fSETTLETYPEID;
	}

	public long getFPAYTOTALAMOUNTFOR() {
		return FPAYTOTALAMOUNTFOR;
	}

	public void setFPAYTOTALAMOUNTFOR(long fPAYTOTALAMOUNTFOR) {
		FPAYTOTALAMOUNTFOR = fPAYTOTALAMOUNTFOR;
	}

	public OrganizationKO getFACCOUNTID() {
		return FACCOUNTID;
	}

	public void setFACCOUNTID(OrganizationKO fACCOUNTID) {
		FACCOUNTID = fACCOUNTID;
	}
	
	public PayBillItemKO ptk(String purpose, String payWay, long money, String bankInfo) {
		
		this.FPURPOSEID = new OrganizationKO(purpose);
		this.FSETTLETYPEID = new OrganizationKO(payWay);
		this.FPAYTOTALAMOUNTFOR = money;
		
		if (bankInfo != null) {
			this.FACCOUNTID = new OrganizationKO(bankInfo);
		}
		
		return this;
		
	}

}
