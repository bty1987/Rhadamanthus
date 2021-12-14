/**
 * @File Name		: PayBillKO.java
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

public class PayBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 7829721958379709823L;

	public static String FormId = "AP_PAYBILL"; //付款单

	private OrganizationKO FBillTypeID; //单据类型
	
	private String FDATE; //业务日期
	
	private String FCONTACTUNITTYPE; //往来单位类型
	
	private OrganizationKO FCONTACTUNIT; //往来单位
	
	private String FRECTUNITTYPE; //收款单位类型
	
	private OrganizationKO FRECTUNIT; //收款单位
	
	private OrganizationKO FPAYORGID; //付款组织
	
	private OrganizationKO FSETTLEORGID; //结算组织
	
	private OrganizationKO F_ORA_BASE; //核算类别
	
	private OrganizationKO F_SFKD_Base; //品牌 
	
	private List<PayBillItemKO> FPAYBILLENTRY; //明细

	public PayBillKO() {
		super();
		super.setFormId(FormId);
	}

	public OrganizationKO getFBillTypeID() {
		return FBillTypeID;
	}

	public void setFBillTypeID(OrganizationKO fBillTypeID) {
		FBillTypeID = fBillTypeID;
	}

	public String getFDATE() {
		return FDATE;
	}

	public void setFDATE(String fDATE) {
		FDATE = fDATE;
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

	public String getFRECTUNITTYPE() {
		return FRECTUNITTYPE;
	}

	public void setFRECTUNITTYPE(String fRECTUNITTYPE) {
		FRECTUNITTYPE = fRECTUNITTYPE;
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

	public OrganizationKO getFSETTLEORGID() {
		return FSETTLEORGID;
	}

	public void setFSETTLEORGID(OrganizationKO fSETTLEORGID) {
		FSETTLEORGID = fSETTLEORGID;
	}

	public OrganizationKO getF_ORA_BASE() {
		return F_ORA_BASE;
	}

	public void setF_ORA_BASE(OrganizationKO f_ORA_BASE) {
		F_ORA_BASE = f_ORA_BASE;
	}

	public OrganizationKO getF_SFKD_Base() {
		return F_SFKD_Base;
	}

	public void setF_SFKD_Base(OrganizationKO f_SFKD_Base) {
		F_SFKD_Base = f_SFKD_Base;
	}

	public List<PayBillItemKO> getFPAYBILLENTRY() {
		return FPAYBILLENTRY;
	}

	public void setFPAYBILLENTRY(List<PayBillItemKO> fPAYBILLENTRY) {
		FPAYBILLENTRY = fPAYBILLENTRY;
	}

	public PayBillKO ptk(String billType, String collectTime, String orderId, String grade, String brand, List<PayBillItemKO> item) {

		this.FBillTypeID = new OrganizationKO(billType);
		this.FDATE = collectTime;
		this.FCONTACTUNITTYPE = "BD_Customer";
		this.FCONTACTUNIT = new OrganizationKO(orderId);
		this.FRECTUNITTYPE = "BD_Customer";
		this.FRECTUNIT = new OrganizationKO(orderId);
		this.FPAYORGID = new OrganizationKO("100.01");
		this.FSETTLEORGID = new OrganizationKO("100.01");
		this.F_ORA_BASE = new OrganizationKO(grade);
		
		if (brand != null) {
			this.F_SFKD_Base = new OrganizationKO(brand);
		}
		
		this.FPAYBILLENTRY = item;

		return this;
	}

}
