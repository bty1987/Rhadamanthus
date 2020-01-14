/**
 * @File Name		: Receivebill.java
 * @Package   	: com.fanglin.finance.bean
 * @Version		: 1.0
 * @Date			: 2019-12-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.finance.utils.KTCHandle;

public class Receivebill implements Serializable, KTCBean {

	private static final long serialVersionUID = 8113279100537948175L;

	public static final String FORM_ID_STR = "AR_RECEIVEBILL";

	private Long FID;
	
	private String FNumber;

	private Organization FBillTypeID;

	private String FDATE;

	private String FCONTACTUNITTYPE;

	private Organization FCONTACTUNIT;

	private String FPAYUNITTYPE;

	private Organization FPAYUNIT;
	
	private Organization FCURRENCYID;
	
	private Organization FPAYORGID;
	
	private Organization FSETTLEORGID;
	
	private Organization FSALEORGID;
	
	private Organization FSALEDEPTID;
	
	private Organization FSALEGROUPID;
	
	private Organization FSALEERID;
	
	private Organization FSETTLECUR;
	
	private String FREMARK;
	
	private Organization FSETTLEMAINBOOKID;
	
	private List<ReceivebillItem> FRECEIVEBILLENTRY;

	public Receivebill() {
		super();
	}

	public Receivebill(Organization fPAYORGID, Organization fSETTLEORGID, Organization fSETTLECUR, Organization fSETTLEMAINBOOKID) {
		super();
		FPAYORGID = fPAYORGID;
		FSETTLEORGID = fSETTLEORGID;
		FSETTLECUR = fSETTLECUR;
		FSETTLEMAINBOOKID = fSETTLEMAINBOOKID;
	}

	public Long getFID() {
		return FID;
	}

	public void setFID(Long fID) {
		FID = fID;
	}

	public String getFNumber() {
		return FNumber;
	}

	public void setFNumber(String fNumber) {
		FNumber = fNumber;
	}

	public Organization getFBillTypeID() {
		return FBillTypeID;
	}

	public void setFBillTypeID(Organization fBillTypeID) {
		FBillTypeID = fBillTypeID;
	}

	public String getFDATE() {
		return FDATE;
	}

	public void setFDATE(String fDATE) {
		FDATE = fDATE;
	}

	public String getFCONTACTUNITTYPE() {
		return FCONTACTUNITTYPE;
	}

	public void setFCONTACTUNITTYPE(String fCONTACTUNITTYPE) {
		FCONTACTUNITTYPE = fCONTACTUNITTYPE;
	}

	public Organization getFCONTACTUNIT() {
		return FCONTACTUNIT;
	}

	public void setFCONTACTUNIT(Organization fCONTACTUNIT) {
		FCONTACTUNIT = fCONTACTUNIT;
	}

	public String getFPAYUNITTYPE() {
		return FPAYUNITTYPE;
	}

	public void setFPAYUNITTYPE(String fPAYUNITTYPE) {
		FPAYUNITTYPE = fPAYUNITTYPE;
	}

	public Organization getFPAYUNIT() {
		return FPAYUNIT;
	}

	public void setFPAYUNIT(Organization fPAYUNIT) {
		FPAYUNIT = fPAYUNIT;
	}

	public Organization getFCURRENCYID() {
		return FCURRENCYID;
	}

	public void setFCURRENCYID(Organization fCURRENCYID) {
		FCURRENCYID = fCURRENCYID;
	}

	public Organization getFPAYORGID() {
		return FPAYORGID;
	}

	public void setFPAYORGID(Organization fPAYORGID) {
		FPAYORGID = fPAYORGID;
	}

	public Organization getFSETTLEORGID() {
		return FSETTLEORGID;
	}

	public void setFSETTLEORGID(Organization fSETTLEORGID) {
		FSETTLEORGID = fSETTLEORGID;
	}

	public Organization getFSALEORGID() {
		return FSALEORGID;
	}

	public void setFSALEORGID(Organization fSALEORGID) {
		FSALEORGID = fSALEORGID;
	}

	public Organization getFSALEDEPTID() {
		return FSALEDEPTID;
	}

	public void setFSALEDEPTID(Organization fSALEDEPTID) {
		FSALEDEPTID = fSALEDEPTID;
	}

	public Organization getFSALEGROUPID() {
		return FSALEGROUPID;
	}

	public void setFSALEGROUPID(Organization fSALEGROUPID) {
		FSALEGROUPID = fSALEGROUPID;
	}

	public Organization getFSALEERID() {
		return FSALEERID;
	}

	public void setFSALEERID(Organization fSALEERID) {
		FSALEERID = fSALEERID;
	}

	public Organization getFSETTLECUR() {
		return FSETTLECUR;
	}

	public void setFSETTLECUR(Organization fSETTLECUR) {
		FSETTLECUR = fSETTLECUR;
	}

	public String getFREMARK() {
		return FREMARK;
	}

	public void setFREMARK(String fREMARK) {
		FREMARK = fREMARK;
	}

	public Organization getFSETTLEMAINBOOKID() {
		return FSETTLEMAINBOOKID;
	}

	public void setFSETTLEMAINBOOKID(Organization fSETTLEMAINBOOKID) {
		FSETTLEMAINBOOKID = fSETTLEMAINBOOKID;
	}

	public List<ReceivebillItem> getFRECEIVEBILLENTRY() {
		return FRECEIVEBILLENTRY;
	}

	public void setFRECEIVEBILLENTRY(List<ReceivebillItem> fRECEIVEBILLENTRY) {
		FRECEIVEBILLENTRY = fRECEIVEBILLENTRY;
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

		JSONObject receivebill = JSONObject.parseObject(JSONObject.toJSONString(this));

		params.put("NeedUpDateFileIds", receivebill.keySet());
		params.put("Model", receivebill);

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

		Receivebill receivebill = new Receivebill(new Organization("100"), new Organization("100"), new Organization("PRE001"), new Organization("PRE001"));
		List<ReceivebillItem> ReceivebillItems = new ArrayList<ReceivebillItem>();
		
		receivebill.setFBillTypeID(new Organization("SKDLX01_SYS"));
		receivebill.setFCONTACTUNITTYPE(Customer.FORM_ID_STR);
		receivebill.setFCONTACTUNIT(new Organization("1912280002"));
		receivebill.setFPAYUNITTYPE(Customer.FORM_ID_STR);
		receivebill.setFPAYUNIT(new Organization("1912280002"));
		
		for (int i = 0; i < 2; i++) {
			ReceivebillItem receivebillItem = new ReceivebillItem();
			receivebillItem.setFSETTLETYPEID(new SettleType("1002.03.02"));
			receivebillItem.setFPURPOSEID(new Organization("SFKYT01_SYS"));
			receivebillItem.setFRECTOTALAMOUNTFOR("300");
			receivebillItem.setFRECAMOUNTFOR_E("300");
			receivebillItem.setFRECAMOUNT_E("300");
			ReceivebillItems.add(receivebillItem);
		}
		
		receivebill.setFRECEIVEBILLENTRY(ReceivebillItems);

		handle.save(receivebill);
		
		JSONObject result = handle.getResultParams();
		receivebill.setFNumber(result.getString("Number"));
		
		handle.submit(receivebill);
		handle.audit(receivebill);
	}
}
