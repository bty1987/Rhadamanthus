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

import com.fanglin.kingdee.handle.Bean;

public class CollectBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 2542381112473316740L;

	public static String FormId = "AR_RECEIVEBILL";
	
	private String FDATE; //业务日期&收款日期
	
	private OrganizationKO FCONTACTUNIT; //往来单位&单号
	
	private OrganizationKO FPAYORGID; //收款组织&款项公司
	
	private OrganizationKO FSETTLEORGID; //结算组织
	
	private OrganizationKO F_SFKD_Hslb; //核算类别&等级
	
	private OrganizationKO F_SFKD_Kxlx; //款项类型
	
	private OrganizationKO F_SFKD_Skfs ; //收款方式
	
	private List<CollectBillItemKO> FRECEIVEBILLENTRY; //明细
	
	public CollectBillKO() {
		super();
		super.setFormId(FormId);
	}

	public CollectBillKO(OrganizationKO fCONTACTUNIT, OrganizationKO fPAYORGID, OrganizationKO fSETTLEORGID, OrganizationKO f_SFKD_Hslb, OrganizationKO f_SFKD_Kxlx, OrganizationKO f_SFKD_Skfs, List<CollectBillItemKO> fRECEIVEBILLENTRY) {
		super();
		super.setFormId(FormId);
		FCONTACTUNIT = fCONTACTUNIT;
		FPAYORGID = fPAYORGID;
		FSETTLEORGID = fSETTLEORGID;
		F_SFKD_Hslb = f_SFKD_Hslb;
		F_SFKD_Kxlx = f_SFKD_Kxlx;
		F_SFKD_Skfs = f_SFKD_Skfs;
		FRECEIVEBILLENTRY = fRECEIVEBILLENTRY;
	}

	public String getFDATE() {
		return FDATE;
	}

	public void setFDATE(String fDATE) {
		FDATE = fDATE;
	}

	public OrganizationKO getFCONTACTUNIT() {
		return FCONTACTUNIT;
	}

	public void setFCONTACTUNIT(OrganizationKO fCONTACTUNIT) {
		FCONTACTUNIT = fCONTACTUNIT;
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

	public OrganizationKO getF_SFKD_Kxlx() {
		return F_SFKD_Kxlx;
	}

	public void setF_SFKD_Kxlx(OrganizationKO f_SFKD_Kxlx) {
		F_SFKD_Kxlx = f_SFKD_Kxlx;
	}

	public OrganizationKO getF_SFKD_Skfs() {
		return F_SFKD_Skfs;
	}

	public void setF_SFKD_Skfs(OrganizationKO f_SFKD_Skfs) {
		F_SFKD_Skfs = f_SFKD_Skfs;
	}

	public List<CollectBillItemKO> getFRECEIVEBILLENTRY() {
		return FRECEIVEBILLENTRY;
	}

	public void setFRECEIVEBILLENTRY(List<CollectBillItemKO> fRECEIVEBILLENTRY) {
		FRECEIVEBILLENTRY = fRECEIVEBILLENTRY;
	}

	public CollectBillKO ptk(String paymentName, String collectTime, String orderId, String payOrgid, String settleOrgid, String grade, String paymentType, String collectType, List<CollectBillItemKO> items) {

		this.FDATE = collectTime;
		this.FCONTACTUNIT = new OrganizationKO(orderId);
		this.FPAYORGID = new OrganizationKO(payOrgid);
		
		if (FSETTLEORGID != null) {
			this.FSETTLEORGID = new OrganizationKO(settleOrgid);
		}
		
		this.F_SFKD_Hslb = new OrganizationKO(grade);
		this.F_SFKD_Kxlx = new OrganizationKO(paymentType);
		
		if (paymentName.equals("advance") && collectType != null) {
			this.F_SFKD_Skfs = new OrganizationKO(collectType);
		}
		
		this.FRECEIVEBILLENTRY = items;

		return this;
	}

}
