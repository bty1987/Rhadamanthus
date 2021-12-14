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

import com.alibaba.fastjson.annotation.JSONField;
import com.fanglin.kingdee.handle.Bean;

public class OtherOutStockBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = -8494675151786686711L;

	public static String FormId = "STK_MisDelivery"; //其他出库单

	@JSONField(ordinal=1)
	private String FDate; //日期

	@JSONField(ordinal=2)
	private OrganizationKO FStockOrgId; //库存组织

	@JSONField(ordinal=3)
	private OrganizationKO FBillTypeID; //单据类型
	
	@JSONField(ordinal=4)
	private OrganizationKO FCustId; //客户
	
	@JSONField(ordinal=5)
	private List<OtherOutStockBillItemKO> FEntity; //单据体明细
	
	public OtherOutStockBillKO() {
		super();
		super.setFormId(FormId);
	}

	public String getFDate() {
		return FDate;
	}

	public void setFDate(String fDate) {
		FDate = fDate;
	}

	public OrganizationKO getFStockOrgId() {
		return FStockOrgId;
	}

	public void setFStockOrgId(OrganizationKO fStockOrgId) {
		FStockOrgId = fStockOrgId;
	}

	public OrganizationKO getFBillTypeID() {
		return FBillTypeID;
	}

	public void setFBillTypeID(OrganizationKO fBillTypeID) {
		FBillTypeID = fBillTypeID;
	}

	public OrganizationKO getFCustId() {
		return FCustId;
	}

	public void setFCustId(OrganizationKO fCustId) {
		FCustId = fCustId;
	}

	public List<OtherOutStockBillItemKO> getFEntity() {
		return FEntity;
	}

	public void setFEntity(List<OtherOutStockBillItemKO> fEntity) {
		FEntity = fEntity;
	}

	public OtherOutStockBillKO ptk(String outTime, String salesCompany, String receiptType, String manifestNo, List<OtherOutStockBillItemKO> item) {

		this.FDate = outTime;

		this.FStockOrgId = new OrganizationKO(salesCompany);
		this.FBillTypeID = new OrganizationKO(receiptType);
		this.FCustId = new OrganizationKO(manifestNo);
		this.FEntity = item;

		return this;
	}

}
