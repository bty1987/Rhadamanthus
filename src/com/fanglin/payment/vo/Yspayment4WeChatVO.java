package com.fanglin.payment.vo;

import java.io.Serializable;

public class Yspayment4WeChatVO implements Serializable {

	private static final long serialVersionUID = 2003245189812853548L;

	private String out_trade_no;
	
	private String trade_no;
	
	private String trade_status;
	
	private Integer total_amount;
	
	private String currency;
	
	private String jsapi_pay_info;

	public Yspayment4WeChatVO() {
		super();
	}

	public String getOut_trade_no() {
		return out_trade_no;
	}

	public void setOut_trade_no(String out_trade_no) {
		this.out_trade_no = out_trade_no;
	}

	public String getTrade_no() {
		return trade_no;
	}

	public void setTrade_no(String trade_no) {
		this.trade_no = trade_no;
	}

	public String getTrade_status() {
		return trade_status;
	}

	public void setTrade_status(String trade_status) {
		this.trade_status = trade_status;
	}

	public Integer getTotal_amount() {
		return total_amount;
	}

	public void setTotal_amount(Integer total_amount) {
		this.total_amount = total_amount;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getJsapi_pay_info() {
		return jsapi_pay_info;
	}

	public void setJsapi_pay_info(String jsapi_pay_info) {
		this.jsapi_pay_info = jsapi_pay_info;
	}
	
}
