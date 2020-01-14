/**
 * @File Name		: SettleType.java
 * @Package   	: com.fanglin.finance.bean
 * @Version		: 1.0
 * @Date			: 2019-12-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.bean;

import java.io.Serializable;
import java.util.Arrays;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.finance.utils.KTCHandle;

public class SettleType implements Serializable, KTCBean {

	private static final long serialVersionUID = -4671034879003911183L;
	
	public static final String FORM_ID_STR = "BD_SETTLETYPE";

	private Long FID;

	private Organization FCreateOrgId;

	private Organization FUseOrgId;

	private String FNumber;

	private String FName;

	private String FSETTLECATEGORY;

	private String FTYPE;

	private String FPAYCHARGEPERSON;

	private String FPAYTYPE;

	private Boolean FISNEEDPAYCHARGE;

	private Boolean FISDEFAULT;

	private Boolean FIsSupBankPay;
	
	public SettleType() {
		super();
	}

	public SettleType(String fNumber) {
		super();
		FNumber = fNumber;
	}

	public SettleType(Organization fCreateOrgId, Organization fUseOrgId) {
		super();
		FCreateOrgId = fCreateOrgId;
		FUseOrgId = fUseOrgId;
	}

	public Long getFID() {
		return FID;
	}

	public void setFID(Long fID) {
		FID = fID;
	}

	public Organization getFCreateOrgId() {
		return FCreateOrgId;
	}

	public void setFCreateOrgId(Organization fCreateOrgId) {
		FCreateOrgId = fCreateOrgId;
	}

	public Organization getFUseOrgId() {
		return FUseOrgId;
	}

	public void setFUseOrgId(Organization fUseOrgId) {
		FUseOrgId = fUseOrgId;
	}

	public String getFNumber() {
		return FNumber;
	}

	public void setFNumber(String fNumber) {
		FNumber = fNumber;
	}

	public String getFName() {
		return FName;
	}

	public void setFName(String fName) {
		FName = fName;
	}

	public String getFSETTLECATEGORY() {
		return FSETTLECATEGORY;
	}

	public void setFSETTLECATEGORY(String fSETTLECATEGORY) {
		FSETTLECATEGORY = fSETTLECATEGORY;
	}

	public String getFTYPE() {
		return FTYPE;
	}

	public void setFTYPE(String fTYPE) {
		FTYPE = fTYPE;
	}

	public String getFPAYCHARGEPERSON() {
		return FPAYCHARGEPERSON;
	}

	public void setFPAYCHARGEPERSON(String fPAYCHARGEPERSON) {
		FPAYCHARGEPERSON = fPAYCHARGEPERSON;
	}

	public String getFPAYTYPE() {
		return FPAYTYPE;
	}

	public void setFPAYTYPE(String fPAYTYPE) {
		FPAYTYPE = fPAYTYPE;
	}

	public Boolean getFISNEEDPAYCHARGE() {
		return FISNEEDPAYCHARGE;
	}

	public void setFISNEEDPAYCHARGE(Boolean fISNEEDPAYCHARGE) {
		FISNEEDPAYCHARGE = fISNEEDPAYCHARGE;
	}

	public Boolean getFISDEFAULT() {
		return FISDEFAULT;
	}

	public void setFISDEFAULT(Boolean fISDEFAULT) {
		FISDEFAULT = fISDEFAULT;
	}

	public Boolean getFIsSupBankPay() {
		return FIsSupBankPay;
	}

	public void setFIsSupBankPay(Boolean fIsSupBankPay) {
		FIsSupBankPay = fIsSupBankPay;
	}

	@Override
	public String formId() {
		return FORM_ID_STR;
	}

	@Override
	public String view() {

		JSONObject params = new JSONObject();

		params.put("Number", getFNumber());

		return null;
	}

	@Override
	public String save() {

		JSONObject params = new JSONObject();

		params.put("Model", this);

		return JSONObject.toJSONString(params);
	}

	@Override
	public String update() {

		JSONObject params = new JSONObject();

		JSONObject settleType = JSONObject.parseObject(JSONObject.toJSONString(this));

		params.put("NeedUpDateFileIds", settleType.keySet());
		params.put("Model", settleType);

		return JSONObject.toJSONString(params);
	}

	@Override
	public String submit() {
		
		JSONObject params = new JSONObject();

		params.put("Numbers", Arrays.asList(getFNumber()));

		return JSONObject.toJSONString(params);
	}

	@Override
	public String audit() {
		
		JSONObject params = new JSONObject();

		params.put("Numbers", Arrays.asList(getFNumber()));

		return JSONObject.toJSONString(params);
	}

	@Override
	public String unaudit() {
		
		JSONObject params = new JSONObject();

		params.put("Numbers", Arrays.asList(getFNumber()));

		return JSONObject.toJSONString(params);
	}
	
	public static void main(String[] args) throws Exception {

		KTCHandle handle = new KTCHandle().begin("5e0560db527bd2", "ly", "fanglin2020", 2052);

		SettleType settleType = new SettleType(new Organization("100"), new Organization("100"));
		
		settleType.setFNumber("1002.03.08");
		settleType.setFName("工行-5068");
		settleType.setFSETTLECATEGORY("19");
		settleType.setFTYPE("2");
		

		handle.save(settleType);
//		handle.submit(settleType);
//		handle.audit(settleType);
	}

}
