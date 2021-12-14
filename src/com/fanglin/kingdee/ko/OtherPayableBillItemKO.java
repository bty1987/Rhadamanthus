package com.fanglin.kingdee.ko;

import java.io.Serializable;

public class OtherPayableBillItemKO  implements Serializable {

	private static final long serialVersionUID = 8318941395547064719L;
	
	private OrganizationKO FCOSTID; //费用项目编码
	
	private OrganizationKO FCOSTDEPARTMENTID; //费用承担部门
	
	private long FNOTAXAMOUNTFOR; //不含税金额
	
	private long FTAXAMOUNTFOR; //税额

	public OtherPayableBillItemKO() {
		super();
	}

	public OrganizationKO getFCOSTID() {
		return FCOSTID;
	}

	public void setFCOSTID(OrganizationKO fCOSTID) {
		FCOSTID = fCOSTID;
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
	
	public OtherPayableBillItemKO ptk(String costId, String costDept, long notTaxMoney, long taxMoney) {
		
		if (costId != null) {
			this.FCOSTID = new OrganizationKO(costId);
		}
		
		this.FCOSTDEPARTMENTID = new OrganizationKO(costDept);
		
		if (notTaxMoney > 0) {
			this.FNOTAXAMOUNTFOR = notTaxMoney;
		}
		
		if (taxMoney > 0) {
			this.FTAXAMOUNTFOR = taxMoney;
		}
		
		return this;
	}

}
