/**
 * @File Name		: OtherReceivableBillKO.java
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

public class OtherReceivableBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = -9109650512478719938L;

	public static String FormId = "AR_OtherRecAble";
	
	private String FDATE; //业务日期&收款日期
	
	private String FCONTACTUNITTYPE; //往来单位类型
	
	private OrganizationKO FCONTACTUNIT; //往来单位&单号
	
	private OrganizationKO F_ORA_BASE; //客户
	
	private OrganizationKO FSETTLEORGID; //结算组织
	
	private OrganizationKO F_ORA_BASE3; //核算类别&等级
	
	private OrganizationKO F_ORA_ASSISTANT1; //工程款项类型
	
	private OrganizationKO F_ORA_BASE2; //主材款项类型
	
	private List<OtherReceivableBillItemKO> FENTITY; //明细
	
	public OtherReceivableBillKO() {
		super();
		super.setFormId(FormId);
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

	public OrganizationKO getF_ORA_BASE() {
		return F_ORA_BASE;
	}

	public void setF_ORA_BASE(OrganizationKO f_ORA_BASE) {
		F_ORA_BASE = f_ORA_BASE;
	}

	public OrganizationKO getFSETTLEORGID() {
		return FSETTLEORGID;
	}

	public void setFSETTLEORGID(OrganizationKO fSETTLEORGID) {
		FSETTLEORGID = fSETTLEORGID;
	}

	public OrganizationKO getF_ORA_BASE3() {
		return F_ORA_BASE3;
	}

	public void setF_ORA_BASE3(OrganizationKO f_ORA_BASE3) {
		F_ORA_BASE3 = f_ORA_BASE3;
	}

	public OrganizationKO getF_ORA_ASSISTANT1() {
		return F_ORA_ASSISTANT1;
	}

	public void setF_ORA_ASSISTANT1(OrganizationKO f_ORA_ASSISTANT1) {
		F_ORA_ASSISTANT1 = f_ORA_ASSISTANT1;
	}

	public OrganizationKO getF_ORA_BASE2() {
		return F_ORA_BASE2;
	}

	public void setF_ORA_BASE2(OrganizationKO f_ORA_BASE2) {
		F_ORA_BASE2 = f_ORA_BASE2;
	}

	public List<OtherReceivableBillItemKO> getFENTITY() {
		return FENTITY;
	}

	public void setFENTITY(List<OtherReceivableBillItemKO> fENTITY) {
		FENTITY = fENTITY;
	}

	public OtherReceivableBillKO ptk(String collectTime, String orderId, String settleOrgid, String grade, String decorationType, String salesType, List<OtherReceivableBillItemKO> items) {

		this.FDATE = collectTime;
		this.FCONTACTUNITTYPE = "BD_Customer";
		this.FCONTACTUNIT = new OrganizationKO(orderId);;
		this.F_ORA_BASE = new OrganizationKO(orderId);;
		
		if (settleOrgid != null) {
			this.FSETTLEORGID = new OrganizationKO(settleOrgid);
		}
		this.F_ORA_BASE3 = new OrganizationKO(grade);
		
		if (decorationType != null) {
			this.F_ORA_ASSISTANT1 = new OrganizationKO(decorationType);;
		}
		
		if (salesType != null) {
			this.F_ORA_BASE2 = new OrganizationKO(salesType);;
		}
		
		this.FENTITY = items;

		return this;
	}

}
