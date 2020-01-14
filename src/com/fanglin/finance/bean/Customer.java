/**
 * @File Name		: Customer.java
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

public class Customer implements Serializable, KTCBean {

	private static final long serialVersionUID = -5655467909107980448L;

	public static final String FORM_ID_STR = "BD_Customer";

	private Long FCUSTID;

	private Organization FUserOrgId;

	private Organization FCreateOrgId;

	private String FNumber;

	private String FName;

	private Boolean FIsGroup;

	private Boolean FIsDefPayer;

	private Boolean FISCREDITCHECK;

	private Boolean FIsTrade;

	public Customer() {
		super();
	}

	public Customer(String fNumber) {
		super();
		FNumber = fNumber;
	}

	public Customer(Organization fUserOrgId, Organization fCreateOrgId, String fNumber, String fName) {
		super();

		FUserOrgId = fUserOrgId;
		FCreateOrgId = fCreateOrgId;
		FNumber = fNumber;
		FName = fName;
	}

	public Long getFCUSTID() {
		return FCUSTID;
	}

	public void setFCUSTID(Long fCUSTID) {
		FCUSTID = fCUSTID;
	}

	public Organization getFUserOrgId() {
		return FUserOrgId;
	}

	public void setFUserOrgId(Organization fUserOrgId) {
		FUserOrgId = fUserOrgId;
	}

	public Organization getFCreateOrgId() {
		return FCreateOrgId;
	}

	public void setFCreateOrgId(Organization fCreateOrgId) {
		FCreateOrgId = fCreateOrgId;
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

	public Boolean isFIsGroup() {
		return FIsGroup;
	}

	public void setFIsGroup(Boolean fIsGroup) {
		FIsGroup = fIsGroup;
	}

	public Boolean isFIsDefPayer() {
		return FIsDefPayer;
	}

	public void setFIsDefPayer(Boolean fIsDefPayer) {
		FIsDefPayer = fIsDefPayer;
	}

	public Boolean isFISCREDITCHECK() {
		return FISCREDITCHECK;
	}

	public void setFISCREDITCHECK(Boolean fISCREDITCHECK) {
		FISCREDITCHECK = fISCREDITCHECK;
	}

	public Boolean isFIsTrade() {
		return FIsTrade;
	}

	public void setFIsTrade(Boolean fIsTrade) {
		FIsTrade = fIsTrade;
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

		JSONObject customer = JSONObject.parseObject(JSONObject.toJSONString(this));

		params.put("NeedUpDateFileIds", customer.keySet());
		params.put("Model", customer);

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

		KTCHandle handle = new KTCHandle().begin("5e0560db527bd2", "bty", "fanglin1918", 2052);

		Customer customer = new Customer(new Organization("100"), new Organization("100"), "1912280002", "1912280002");

		customer.setFIsTrade(true);

		handle.save(customer);
		// handle.submit(customer);
		// handle.audit(customer);

		// customer.setFCreateOrgId(null);
		// customer.setFUserOrgId(null);
		// customer.setFIsTrade(null);
		//
		// handle.update(customer);
	}
}
