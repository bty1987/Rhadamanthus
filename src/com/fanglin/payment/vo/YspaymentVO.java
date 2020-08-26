package com.fanglin.payment.vo;

import java.io.Serializable;

import com.yspay.config.Config;
import com.yspay.utils.DateUtil;

public class YspaymentVO implements Serializable {

	private static final long serialVersionUID = 3866700922003067613L;
	
	private String method;
	
	private String partner_id;
	
	private String timestamp;
	
	private String charset;
	
	private String sign_type;
	
	private String notify_url;
	
	private String version;
	
	private String biz_content;
	
	public YspaymentVO() {
		super();
		
		this.notify_url = Config.NOTIFY_URL;
		this.timestamp = DateUtil.getCurrentDate("yyyy-MM-dd HH:mm:ss");
		this.charset = "utf-8";
		this.sign_type = "RSA";
		this.version = "3.0";
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

	public String getBiz_content() {
		return biz_content;
	}

	public void setBiz_content(String biz_content) {
		this.biz_content = biz_content;
	}
	
}
