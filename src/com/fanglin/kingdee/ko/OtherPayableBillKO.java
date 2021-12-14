/**
 * @File Name		: OtherPayableBill.java
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

import com.alibaba.fastjson.annotation.JSONField;
import com.fanglin.kingdee.handle.Bean;

public class OtherPayableBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = -3484866888399559931L;

	public static String FormId = "AP_OtherPayable"; //其他应付单
	
	@JSONField(ordinal=1)
	private String FDATE; //业务日期&收款日期
	
	@JSONField(ordinal=2)
	private OrganizationKO FBillTypeID; //单据类型
	
	@JSONField(ordinal=3)
	private String FCONTACTUNITTYPE; //往来单位类型
	
	@JSONField(ordinal=4)
	private OrganizationKO FCONTACTUNIT; //往来单位&单号
	
	@JSONField(ordinal=5)
	private OrganizationKO FSETTLEORGID; //结算组织
	
	@JSONField(ordinal=6)
	private OrganizationKO FPAYORGID; //付款组织
	
	@JSONField(ordinal=7)
	private OrganizationKO F_ORA_BASE; //客户
	
	@JSONField(ordinal=8)
	private OrganizationKO F_ORA_BASE1; //核算类别&等级
	
	@JSONField(ordinal=9)
	private OrganizationKO F_SFKD_BASE5; //工程款项类型
	
	@JSONField(ordinal=10)
	private List<OtherPayableBillItemKO> FENTITY; //明细
	
	public OtherPayableBillKO() {
		super();
		super.setFormId(FormId);
	}

	public String getFDATE() {
		return FDATE;
	}

	public void setFDATE(String fDATE) {
		FDATE = fDATE;
	}

	public OrganizationKO getFBillTypeID() {
		return FBillTypeID;
	}

	public void setFBillTypeID(OrganizationKO fBillTypeID) {
		FBillTypeID = fBillTypeID;
	}

	public String getFCONTACTUNITTYPE() {
		return FCONTACTUNITTYPE;
	}

	public void setFCONTACTUNITTYPE(String fCONTACTUNITTYPE) {
		FCONTACTUNITTYPE = fCONTACTUNITTYPE;
	}

	public OrganizationKO getFCONTACTUNIT() {
		return FCONTACTUNIT;
	}

	public void setFCONTACTUNIT(OrganizationKO fCONTACTUNIT) {
		FCONTACTUNIT = fCONTACTUNIT;
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

	public OrganizationKO getF_ORA_BASE() {
		return F_ORA_BASE;
	}

	public void setF_ORA_BASE(OrganizationKO f_ORA_BASE) {
		F_ORA_BASE = f_ORA_BASE;
	}

	public OrganizationKO getF_ORA_BASE1() {
		return F_ORA_BASE1;
	}

	public void setF_ORA_BASE1(OrganizationKO f_ORA_BASE1) {
		F_ORA_BASE1 = f_ORA_BASE1;
	}

	public OrganizationKO getF_SFKD_BASE5() {
		return F_SFKD_BASE5;
	}

	public void setF_SFKD_BASE5(OrganizationKO f_SFKD_BASE5) {
		F_SFKD_BASE5 = f_SFKD_BASE5;
	}

	public List<OtherPayableBillItemKO> getFENTITY() {
		return FENTITY;
	}

	public void setFENTITY(List<OtherPayableBillItemKO> fENTITY) {
		FENTITY = fENTITY;
	}

	public OtherPayableBillKO ptk(String collectTime, String billType, String orderId, String settleCompany, String payCompany,String grade, String paymentType, List<OtherPayableBillItemKO> items) {

		this.FDATE = collectTime;
		this.FBillTypeID = new OrganizationKO(billType);
		this.FCONTACTUNITTYPE = "BD_Customer";
		this.FCONTACTUNIT = new OrganizationKO(orderId);
		this.FSETTLEORGID = new OrganizationKO(settleCompany);
		this.FPAYORGID = new OrganizationKO(payCompany);
		this.F_ORA_BASE = new OrganizationKO(orderId);
		this.F_ORA_BASE1 = new OrganizationKO(grade);
		
		if (paymentType != null) {
			this.F_SFKD_BASE5 = new OrganizationKO(paymentType);
		}
		
		this.FENTITY = items;

		return this;
	}

}
