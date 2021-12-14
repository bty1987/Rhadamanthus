package com.fanglin.kingdee.ko;

import java.io.Serializable;

public class BankTransitionBillItemKO implements Serializable {

	private static final long serialVersionUID = -2132414656563114059L; //银行过渡单单据体
	
	private long F_SFKD_ShiShouAmount; //实收金额
	
	private OrganizationKO F_ora_Base6; //款项类型
	
	public BankTransitionBillItemKO() {
		super();
	}

	public long getF_SFKD_ShiShouAmount() {
		return F_SFKD_ShiShouAmount;
	}

	public void setF_SFKD_ShiShouAmount(long f_SFKD_ShiShouAmount) {
		F_SFKD_ShiShouAmount = f_SFKD_ShiShouAmount;
	}

	public OrganizationKO getF_ora_Base6() {
		return F_ora_Base6;
	}

	public void setF_ora_Base6(OrganizationKO f_ora_Base6) {
		F_ora_Base6 = f_ora_Base6;
	}

	public BankTransitionBillItemKO ptk(long realMoney, String paymentType) {
		
		this.F_SFKD_ShiShouAmount = realMoney;
		
		this.F_ora_Base6 = new OrganizationKO(paymentType);
		
		return this;
		
	}

}
