package com.yspay.bean;

import java.util.HashMap;
import java.util.Map;

import com.yspay.utils.DateUtil;
import com.yspay.utils.SignUtils;

public class Base {

	private String method;

	private String partner_id;

	private String timestamp;

	private String charset;

	private String sign_type;

	private String notify_url;

	private String version;

	private Business business;

	public Base(String method, String partner_id, String notify_url) {
		super();
		this.method = method;
		this.partner_id = partner_id;
		this.notify_url = notify_url;

		this.timestamp = DateUtil.getCurrentDate("yyyy-MM-dd HH:mm:ss");
		this.charset = "UTF-8";
		this.sign_type = "RSA";
		this.version = "3.0";
	}

	public Base(String method, String partner_id, String timestamp, String charset, String sign_type, String notify_url, String version) {
		super();
		this.method = method;
		this.partner_id = partner_id;
		this.timestamp = timestamp;
		this.charset = charset;
		this.sign_type = sign_type;
		this.notify_url = notify_url;
		this.version = version;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public String getPartner_id() {
		return partner_id;
	}

	public void setPartner_id(String partner_id) {
		this.partner_id = partner_id;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public String getCharset() {
		return charset;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}

	public String getSign_type() {
		return sign_type;
	}

	public void setSign_type(String sign_type) {
		this.sign_type = sign_type;
	}

	public String getNotify_url() {
		return notify_url;
	}

	public void setNotify_url(String notify_url) {
		this.notify_url = notify_url;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Business getBusiness() {
		return business;
	}

	public void setBusiness(Business business) {
		this.business = business;
	}

	public Base addAccount(Account account) {
		this.business.getAccounts().add(account);
		return this;
	}

	public Base addAccount(String division_mer_usercode, Double value, String is_chargeFee) {
		this.business.getAccounts().add(new Account(division_mer_usercode, value, is_chargeFee, this.business.getDivision_mode()));
		return this;
	}

	public Base setRefund(Refund refund) {
		this.business.setRefund_split_info(refund);
		return this;
	}

	public Map<String, String> query() {

		Map<String, String> params = new HashMap<String, String>();

		params.put("method", this.method);
		params.put("partner_id", this.partner_id);
		params.put("timestamp", this.timestamp);
		params.put("charset", this.charset);
		params.put("sign_type", this.sign_type);
		params.put("notify_url", this.notify_url);
		params.put("version", this.version);

		params.put("biz_content", this.business.query());

		params.put("sign", SignUtils.getSign(params));

		return params;
	}

	public Map<String, String> division() {

		Map<String, String> params = new HashMap<String, String>();

		params.put("method", this.method);
		params.put("partner_id", this.partner_id);
		params.put("timestamp", this.timestamp);
		params.put("charset", this.charset);
		params.put("sign_type", this.sign_type);
		params.put("notify_url", this.notify_url);
		params.put("version", this.version);

		params.put("biz_content", this.business.division());

		params.put("sign", SignUtils.getSign(params));

		System.out.println(params);

		return params;
	}

	public Map<String, String> refund() {

		Map<String, String> params = new HashMap<String, String>();

		params.put("method", this.method);
		params.put("partner_id", this.partner_id);
		params.put("timestamp", this.timestamp);
		params.put("charset", this.charset);
		params.put("sign_type", this.sign_type);
		params.put("notify_url", this.notify_url);
		params.put("version", this.version);

		params.put("biz_content", this.business.refund());

		params.put("sign", SignUtils.getSign(params));

		return params;
	}
}
