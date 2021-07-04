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

import com.fanglin.kingdee.handle.Bean;

public class OtherPayableBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = -3484866888399559931L;

	public static String FormId = "AP_OtherPayable";
	
	private String FDATE; //业务日期&收款日期
	
	private String FCONTACTUNITTYPE; //往来单位类型
	
	private OrganizationKO FCONTACTUNIT; //往来单位&单号
	
	private OrganizationKO F_ora_Base; //客户
	
	private OrganizationKO F_SFKD_Hslb; //核算类别&等级
	
	private List<OtherPayableBillItemKO> FEntity; //明细
	
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

	public OrganizationKO getF_ora_Base() {
		return F_ora_Base;
	}

	public void setF_ora_Base(OrganizationKO f_ora_Base) {
		F_ora_Base = f_ora_Base;
	}

	public OrganizationKO getF_SFKD_Hslb() {
		return F_SFKD_Hslb;
	}

	public void setF_SFKD_Hslb(OrganizationKO f_SFKD_Hslb) {
		F_SFKD_Hslb = f_SFKD_Hslb;
	}

	public List<OtherPayableBillItemKO> getFEntity() {
		return FEntity;
	}

	public void setFEntity(List<OtherPayableBillItemKO> fEntity) {
		FEntity = fEntity;
	}

	public OtherPayableBillKO ptk(String collectTime, String orderId, String grade, List<OtherPayableBillItemKO> items) {

		this.FDATE = collectTime;
		this.FCONTACTUNITTYPE = "BD_Customer";
		this.FCONTACTUNIT = new OrganizationKO(orderId);
		this.F_ora_Base = new OrganizationKO(orderId);
		this.F_SFKD_Hslb = new OrganizationKO(grade);
		this.FEntity = items;

		return this;
	}

}
