/**
 * @File Name		: Account.java
 * @Package   	: com.fanglin.yspay.union
 * @Version		: 1.0
 * @Date			: 2021-1-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.yspay.union;

import java.io.Serializable;
import java.util.Arrays;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import com.alibaba.fastjson.serializer.SimplePropertyPreFilter;
import com.fanglin.core.interceptor.FLException;

public class Account implements Serializable {

	private static final long serialVersionUID = -2364080497934325684L;

	private String appUserCode;

	private String name;

	private String certifiNo;

	private String mobile;

	private String userType;

	private String accountLevel;

	private String accessTerminal;

	private String certifiType;

	private String expansion;

	private String type;

	private String flag;

	private String funcode;

	private String verificationCode;

	private String sn;

	private Base base;

	public Account() {
		super();

		setUserType("00"); // 00 个人
		setAccessTerminal("00"); // 00: PC , 01: APP
		setCertifiType("00"); // 00: 身份证

		base = new Base();
	}

	public String getAppUserCode() {
		return appUserCode;
	}

	public void setAppUserCode(String appUserCode) {
		this.appUserCode = appUserCode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCertifiNo() {
		return certifiNo;
	}

	public void setCertifiNo(String certifiNo) {
		this.certifiNo = certifiNo;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getAccessTerminal() {
		return accessTerminal;
	}

	public void setAccessTerminal(String accessTerminal) {
		this.accessTerminal = accessTerminal;
	}

	public String getCertifiType() {
		return certifiType;
	}

	public void setCertifiType(String certifiType) {
		this.certifiType = certifiType;
	}

	public String getExpansion() {
		return expansion;
	}

	public void setExpansion(String expansion) {
		this.expansion = expansion;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getAccountLevel() {
		return accountLevel;
	}

	public void setAccountLevel(String accountLevel) {
		this.accountLevel = accountLevel;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public String getFuncode() {
		return funcode;
	}

	public void setFuncode(String funcode) {
		this.funcode = funcode;
	}

	public String getVerificationCode() {
		return verificationCode;
	}

	public void setVerificationCode(String verificationCode) {
		this.verificationCode = verificationCode;
	}

	public String getSn() {
		return sn;
	}

	public void setSn(String sn) {
		this.sn = sn;
	}

	@JSONField(serialize = false)
	public Base getBase() {
		return base;
	}

	public void setBase(Base base) {
		this.base = base;
	}

	public Account personal() {
		setFlag("A1"); // A1: 个人 , A2: 商户
		return this;
	}

	public Account company() {
		setFlag("A2"); // A1: 个人 , A2: 商户
		return this;
	}

	public Account query(String userId) throws FLException {

		setAppUserCode(userId);

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Account.class, "appUserCode");

		System.out.println(JSONObject.toJSONString(this, filter));

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "getGetAccountInfo", "/api/getAccountInfo");

		return JSONObject.toJavaObject(response, Account.class);
	}

	public Account apply(String userId, String name, String identity) throws FLException {

		setAppUserCode(userId);
		setName(name);
		setCertifiNo(identity);

		System.out.println(JSONObject.toJSONString(this));

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Account.class, "appUserCode", "userType", "accessTerminal", "name", "certifiType", "certifiNo", "expansion");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "ApplyAccount", "/api/applyAccount");

		return JSONObject.toJavaObject(response, Account.class);
	}

	public Account bind(String userId, String phone) throws FLException {

		setAppUserCode(userId);
		setMobile(phone);

		setFuncode("B1"); // B1: 手机号绑定 , B2: 修改注册手机号

		if (!Arrays.asList("A1", "A2").contains(getFlag())) {
			throw new FLException(150053, String.format("支付平台异常,客户标识错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Account.class, "appUserCode", "mobile", "funcode", "flag");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "verificationCode", "/api/verificationCode");

		return JSONObject.toJavaObject(response, Account.class);
	}

	public Account update(String userId, String phone) throws FLException {

		setAppUserCode(userId);
		setMobile(phone);

		setFuncode("B2"); // B1: 手机号绑定 , B2: 修改注册手机号

		if (!Arrays.asList("A1", "A2").contains(getFlag())) {
			throw new FLException(150053, String.format("支付平台异常,客户标识错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Account.class, "appUserCode", "mobile", "funcode", "flag");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "verificationCode", "/api/verificationCode");

		return JSONObject.toJavaObject(response, Account.class);
	}

	public Account confirm(String userId, String phone, String verifyCode) throws FLException {

		setAppUserCode(userId);
		setMobile(phone);
		setVerificationCode(verifyCode);

		if (!Arrays.asList("A1", "A2").contains(getFlag())) {
			throw new FLException(150053, String.format("支付平台异常,客户标识错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Account.class, "appUserCode", "mobile", "verificationCode", "flag");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "registerMobileBind", "/api/registerMobileBind");

		return JSONObject.toJavaObject(response, Account.class);
	}

	public Account freeze(String userId) throws FLException {

		setAppUserCode(userId);
		setType("00"); // 00: 冻结 , 01: 解冻

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Account.class, "appUserCode", "type");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "frozenAccount", "/api/frozenAccount");

		return JSONObject.toJavaObject(response, Account.class);
	}

	public Account unfreeze(String userId) throws FLException {

		setAppUserCode(userId);
		setType("01"); // 00: 冻结 , 01: 解冻

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Account.class, "appUserCode", "type");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "frozenAccount", "/api/frozenAccount");

		return JSONObject.toJavaObject(response, Account.class);
	}

	public static void main(String[] args) throws FLException {

		// Account account = new Account();

		// System.out.println(new Account().query("baitianyu2").getName());
		// System.out.println(new Account().apply("baitianyu3", "白添宇", "210106198702145837"));

		// System.out.println(new Account().personal().bind("baitianyu", "13840085846"));
		// System.out.println(new Account().personal().update("baitianyu", "13840085846"));
		// System.out.println(new Account().personal().confirm("baitianyu", "13840085846", "032417"));

		// System.out.println(account.freeze("baitianyu"));
		// System.out.println(account.unfreeze("baitianyu"));

	}
}
