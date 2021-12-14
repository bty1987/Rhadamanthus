/**
 * @File Name		: BankTransitionBillKO.java
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

public class BankTransitionBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 6436717419362441199L;

	public static String FormId = "SFKD_BankTransBill"; //银行过渡单

	private String FBillNo; //单据编号
	
	private String F_SFKD_Date; //业务日期
	
	private String F_SFKD_WangLaiOrgType; //往来单位类型
	
	private String F_SFKD_RecOrgType; //付款单位类型
	
	private OrganizationKO F_SFKD_RecOrg; //收款组织
	
	private OrganizationKO F_SFKD_SaleOrg; //销售组织
	
	private OrganizationKO F_ora_Base3; //核算类别
	
	private OrganizationKO F_ora_Base2; //客户

	private long F_SFKD_RealAmount; //实收金额
	
	private List<BankTransitionBillItemKO> FEntity;

	public BankTransitionBillKO() {
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

	public String getF_SFKD_WangLaiOrgType() {
		return F_SFKD_WangLaiOrgType;
	}

	public void setF_SFKD_WangLaiOrgType(String f_SFKD_WangLaiOrgType) {
		F_SFKD_WangLaiOrgType = f_SFKD_WangLaiOrgType;
	}

	public String getF_SFKD_RecOrgType() {
		return F_SFKD_RecOrgType;
	}

	public void setF_SFKD_RecOrgType(String f_SFKD_RecOrgType) {
		F_SFKD_RecOrgType = f_SFKD_RecOrgType;
	}

	public OrganizationKO getF_SFKD_RecOrg() {
		return F_SFKD_RecOrg;
	}

	public void setF_SFKD_RecOrg(OrganizationKO f_SFKD_RecOrg) {
		F_SFKD_RecOrg = f_SFKD_RecOrg;
	}

	public OrganizationKO getF_SFKD_SaleOrg() {
		return F_SFKD_SaleOrg;
	}

	public void setF_SFKD_SaleOrg(OrganizationKO f_SFKD_SaleOrg) {
		F_SFKD_SaleOrg = f_SFKD_SaleOrg;
	}

	public OrganizationKO getF_ora_Base3() {
		return F_ora_Base3;
	}

	public void setF_ora_Base3(OrganizationKO f_ora_Base3) {
		F_ora_Base3 = f_ora_Base3;
	}

	public OrganizationKO getF_ora_Base2() {
		return F_ora_Base2;
	}

	public void setF_ora_Base2(OrganizationKO f_ora_Base2) {
		F_ora_Base2 = f_ora_Base2;
	}

	public long getF_SFKD_RealAmount() {
		return F_SFKD_RealAmount;
	}

	public void setF_SFKD_RealAmount(long f_SFKD_RealAmount) {
		F_SFKD_RealAmount = f_SFKD_RealAmount;
	}

	public List<BankTransitionBillItemKO> getFEntity() {
		return FEntity;
	}

	public void setFEntity(List<BankTransitionBillItemKO> fEntity) {
		FEntity = fEntity;
	}

	public BankTransitionBillKO ptk(String collectTime, String pcompany, String scompany, String grade, String orderId, long realMoney, List<BankTransitionBillItemKO> item) {

		this.FBillNo = String.valueOf(new Random().nextInt(999999999));
		this.F_SFKD_Date = collectTime;
		this.F_SFKD_WangLaiOrgType = "BD_Customer";
		this.F_SFKD_RecOrgType = "BD_Customer";
		this.F_SFKD_RecOrg = new OrganizationKO(pcompany);
		this.F_SFKD_SaleOrg = new OrganizationKO(scompany);
		this.F_ora_Base3 = new OrganizationKO(grade);
		this.F_ora_Base2 = new OrganizationKO(orderId);
		
		if (realMoney > 0) {
			this.F_SFKD_RealAmount = realMoney;
		}
		

		this.FEntity = item;

		return this;
	}

}
