package com.fanglin.kingdee.ko;

import java.io.Serializable;

public class MaterialTransferBillItemKO implements Serializable {

	private static final long serialVersionUID = -6031169022422873171L; //主材转款单单据体
	
	private long F_SFKD_RealAmount; //实收金额
	
	private OrganizationKO F_ora_Base3; //品牌
	
	private OrganizationKO F_ora_Base4; //供应商
	
	private String F_ora_Text; //销售单号
	
	private OrganizationKO F_SFKD_Base; //款项类型

	public MaterialTransferBillItemKO() {
		super();
	}

	public long getF_SFKD_RealAmount() {
		return F_SFKD_RealAmount;
	}

	public void setF_SFKD_RealAmount(long f_SFKD_RealAmount) {
		F_SFKD_RealAmount = f_SFKD_RealAmount;
	}

	public OrganizationKO getF_ora_Base3() {
		return F_ora_Base3;
	}

	public void setF_ora_Base3(OrganizationKO f_ora_Base3) {
		F_ora_Base3 = f_ora_Base3;
	}

	public OrganizationKO getF_ora_Base4() {
		return F_ora_Base4;
	}

	public void setF_ora_Base4(OrganizationKO f_ora_Base4) {
		F_ora_Base4 = f_ora_Base4;
	}

	public String getF_ora_Text() {
		return F_ora_Text;
	}

	public void setF_ora_Text(String f_ora_Text) {
		F_ora_Text = f_ora_Text;
	}
	
	public OrganizationKO getF_SFKD_Base() {
		return F_SFKD_Base;
	}

	public void setF_SFKD_Base(OrganizationKO f_SFKD_Base) {
		F_SFKD_Base = f_SFKD_Base;
	}

	public MaterialTransferBillItemKO ptk(long realMoney, String brand, String supplier, String salesOrderId, String paymentType) {

		this.F_SFKD_RealAmount = realMoney;
		
		if (brand != null) {
			this.F_ora_Base3 = new OrganizationKO(brand);
		}
		
		if (supplier != null) {
			this.F_ora_Base4 = new OrganizationKO(supplier);
		}
		
		if (salesOrderId != null) {
			this.F_ora_Text = salesOrderId;
		}
		
		this.F_SFKD_Base = new OrganizationKO(paymentType);
		
		return this;
	}

}
