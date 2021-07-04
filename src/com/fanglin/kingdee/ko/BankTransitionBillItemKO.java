package com.fanglin.kingdee.ko;

import java.io.Serializable;

import com.fanglin.utils.Arith;

public class BankTransitionBillItemKO implements Serializable {

	private static final long serialVersionUID = -2132414656563114059L;
	
	private long F_SFKD_ShiShouAmount; //实收金额
	
	private OrganizationKO F_ora_Base4; //品牌
	
	private OrganizationKO F_ora_Base5; //供应商

	public BankTransitionBillItemKO() {
		super();
	}

	public long getF_SFKD_ShiShouAmount() {
		return F_SFKD_ShiShouAmount;
	}

	public void setF_SFKD_ShiShouAmount(long f_SFKD_ShiShouAmount) {
		F_SFKD_ShiShouAmount = f_SFKD_ShiShouAmount;
	}

	public OrganizationKO getF_ora_Base4() {
		return F_ora_Base4;
	}

	public void setF_ora_Base4(OrganizationKO f_ora_Base4) {
		F_ora_Base4 = f_ora_Base4;
	}

	public OrganizationKO getF_ora_Base5() {
		return F_ora_Base5;
	}

	public void setF_ora_Base5(OrganizationKO f_ora_Base5) {
		F_ora_Base5 = f_ora_Base5;
	}

	public BankTransitionBillItemKO ptk(long realMoney, String brand, String supplier) {
		
		this.F_SFKD_ShiShouAmount = (long) Arith.div(realMoney, 1000.0);
		
		if (brand != null) {
			this.F_ora_Base4 = new OrganizationKO(brand);
		}
		
		if (supplier != null) {
			this.F_ora_Base5 = new OrganizationKO(supplier);
		}
		
		return this;
		
	}

}
