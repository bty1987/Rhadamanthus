package com.fanglin.kingdee.ko;

import java.io.Serializable;

public class BalanceBillItemKO implements Serializable {

	private static final long serialVersionUID = 3061409294842242084L;
	
	private long F_SFKD_JieSuanAmount; //结算金额
	
	private long F_SFKD_ShiShouAmount; //实收金额
	
	private OrganizationKO F_ora_Base; //客户

	public BalanceBillItemKO() {
		super();
	}

	public long getF_SFKD_JieSuanAmount() {
		return F_SFKD_JieSuanAmount;
	}

	public void setF_SFKD_JieSuanAmount(long f_SFKD_JieSuanAmount) {
		F_SFKD_JieSuanAmount = f_SFKD_JieSuanAmount;
	}

	public long getF_SFKD_ShiShouAmount() {
		return F_SFKD_ShiShouAmount;
	}

	public void setF_SFKD_ShiShouAmount(long f_SFKD_ShiShouAmount) {
		F_SFKD_ShiShouAmount = f_SFKD_ShiShouAmount;
	}

	public OrganizationKO getF_ora_Base() {
		return F_ora_Base;
	}

	public void setF_ora_Base(OrganizationKO f_ora_Base) {
		F_ora_Base = f_ora_Base;
	}

	public BalanceBillItemKO ptk(long balanceMoney, long realMoney, String orderId) {
		
		this.F_SFKD_JieSuanAmount = balanceMoney;
		this.F_SFKD_ShiShouAmount = realMoney;
		this.F_ora_Base = new OrganizationKO(orderId);
		
		return this;
		
	}

}
