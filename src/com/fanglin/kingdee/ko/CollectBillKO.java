/**
 * @File Name		: CollectBillKO.java
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

public class CollectBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 2542381112473316740L;

	public static String FormId = "AR_RECEIVEBILL"; //收款单
	
	@JSONField(ordinal=1)
	private String FDATE; //业务日期&收款日期
	
	@JSONField(ordinal=2)
	private OrganizationKO FBillTypeID; //单据类型
	
	@JSONField(ordinal=3)
	private String FCONTACTUNITTYPE; //往来单位类型
	
	@JSONField(ordinal=4)
	private OrganizationKO FCONTACTUNIT; //往来单位&单号
	
	@JSONField(ordinal=5)
	private String FPAYUNITTYPE; //付款单位类型
	
	@JSONField(ordinal=6)
	private OrganizationKO FPAYUNIT; //付款单位
	
	@JSONField(ordinal=7)
	private OrganizationKO FPAYORGID; //收款组织&款项公司
	
	@JSONField(ordinal=8)
	private OrganizationKO FSETTLEORGID; //结算组织
	
	@JSONField(ordinal=9)
	private OrganizationKO F_SFKD_Hslb; //核算类别&等级
	
	@JSONField(ordinal=10)
	private OrganizationKO F_SFKD_Base; //款项类型
	
	@JSONField(ordinal=11)
	private String FREMARK ; //备注
	
	@JSONField(ordinal=12)
	private List<CollectBillItemKO> FRECEIVEBILLENTRY; //明细
	
	public CollectBillKO() {
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

	public String getFPAYUNITTYPE() {
		return FPAYUNITTYPE;
	}

	public void setFPAYUNITTYPE(String fPAYUNITTYPE) {
		FPAYUNITTYPE = fPAYUNITTYPE;
	}

	public OrganizationKO getFPAYUNIT() {
		return FPAYUNIT;
	}

	public void setFPAYUNIT(OrganizationKO fPAYUNIT) {
		FPAYUNIT = fPAYUNIT;
	}

	public OrganizationKO getFPAYORGID() {
		return FPAYORGID;
	}

	public void setFPAYORGID(OrganizationKO fPAYORGID) {
		FPAYORGID = fPAYORGID;
	}

	public OrganizationKO getFSETTLEORGID() {
		return FSETTLEORGID;
	}

	public void setFSETTLEORGID(OrganizationKO fSETTLEORGID) {
		FSETTLEORGID = fSETTLEORGID;
	}

	public OrganizationKO getF_SFKD_Hslb() {
		return F_SFKD_Hslb;
	}

	public void setF_SFKD_Hslb(OrganizationKO f_SFKD_Hslb) {
		F_SFKD_Hslb = f_SFKD_Hslb;
	}

	public OrganizationKO getF_SFKD_Base() {
		return F_SFKD_Base;
	}

	public void setF_SFKD_Base(OrganizationKO f_SFKD_Base) {
		F_SFKD_Base = f_SFKD_Base;
	}

	public String getFREMARK() {
		return FREMARK;
	}

	public void setFREMARK(String fREMARK) {
		FREMARK = fREMARK;
	}

	public List<CollectBillItemKO> getFRECEIVEBILLENTRY() {
		return FRECEIVEBILLENTRY;
	}

	public void setFRECEIVEBILLENTRY(List<CollectBillItemKO> fRECEIVEBILLENTRY) {
		FRECEIVEBILLENTRY = fRECEIVEBILLENTRY;
	}

	public CollectBillKO ptk(String collectTime, String receiptType, String orderId, String payOrgid, String settleOrgid, String grade, String paymentType, String comment, List<CollectBillItemKO> items) {

		this.FDATE = collectTime;
		this.FBillTypeID = new OrganizationKO(receiptType);
		this.FCONTACTUNITTYPE = "BD_Customer";
		this.FCONTACTUNIT = new OrganizationKO(orderId);
		this.FPAYUNITTYPE = "BD_Customer";
		this.FPAYUNIT = new OrganizationKO(orderId);
		this.FPAYORGID = new OrganizationKO(payOrgid);
		this.FSETTLEORGID = new OrganizationKO(settleOrgid);
		this.F_SFKD_Hslb = new OrganizationKO(grade);
		
		if (paymentType != null) {
			this.F_SFKD_Base = new OrganizationKO(paymentType);
		}
		
		this.FREMARK= comment;
		this.FRECEIVEBILLENTRY = items;

		return this;
	}

}
