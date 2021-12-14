/**
 * @File Name		: RefundBillKO.java
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

public class RefundBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 4722581361857617242L;

	public static String FormId = "AR_REFUNDBILL"; //收款退款单
	
	@JSONField(ordinal=1)
	private String FDATE; //业务日期&收款日期
	
	@JSONField(ordinal=2)
	private OrganizationKO FBILLTYPEID; //单据类型
	
	@JSONField(ordinal=3)
	private OrganizationKO FSETTLEORGID; //结算组织
	
	@JSONField(ordinal=4)
	private String FCONTACTUNITTYPE; //往来单位类型
	
	@JSONField(ordinal=5)
	private String FRECTUNITTYPE; //收款单位类型
	
	@JSONField(ordinal=6)
	private OrganizationKO FCONTACTUNIT; //往来单位
	
	@JSONField(ordinal=7)
	private OrganizationKO FRECTUNIT; //收款单位
	
	@JSONField(ordinal=8)
	private OrganizationKO FPAYORGID; //付款组织
	
	@JSONField(ordinal=9)
	private OrganizationKO F_ORA_BASE; //核算类别
	
	@JSONField(ordinal=10)
	private OrganizationKO F_SFKD_GCKXLX; //款项类型
	
	@JSONField(ordinal=11)
	private List<RefundBillItemKO> FREFUNDBILLENTRY; //明细
	
	public RefundBillKO() {
		super();
		super.setFormId(FormId);
	}

	public String getFDATE() {
		return FDATE;
	}

	public void setFDATE(String fDATE) {
		FDATE = fDATE;
	}

	public OrganizationKO getFBILLTYPEID() {
		return FBILLTYPEID;
	}

	public void setFBILLTYPEID(OrganizationKO fBILLTYPEID) {
		FBILLTYPEID = fBILLTYPEID;
	}

	public OrganizationKO getFSETTLEORGID() {
		return FSETTLEORGID;
	}

	public void setFSETTLEORGID(OrganizationKO fSETTLEORGID) {
		FSETTLEORGID = fSETTLEORGID;
	}

	public String getFCONTACTUNITTYPE() {
		return FCONTACTUNITTYPE;
	}

	public void setFCONTACTUNITTYPE(String fCONTACTUNITTYPE) {
		FCONTACTUNITTYPE = fCONTACTUNITTYPE;
	}

	public String getFRECTUNITTYPE() {
		return FRECTUNITTYPE;
	}

	public void setFRECTUNITTYPE(String fRECTUNITTYPE) {
		FRECTUNITTYPE = fRECTUNITTYPE;
	}

	public OrganizationKO getFCONTACTUNIT() {
		return FCONTACTUNIT;
	}

	public void setFCONTACTUNIT(OrganizationKO fCONTACTUNIT) {
		FCONTACTUNIT = fCONTACTUNIT;
	}

	public OrganizationKO getFRECTUNIT() {
		return FRECTUNIT;
	}

	public void setFRECTUNIT(OrganizationKO fRECTUNIT) {
		FRECTUNIT = fRECTUNIT;
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

	public OrganizationKO getF_SFKD_GCKXLX() {
		return F_SFKD_GCKXLX;
	}

	public void setF_SFKD_GCKXLX(OrganizationKO f_SFKD_GCKXLX) {
		F_SFKD_GCKXLX = f_SFKD_GCKXLX;
	}

	public List<RefundBillItemKO> getFREFUNDBILLENTRY() {
		return FREFUNDBILLENTRY;
	}

	public void setFREFUNDBILLENTRY(List<RefundBillItemKO> fREFUNDBILLENTRY) {
		FREFUNDBILLENTRY = fREFUNDBILLENTRY;
	}

	public RefundBillKO ptk(String collectTime, String receiptType, String settleOrgid, String orderId, String payOrgid, String grade, String paymentType, List<RefundBillItemKO> items) {

		this.FDATE = collectTime;
		this.FBILLTYPEID = new OrganizationKO(receiptType);
		this.FSETTLEORGID = new OrganizationKO(settleOrgid);
		this.FCONTACTUNITTYPE = "BD_Customer";
		this.FRECTUNITTYPE = "BD_Customer";
		this.FCONTACTUNIT = new OrganizationKO(orderId);
		this.FRECTUNIT = new OrganizationKO(orderId);
		this.FPAYORGID = new OrganizationKO(payOrgid);
		this.F_ORA_BASE = new OrganizationKO(grade);
		
		if (paymentType != null) {
			this.F_SFKD_GCKXLX = new OrganizationKO(paymentType);
		}
		
		this.FREFUNDBILLENTRY = items;
		
		return this;
	}

}
