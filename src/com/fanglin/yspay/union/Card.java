/**
 * @File Name		: Card.java
 * @Package   	: com.fanglin.yspay.union
 * @Version		: 1.0
 * @Date			: 2021-1-6
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.yspay.union;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import com.alibaba.fastjson.serializer.SimplePropertyPreFilter;
import com.fanglin.core.interceptor.FLException;

public class Card implements Serializable {

	private static final long serialVersionUID = -9037745178894704223L;

	private String appUserCode;

	private String bankAccountNo;

	private String cardIssuingBank;

	private String mobile;

	private String validTimeEnd;

	private String cvv;

	private String cardType;

	private String bindStatus;

	private String bindTime;

	private String cardToken;

	private String flag;

	private String sn;

	private String smsCode;

	private Base base;

	public Card() {
		super();

		setBase(new Base());
	}

	public String getAppUserCode() {
		return appUserCode;
	}

	public void setAppUserCode(String appUserCode) {
		this.appUserCode = appUserCode;
	}

	public String getBankAccountNo() {
		return bankAccountNo;
	}

	public void setBankAccountNo(String bankAccountNo) {
		this.bankAccountNo = bankAccountNo;
	}

	public String getCardIssuingBank() {
		return cardIssuingBank;
	}

	public void setCardIssuingBank(String cardIssuingBank) {
		this.cardIssuingBank = cardIssuingBank;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getValidTimeEnd() {
		return validTimeEnd;
	}

	public void setValidTimeEnd(String validTimeEnd) {
		this.validTimeEnd = validTimeEnd;
	}

	public String getCvv() {
		return cvv;
	}

	public void setCvv(String cvv) {
		this.cvv = cvv;
	}

	public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	public String getBindStatus() {
		return bindStatus;
	}

	public void setBindStatus(String bindStatus) {
		this.bindStatus = bindStatus;
	}

	public String getBindTime() {
		return bindTime;
	}

	public void setBindTime(String bindTime) {
		this.bindTime = bindTime;
	}

	public String getCardToken() {
		return cardToken;
	}

	public void setCardToken(String cardToken) {
		this.cardToken = cardToken;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public String getSn() {
		return sn;
	}

	public void setSn(String sn) {
		this.sn = sn;
	}

	public String getSmsCode() {
		return smsCode;
	}

	public void setSmsCode(String smsCode) {
		this.smsCode = smsCode;
	}

	@JSONField(serialize = false)
	public Base getBase() {
		return base;
	}

	public void setBase(Base base) {
		this.base = base;
	}

	public Card personal() {
		setFlag("A1"); // A1: 个人 , A2: 商户
		return this;
	}

	public Card company() {
		setFlag("A2"); // A1: 个人 , A2: 商户
		return this;
	}

	public Card debit() {

		setCardType("11");

		return this;
	}

	public Card credit() {

		setCardType("12");
		return this;
	}

	public List<Card> query(String walletNo) throws FLException {

		setAppUserCode(walletNo);

		if (!Arrays.asList("A1", "A2").contains(getFlag())) {
			throw new FLException(150053, String.format("支付平台异常,客户标识错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Card.class, "appUserCode", "bankAccountNo", "mobile", "flag", "validTime", "cvv");

		System.out.println(JSONObject.toJSONString(this, filter));

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "userBindingCardList", "/api/userBindingCardList");

		JSONArray banks = response.getJSONArray("bankCardList");

		return JSONObject.parseArray(JSONArray.toJSONString(banks), Card.class);
	}

	public Card bind(String walletNo, String bankNo, String mobile, String validTime, String cvv) throws FLException {

		setAppUserCode(walletNo);
		setBankAccountNo(bankNo);
		setMobile(mobile);

		if (!Arrays.asList("A1", "A2").contains(getFlag())) {
			throw new FLException(150053, String.format("支付平台异常,客户标识错误"));
		}

		if ("12".equals(getCardType()) && (getValidTimeEnd() == null || getCvv() == null)) {
			throw new FLException(150053, String.format("支付平台异常,银行卡信息错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Card.class, "appUserCode", "bankAccountNo", "mobile", "flag", "validTime", "cvv");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "bindingBankCard", "/api/bindingBankCard");

		return JSONObject.toJavaObject(response, Card.class);
	}

	public Card confirm(String walletNo, String sn, String verifyCode) throws FLException {

		setAppUserCode(walletNo);
		setSn(sn);
		setSmsCode(verifyCode);

		if (!Arrays.asList("A1", "A2").contains(getFlag())) {
			throw new FLException(150053, String.format("支付平台异常,客户标识错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Card.class, "appUserCode", "sn", "smsCode", "flag");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "confirmAndBindingCard", "/api/confirmAndBindingCard");

		return JSONObject.toJavaObject(response, Card.class);
	}

	public static void main(String[] args) throws FLException {

		Card card = new Card();

		System.out.println(card.personal().query("baitianyu"));
		// System.out.println(card.personal().debit().bind("baitianyu", "6217850400009118404", "13840085846", "", ""));

	}

}
