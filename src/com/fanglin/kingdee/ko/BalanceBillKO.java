/**
 * @File Name		: BalanceBillKO.java
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

public class BalanceBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = -2682372836546070818L;

	public static String FormId = "SFKD_JieSuanBill";

	private String FBillNo; //单据编号
	
	private String F_SFKD_Date; //业务日期
	
	private OrganizationKO F_SFKD_ABC; //核算类别
	
	private OrganizationKO F_SFKD_OrgId; //款项组织
	
	private OrganizationKO F_SFKD_OrgId1; //结算组织
	
	private OrganizationKO F_SFKD_Brand; //品牌
	
	private OrganizationKO F_SFKD_Supplier; //供应商
	
	private String F_SFKD_SaleBillNo; //结算单号 
	
	private List<BalanceBillItemKO> FPAYBILLENTRY; //明细

	public BalanceBillKO() {
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

	public OrganizationKO getF_SFKD_ABC() {
		return F_SFKD_ABC;
	}

	public void setF_SFKD_ABC(OrganizationKO f_SFKD_ABC) {
		F_SFKD_ABC = f_SFKD_ABC;
	}

	public OrganizationKO getF_SFKD_OrgId() {
		return F_SFKD_OrgId;
	}

	public void setF_SFKD_OrgId(OrganizationKO f_SFKD_OrgId) {
		F_SFKD_OrgId = f_SFKD_OrgId;
	}

	public OrganizationKO getF_SFKD_OrgId1() {
		return F_SFKD_OrgId1;
	}

	public void setF_SFKD_OrgId1(OrganizationKO f_SFKD_OrgId1) {
		F_SFKD_OrgId1 = f_SFKD_OrgId1;
	}

	public OrganizationKO getF_SFKD_Brand() {
		return F_SFKD_Brand;
	}

	public void setF_SFKD_Brand(OrganizationKO f_SFKD_Brand) {
		F_SFKD_Brand = f_SFKD_Brand;
	}

	public OrganizationKO getF_SFKD_Supplier() {
		return F_SFKD_Supplier;
	}

	public void setF_SFKD_Supplier(OrganizationKO f_SFKD_Supplier) {
		F_SFKD_Supplier = f_SFKD_Supplier;
	}

	public String getF_SFKD_SaleBillNo() {
		return F_SFKD_SaleBillNo;
	}

	public void setF_SFKD_SaleBillNo(String f_SFKD_SaleBillNo) {
		F_SFKD_SaleBillNo = f_SFKD_SaleBillNo;
	}

	public List<BalanceBillItemKO> getFPAYBILLENTRY() {
		return FPAYBILLENTRY;
	}

	public void setFPAYBILLENTRY(List<BalanceBillItemKO> fPAYBILLENTRY) {
		FPAYBILLENTRY = fPAYBILLENTRY;
	}

	public BalanceBillKO ptk(String collectTime, String grade, String brand, String supplier, String orderId, List<BalanceBillItemKO> item) {

		this.FBillNo = String.valueOf(new Random().nextInt(999999999));
		this.F_SFKD_Date = collectTime;
		this.F_SFKD_ABC = new OrganizationKO(grade);
		this.F_SFKD_OrgId = new OrganizationKO("100.01");
		this.F_SFKD_OrgId1 = new OrganizationKO("100.01");
		this.F_SFKD_Brand = new OrganizationKO(brand);
		this.F_SFKD_Supplier = new OrganizationKO(supplier);
		this.F_SFKD_SaleBillNo = orderId;
		this.FPAYBILLENTRY = item;

		return this;
	}

}
