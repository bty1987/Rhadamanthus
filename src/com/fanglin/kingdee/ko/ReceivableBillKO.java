/**
 * @File Name		: ReceivableBillKO.java
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
import java.util.List;

import com.fanglin.kingdee.handle.Bean;

public class ReceivableBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = -1375258356845757425L;

	public static String FormId = "AR_receivable";
	
	private String FDATE; //业务日期&收款日期
	
	private OrganizationKO FCUSTOMERID; //客户&单号
	
	private OrganizationKO FSETTLEORGID; //结算组织
	
	private OrganizationKO FPAYORGID; //收款组织&款项公司
	
	private OrganizationKO F_ORA_BASE1; //核算类别&等级
	
	private OrganizationKO F_ORA_ASSISTANT; //款项类型
	
	private List<ReceivableBillItemKO> FENTITYDETAIL; //明细
	
	public ReceivableBillKO() {
		super();
		super.setFormId(FormId);
	}

	public String getFDATE() {
		return FDATE;
	}

	public void setFDATE(String fDATE) {
		FDATE = fDATE;
	}

	public OrganizationKO getFCUSTOMERID() {
		return FCUSTOMERID;
	}

	public void setFCUSTOMERID(OrganizationKO fCUSTOMERID) {
		FCUSTOMERID = fCUSTOMERID;
	}

	public OrganizationKO getFSETTLEORGID() {
		return FSETTLEORGID;
	}

	public void setFSETTLEORGID(OrganizationKO fSETTLEORGID) {
		FSETTLEORGID = fSETTLEORGID;
	}

	public OrganizationKO getFPAYORGID() {
		return FPAYORGID;
	}

	public void setFPAYORGID(OrganizationKO fPAYORGID) {
		FPAYORGID = fPAYORGID;
	}

	public OrganizationKO getF_ORA_BASE1() {
		return F_ORA_BASE1;
	}

	public void setF_ORA_BASE1(OrganizationKO f_ORA_BASE1) {
		F_ORA_BASE1 = f_ORA_BASE1;
	}

	public OrganizationKO getF_ORA_ASSISTANT() {
		return F_ORA_ASSISTANT;
	}

	public void setF_ORA_ASSISTANT(OrganizationKO f_ORA_ASSISTANT) {
		F_ORA_ASSISTANT = f_ORA_ASSISTANT;
	}

	public List<ReceivableBillItemKO> getFENTITYDETAIL() {
		return FENTITYDETAIL;
	}

	public void setFENTITYDETAIL(List<ReceivableBillItemKO> fENTITYDETAIL) {
		FENTITYDETAIL = fENTITYDETAIL;
	}

	public ReceivableBillKO ptk(String collectTime, String orderId, String settleOrgid, String payOrgid, String grade, String paymentType, List<ReceivableBillItemKO> items) {

		this.FDATE = collectTime;
		this.FCUSTOMERID = new OrganizationKO(orderId);;
		
		if (settleOrgid != null) {
			this.FSETTLEORGID = new OrganizationKO(settleOrgid);
		}
		
		this.FPAYORGID = new OrganizationKO(payOrgid);
		this.F_ORA_BASE1 = new OrganizationKO(grade);
		this.F_ORA_ASSISTANT = new OrganizationKO(paymentType);
		this.FENTITYDETAIL = items;

		return this;
	}

}
