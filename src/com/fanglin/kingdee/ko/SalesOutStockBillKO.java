/**
 * @File Name		: SalesOutStockBillKO.java
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

public class SalesOutStockBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 3735803271873916787L;

	public static String FormId = "SAL_OUTSTOCK";

	private String FDate; //日期&辅料审批时间

	private OrganizationKO FSaleOrgId; //销售组织

	private OrganizationKO FCustomerID; //单号&货单编号
	
	private List<SalesOutStockBillItemKO> FEntity; //单据体明细

	public SalesOutStockBillKO() {
		super();
		super.setFormId(FormId);
	}

	public String getFDate() {
		return FDate;
	}

	public void setFDate(String fDate) {
		FDate = fDate;
	}

	public OrganizationKO getFSaleOrgId() {
		return FSaleOrgId;
	}

	public void setFSaleOrgId(OrganizationKO fSaleOrgId) {
		FSaleOrgId = fSaleOrgId;
	}

	public OrganizationKO getFCustomerID() {
		return FCustomerID;
	}

	public void setFCustomerID(OrganizationKO fCustomerID) {
		FCustomerID = fCustomerID;
	}

	public List<SalesOutStockBillItemKO> getFEntity() {
		return FEntity;
	}

	public void setFEntity(List<SalesOutStockBillItemKO> fEntity) {
		FEntity = fEntity;
	}

	public SalesOutStockBillKO ptk(String collectTime, String salesCompany, String salesNo, List<SalesOutStockBillItemKO> item) {

		this.FDate = collectTime;

		this.FSaleOrgId = new OrganizationKO(salesCompany);
		this.FCustomerID = new OrganizationKO(salesNo);
		this.FEntity = item;

		return this;
	}

}
