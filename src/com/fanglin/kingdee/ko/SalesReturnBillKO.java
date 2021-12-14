/**
 * @File Name		: SalesReturnBillKO.java
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

import com.alibaba.fastjson.annotation.JSONField;
import com.fanglin.kingdee.handle.Bean;

public class SalesReturnBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 8765493885783591125L;

	public static String FormId = "SAL_RETURNSTOCK"; //销售退货单
	
	@JSONField(ordinal=1)
	private String FDATE; //业务日期
	
	@JSONField(ordinal=2)
	private OrganizationKO FBillTypeID; //单据类型
	
	@JSONField(ordinal=3)
	private OrganizationKO FSaleOrgId; //销售组织
	
	@JSONField(ordinal=4)
	private OrganizationKO FStockOrgId; //库存组织
	
	@JSONField(ordinal=5)
	private OrganizationKO FRetcustId; //退货客户
	
	@JSONField(ordinal=6)
	private List<SalesReturnBillItemKO> FEntity; //明细
	
	public SalesReturnBillKO() {
		super();
		super.setFormId(FormId);
	}

	public String getFDATE() {
		return FDATE;
	}

	public void setFDATE(String fDATE) {
		FDATE = fDATE;
	}

	public OrganizationKO getFBillTypeID() {
		return FBillTypeID;
	}

	public void setFBillTypeID(OrganizationKO fBillTypeID) {
		FBillTypeID = fBillTypeID;
	}

	public OrganizationKO getFSaleOrgId() {
		return FSaleOrgId;
	}

	public void setFSaleOrgId(OrganizationKO fSaleOrgId) {
		FSaleOrgId = fSaleOrgId;
	}

	public OrganizationKO getFStockOrgId() {
		return FStockOrgId;
	}

	public void setFStockOrgId(OrganizationKO fStockOrgId) {
		FStockOrgId = fStockOrgId;
	}

	public OrganizationKO getFRetcustId() {
		return FRetcustId;
	}

	public void setFRetcustId(OrganizationKO fRetcustId) {
		FRetcustId = fRetcustId;
	}

	public List<SalesReturnBillItemKO> getFEntity() {
		return FEntity;
	}

	public void setFEntity(List<SalesReturnBillItemKO> fEntity) {
		FEntity = fEntity;
	}

	public SalesReturnBillKO ptk(String returnDate, String receiptType, String salesCompany, String stockCompany, String salesNo, List<SalesReturnBillItemKO> items) {

		this.FDATE = returnDate;
		this.FBillTypeID = new OrganizationKO(receiptType);
		this.FSaleOrgId = new OrganizationKO(salesCompany);
		this.FStockOrgId = new OrganizationKO(stockCompany);
		this.FRetcustId = new OrganizationKO(salesNo);
		this.FEntity = items;
		
		return this;
	}

}
