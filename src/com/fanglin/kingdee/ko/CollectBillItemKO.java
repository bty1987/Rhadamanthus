/**
 * @File Name		: CollectBillItemKO.java
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

import com.fanglin.utils.Arith;

public class CollectBillItemKO implements Serializable {

	private static final long serialVersionUID = -6740226334629139538L;

	private OrganizationKO FPURPOSEID; //收款用途
	
	private OrganizationKO FSETTLETYPEID; //结算方式
	
	private long FRECTOTALAMOUNTFOR; //应收金额
	
	private OrganizationKO FACCOUNTID; //银行账号

	public CollectBillItemKO() {
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

	public long getFRECTOTALAMOUNTFOR() {
		return FRECTOTALAMOUNTFOR;
	}

	public void setFRECTOTALAMOUNTFOR(long fRECTOTALAMOUNTFOR) {
		FRECTOTALAMOUNTFOR = fRECTOTALAMOUNTFOR;
	}

	public OrganizationKO getFACCOUNTID() {
		return FACCOUNTID;
	}

	public void setFACCOUNTID(OrganizationKO fACCOUNTID) {
		FACCOUNTID = fACCOUNTID;
	}

	public CollectBillItemKO ptk(String purpose, String receiptType, long money, String bankNumber) {

		if (purpose != null) {
			this.FPURPOSEID = new OrganizationKO(purpose);
		}
		
		this.FSETTLETYPEID = new OrganizationKO(receiptType);
		this.FRECTOTALAMOUNTFOR = (long) Arith.div(money, 1000.0);
		
		if (bankNumber != null) {
			this.FACCOUNTID = new OrganizationKO(bankNumber);
		}

		return this;
	}

}
