package com.fanglin.kingdee.ko;

import java.io.Serializable;

import com.fanglin.utils.Arith;

public class ReceivableBillItemKO implements Serializable {

	private static final long serialVersionUID = -4271255584586648134L;
	
	private OrganizationKO FMaterialId; //物料编码
	
	private short FPriceQty; //计价数量 1:装修类固定为1
	
	private long FTaxPrice; //含税单价
	
	private short FEntryTaxRate; //税率 设计费:3/6/9
	
	private OrganizationKO FCostId; //费用项目编码-装修类固定为'工程款'
	
	private OrganizationKO F_SFKD_Base; //品牌-主材
	
	private OrganizationKO F_SFKD_Base1; //供应商-主材
	
	private OrganizationKO F_SFKD_Assistant; //分类-主材

	public ReceivableBillItemKO() {
		super();
	}

	public OrganizationKO getFMaterialId() {
		return FMaterialId;
	}

	public void setFMaterialId(OrganizationKO fMaterialId) {
		FMaterialId = fMaterialId;
	}

	public short getFPriceQty() {
		return FPriceQty;
	}

	public void setFPriceQty(short fPriceQty) {
		FPriceQty = fPriceQty;
	}

	public long getFTaxPrice() {
		return FTaxPrice;
	}

	public void setFTaxPrice(long fTaxPrice) {
		FTaxPrice = fTaxPrice;
	}

	public short getFEntryTaxRate() {
		return FEntryTaxRate;
	}

	public void setFEntryTaxRate(short fEntryTaxRate) {
		FEntryTaxRate = fEntryTaxRate;
	}

	public OrganizationKO getFCostId() {
		return FCostId;
	}

	public void setFCostId(OrganizationKO fCostId) {
		FCostId = fCostId;
	}

	public OrganizationKO getF_SFKD_Base() {
		return F_SFKD_Base;
	}

	public void setF_SFKD_Base(OrganizationKO f_SFKD_Base) {
		F_SFKD_Base = f_SFKD_Base;
	}

	public OrganizationKO getF_SFKD_Base1() {
		return F_SFKD_Base1;
	}

	public void setF_SFKD_Base1(OrganizationKO f_SFKD_Base1) {
		F_SFKD_Base1 = f_SFKD_Base1;
	}

	public OrganizationKO getF_SFKD_Assistant() {
		return F_SFKD_Assistant;
	}

	public void setF_SFKD_Assistant(OrganizationKO f_SFKD_Assistant) {
		F_SFKD_Assistant = f_SFKD_Assistant;
	}

	public ReceivableBillItemKO ptk(String materialName, short num, long money, short rate, String costCode, String brand, String supplier, String category) {

		if (materialName != null) {
			this.FMaterialId = new OrganizationKO(materialName);;
		}
		this.FPriceQty = num;
		this.FTaxPrice = (long) Arith.div(money, 1000.0);
		this.FEntryTaxRate = rate;
		
		if (costCode != null) {
			this.FCostId = new OrganizationKO(costCode);
		}
		
		if (brand != null) {
			this.F_SFKD_Base = new OrganizationKO(brand);
		}
		
		if (supplier != null) {
			this.F_SFKD_Base1 = new OrganizationKO(supplier);
		}
		
		if (category != null) {
			this.F_SFKD_Assistant = new OrganizationKO(category);
		}
		
		return this;
	}

}
