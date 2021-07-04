package com.fanglin.kingdee.ko;

import java.io.Serializable;

public class OtherReceivableBillItemKO implements Serializable {

	private static final long serialVersionUID = -278840821430378148L;
	
	private OrganizationKO FCOSTDEPARTMENTID; //费用承担部门
	
	private long FNOTAXAMOUNTFOR; //不含税金额
	
	private long FTAXAMOUNTFOR; //税额

	public OtherReceivableBillItemKO() {
		super();
	}

	public OtherReceivableBillItemKO(OrganizationKO fCOSTDEPARTMENTID, long fNOTAXAMOUNTFOR, long fTAXAMOUNTFOR) {
		super();
		FCOSTDEPARTMENTID = fCOSTDEPARTMENTID;
		FNOTAXAMOUNTFOR = fNOTAXAMOUNTFOR;
		FTAXAMOUNTFOR = fTAXAMOUNTFOR;
	}

	public OrganizationKO getFCOSTDEPARTMENTID() {
		return FCOSTDEPARTMENTID;
	}

	public void setFCOSTDEPARTMENTID(OrganizationKO fCOSTDEPARTMENTID) {
		FCOSTDEPARTMENTID = fCOSTDEPARTMENTID;
	}

	public long getFNOTAXAMOUNTFOR() {
		return FNOTAXAMOUNTFOR;
	}

	public void setFNOTAXAMOUNTFOR(long fNOTAXAMOUNTFOR) {
		FNOTAXAMOUNTFOR = fNOTAXAMOUNTFOR;
	}

	public long getFTAXAMOUNTFOR() {
		return FTAXAMOUNTFOR;
	}

	public void setFTAXAMOUNTFOR(long fTAXAMOUNTFOR) {
		FTAXAMOUNTFOR = fTAXAMOUNTFOR;
	}

}
