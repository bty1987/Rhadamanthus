/**
 * @File Name		: Wallet.java
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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Wallet implements Serializable {

	private static final Logger logger = LoggerFactory.getLogger(Wallet.class);

	private static final long serialVersionUID = 8131620932676462140L;

	private String appUserCode;

	private String balance;

	private String accountType;

	private String amount;

	private String orderId;

	private String businesType; // 业务类型 ,

	private String note; // 备注

	private String verificationCode; // 验证码

	private String sn; // 流水号

	// -------------------------- 消费

	private String merchantId;

	private String merchantName;

	private String tranBissType; // 交易类型 , 1: 及时到账 , 2: 担保交易

	// -------------------------- 充值

	private String cardToken; // 银行卡令牌

	private String flag; // 付款方类型 , A1: 用户 , A2: 商户

	// -------------------------- 提现

	// -------------------------- 转账

	private String payerUserCode;

	private String payerName;

	private String payeeUserCode;

	private String payeeName;

	private Base base;

	public Wallet() {
		super();

		setBase(new Base());
	}

	public String getAppUserCode() {
		return appUserCode;
	}

	public void setAppUserCode(String appUserCode) {
		this.appUserCode = appUserCode;
	}

	public String getBalance() {
		return balance;
	}

	public void setBalance(String balance) {
		this.balance = balance;
	}

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getBusinesType() {
		return businesType;
	}

	public void setBusinesType(String businesType) {
		this.businesType = businesType;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
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

	public String getMerchantId() {
		return merchantId;
	}

	public void setMerchantId(String merchantId) {
		this.merchantId = merchantId;
	}

	public String getMerchantName() {
		return merchantName;
	}

	public void setMerchantName(String merchantName) {
		this.merchantName = merchantName;
	}

	public String getTranBissType() {
		return tranBissType;
	}

	public void setTranBissType(String tranBissType) {
		this.tranBissType = tranBissType;
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

	public String getPayerUserCode() {
		return payerUserCode;
	}

	public void setPayerUserCode(String payerUserCode) {
		this.payerUserCode = payerUserCode;
	}

	public String getPayerName() {
		return payerName;
	}

	public void setPayerName(String payerName) {
		this.payerName = payerName;
	}

	public String getPayeeUserCode() {
		return payeeUserCode;
	}

	public void setPayeeUserCode(String payeeUserCode) {
		this.payeeUserCode = payeeUserCode;
	}

	public String getPayeeName() {
		return payeeName;
	}

	public void setPayeeName(String payeeName) {
		this.payeeName = payeeName;
	}

	@JSONField(serialize = false)
	public Base getBase() {
		return base;
	}

	public void setBase(Base base) {
		this.base = base;
	}

	public Wallet personal() {
		setFlag("A1"); // A1: 个人 , A2: 商户
		return this;
	}

	public Wallet company() {
		setFlag("A2"); // A1: 个人 , A2: 商户
		return this;
	}

	public Wallet personal4personal() {
		setBusinesType("00");
		return this;
	}

	public Wallet company4company() {
		setBusinesType("01");
		return this;
	}

	public Wallet company4personal() {
		setBusinesType("02");
		return this;
	}

	public Wallet personal4company() {
		setBusinesType("");
		return this;
	}

	public Wallet query(String walletNo) throws FLException {

		setAppUserCode(walletNo);

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Wallet.class, "appUserCode");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "walletBalance", "/api/walletBalance");

		return JSONObject.toJavaObject(response, Wallet.class);
	}

	public Wallet consume(String walletNo, String orderId, String talletNo, String talletName, String note) throws FLException {

		setAppUserCode(walletNo);
		setOrderId(orderId);
		setMerchantId(talletNo);
		setMerchantName(talletName);
		setTranBissType("1"); // 交易类型 , 1: 即时到账 , 2: 担保交易
		setBusinesType("03"); // 业务类型 , 03: 消费
		setNote(note);

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Wallet.class, "appUserCode", "orderId", "merchantId", "merchantName", "tranBissType", "businesType", "note");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "businessEnregister", "/api/businessEnregister");

		return JSONObject.toJavaObject(response, Wallet.class);
	}

	public Wallet recharge(String walletNo, String orderId, String amount, String token, String note) throws FLException {

		setAppUserCode(walletNo);
		setOrderId(orderId);
		setAmount(amount);
		setCardToken(token);
		setBusinesType("01"); // 业务类型 , 01: 充值 , 03: 消费
		setNote(note);

		if (!Arrays.asList("A1", "A2").contains(getFlag())) {
			throw new FLException(150053, String.format("支付平台异常,客户标识错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Wallet.class, "appUserCode", "orderId", "amount", "cardToken", "businesType", "flag", "note");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "businessEnregister", "/api/businessEnregister");

		return JSONObject.toJavaObject(response, Wallet.class);
	}

	public Wallet withdraw(String walletNo, String orderId, String amount, String token) throws FLException {

		setAppUserCode(walletNo);
		setOrderId(orderId);
		setAmount(amount);
		setCardToken(token);
		setBusinesType("02"); // 业务类型 , 01: 充值 , 02:提现 , 03: 消费

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Wallet.class, "appUserCode", "orderId", "amount", "cardToken", "businesType");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "businessEnregister", "/api/businessEnregister");

		return JSONObject.toJavaObject(response, Wallet.class);
	}

	public Wallet consent(String walletNo, String sn, String verifyCode, String type) throws FLException {

		setAppUserCode(walletNo);
		setSn(sn);
		setVerificationCode(verifyCode);
		setBusinesType(type);

		if (!Arrays.asList("A1", "A2").contains(getFlag())) {
			throw new FLException(150053, String.format("支付平台异常,客户标识错误"));
		}

		if (!Arrays.asList("01", "02", "03").contains(getBusinesType())) {
			throw new FLException(150053, String.format("支付平台异常,业务类型错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Wallet.class, "appUserCode", "sn", "verificationCode", "businesType", "flag");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "businessConfirm", "/api/businessConfirm");

		return JSONObject.toJavaObject(response, Wallet.class);
	}

	public Wallet transfer(String walletNo, String walletName, String talletNo, String talletName, String orderId, String amount, String note) throws FLException {

		setPayerUserCode(walletNo);
		setPayerName(walletName);
		setPayeeUserCode(talletNo);
		setPayeeName(talletName);

		setOrderId(orderId);
		setAmount(amount);
		setNote(note);

		if (!Arrays.asList("00", "01", "02", "03", "04", "05").contains(getBusinesType())) {
			throw new FLException(150053, String.format("支付平台异常,业务类型错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Wallet.class, "payerUserCode", "payerName", "payeeUserCode", "payeeName", "businesType", "orderId", "amount", "note");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "transferPayRegister", "/api/transferPayRegister");

		return JSONObject.toJavaObject(response, Wallet.class);
	}

	public Wallet approve(String walletNo, String sn, String verifyCode) throws FLException {

		setPayerUserCode(walletNo);
		setSn(sn);
		setVerificationCode(verifyCode);

		if (!Arrays.asList("00", "01", "02", "03", "04", "05").contains(getBusinesType())) {
			throw new FLException(150053, String.format("支付平台异常,业务类型错误"));
		}

		SimplePropertyPreFilter filter = new SimplePropertyPreFilter(Wallet.class, "payerUserCode", "sn", "verificationCode");

		JSONObject response = base.handle(JSONObject.toJSONString(this, filter), "transferPayConfirm", "/api/transferPayConfirm");

		return JSONObject.toJavaObject(response, Wallet.class);
	}

	public static void main(String[] args) throws FLException {

		try {
			System.out.println(new Wallet().query("baitianyu"));
		} catch (Exception e) {
			logger.error("钱包查询失败", e);
		}

	}

}
