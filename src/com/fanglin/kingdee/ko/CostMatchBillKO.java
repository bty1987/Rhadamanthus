/**
 * @File Name		: CostMatchBillKO.java
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

public class CostMatchBillKO extends Bean implements Serializable {

	private static final long serialVersionUID = 5452244896953678345L;

	public static String FormId = "ER_MatchBill"; //费用核销单

	@JSONField(ordinal=1)
	private String FDate; //单据日期
	
	@JSONField(ordinal=2)
	private String FDOCUMENTSTATUS; //单据状态
	
	@JSONField(ordinal=3)
	private OrganizationKO FSETTLEORGID; //结算组织
	
	@JSONField(ordinal=4)
	private OrganizationKO FBillTypeID; //单据类型
	
	@JSONField(ordinal=5)
	private List<CostMatchBillItemKO> FEntity;

	public CostMatchBillKO() {
		super();
		super.setFormId(FormId);
	}

	public String getFDate() {
		return FDate;
	}

	public void setFDate(String fDate) {
		FDate = fDate;
	}

	public String getFDOCUMENTSTATUS() {
		return FDOCUMENTSTATUS;
	}

	public void setFDOCUMENTSTATUS(String fDOCUMENTSTATUS) {
		FDOCUMENTSTATUS = fDOCUMENTSTATUS;
	}

	public OrganizationKO getFSETTLEORGID() {
		return FSETTLEORGID;
	}

	public void setFSETTLEORGID(OrganizationKO fSETTLEORGID) {
		FSETTLEORGID = fSETTLEORGID;
	}

	public OrganizationKO getFBillTypeID() {
		return FBillTypeID;
	}

	public void setFBillTypeID(OrganizationKO fBillTypeID) {
		FBillTypeID = fBillTypeID;
	}

	public List<CostMatchBillItemKO> getFEntity() {
		return FEntity;
	}

	public void setFEntity(List<CostMatchBillItemKO> fEntity) {
		FEntity = fEntity;
	}

	public CostMatchBillKO ptk(String costDate, String billstatus, String payCompany, String receiptType, List<CostMatchBillItemKO> item) {

		this.FDate = costDate;
		this.FDOCUMENTSTATUS = billstatus;
		this.FSETTLEORGID = new OrganizationKO(payCompany);
		this.FBillTypeID = new OrganizationKO(receiptType);
		this.FEntity = item;

		return this;
	}

}
