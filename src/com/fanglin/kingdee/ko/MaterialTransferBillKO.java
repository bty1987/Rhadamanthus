/**
 * @File Name		: MaterialTransferBillKO.java
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
import java.util.Random;

import com.fanglin.kingdee.handle.Bean;

public class MaterialTransferBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 2244498780036057976L;

	public static String FormId = "SFKD_ZhuCaiZhuanKuanBill";

	private String FBillNo; //单据编号
	
	private String F_SFKD_Date; //业务日期
	
	private String F_SFKD_WangLaiUnitType; //往来单位类型
	
	private String F_SFKD_PayUnitType; //付款单位类型
	
	private OrganizationKO F_SFKD_ABC; //核算类别
	
	private OrganizationKO F_SFKD_RecOrgId; //收款组织
	
	private OrganizationKO F_SFKD_SaleOrgId; //销售组织
	
	private OrganizationKO F_ora_Base; //客户
	
	private OrganizationKO F_ora_Base1; //款项类型
	
	private List<MaterialTransferBillItemKO> FEntity; //单据体明细

	public MaterialTransferBillKO() {
		super();
		super.setFormId(FormId);
	}

	public String getFBillNo() {
		return FBillNo;
	}

	public void setFBillNo(String fBillNo) {
		FBillNo = fBillNo;
	}

	public String getF_SFKD_Date() {
		return F_SFKD_Date;
	}

	public void setF_SFKD_Date(String f_SFKD_Date) {
		F_SFKD_Date = f_SFKD_Date;
	}

	public String getF_SFKD_WangLaiUnitType() {
		return F_SFKD_WangLaiUnitType;
	}

	public void setF_SFKD_WangLaiUnitType(String f_SFKD_WangLaiUnitType) {
		F_SFKD_WangLaiUnitType = f_SFKD_WangLaiUnitType;
	}

	public String getF_SFKD_PayUnitType() {
		return F_SFKD_PayUnitType;
	}

	public void setF_SFKD_PayUnitType(String f_SFKD_PayUnitType) {
		F_SFKD_PayUnitType = f_SFKD_PayUnitType;
	}

	public OrganizationKO getF_SFKD_ABC() {
		return F_SFKD_ABC;
	}

	public void setF_SFKD_ABC(OrganizationKO f_SFKD_ABC) {
		F_SFKD_ABC = f_SFKD_ABC;
	}

	public OrganizationKO getF_SFKD_RecOrgId() {
		return F_SFKD_RecOrgId;
	}

	public void setF_SFKD_RecOrgId(OrganizationKO f_SFKD_RecOrgId) {
		F_SFKD_RecOrgId = f_SFKD_RecOrgId;
	}

	public OrganizationKO getF_SFKD_SaleOrgId() {
		return F_SFKD_SaleOrgId;
	}

	public void setF_SFKD_SaleOrgId(OrganizationKO f_SFKD_SaleOrgId) {
		F_SFKD_SaleOrgId = f_SFKD_SaleOrgId;
	}

	public OrganizationKO getF_ora_Base() {
		return F_ora_Base;
	}

	public void setF_ora_Base(OrganizationKO f_ora_Base) {
		F_ora_Base = f_ora_Base;
	}

	public OrganizationKO getF_ora_Base1() {
		return F_ora_Base1;
	}

	public void setF_ora_Base1(OrganizationKO f_ora_Base1) {
		F_ora_Base1 = f_ora_Base1;
	}

	public List<MaterialTransferBillItemKO> getFEntity() {
		return FEntity;
	}

	public void setFEntity(List<MaterialTransferBillItemKO> fEntity) {
		FEntity = fEntity;
	}

	public MaterialTransferBillKO ptk(String collectTime, String grade, String orderId, String paymentType, List<MaterialTransferBillItemKO> item) {

		this.FBillNo = String.valueOf(new Random().nextInt(999999999));
		this.F_SFKD_Date = collectTime;
		this.F_SFKD_WangLaiUnitType = "BD_Customer";
		this.F_SFKD_PayUnitType = "BD_Customer";
		this.F_SFKD_ABC = new OrganizationKO(grade);
		this.F_SFKD_RecOrgId = new OrganizationKO("100.01");
		this.F_SFKD_SaleOrgId = new OrganizationKO("100.01");
		this.F_ora_Base = new OrganizationKO(orderId);
		this.F_ora_Base1 = new OrganizationKO(paymentType);
		this.FEntity = item;

		return this;
	}

}
