package com.fanglin.payment.vo;

import java.io.Serializable;

public class Yspayment4NotifyVO implements Serializable {

	private static final long serialVersionUID = -3381697926170650744L;

	private String sign_type;
	
	private String sign;
	
	private String notify_type;
	
	private String notify_time;
	
	private String out_trade_no;
	
	private String total_amount;
	
	private String trade_no;
	
	private String trade_status;
	
	private String account_date;
	
	private Integer payer_fee;
	
	private Integer payee_fee;
	
	private Integer partner_fee;
	
	private Integer fee;
	
	private String channel_send_sn;
	
	private String paygate_no;
	
	private String channel_recv_sn;
	
	private String card_type;

	public Yspayment4NotifyVO() {
		super();
	}

	public String getSign_type() {
		return sign_type;
	}

	public void setSign_type(String sign_type) {
		this.sign_type = sign_type;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public String getNotify_type() {
		return notify_type;
	}

	public void setNotify_type(String notify_type) {
		this.notify_type = notify_type;
	}

	public String getNotify_time() {
		return notify_time;
	}

	public void setNotify_time(String notify_time) {
		this.notify_time = notify_time;
	}

	public String getOut_trade_no() {
		return out_trade_no;
	}

	public void setOut_trade_no(String out_trade_no) {
		this.out_trade_no = out_trade_no;
	}

	public String getTotal_amount() {
		return total_amount;
	}

	public void setTotal_amount(String total_amount) {
		this.total_amount = total_amount;
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

	public String getAccount_date() {
		return account_date;
	}

	public void setAccount_date(String account_date) {
		this.account_date = account_date;
	}

	public Integer getPayer_fee() {
		return payer_fee;
	}

	public void setPayer_fee(Integer payer_fee) {
		this.payer_fee = payer_fee;
	}

	public Integer getPayee_fee() {
		return payee_fee;
	}

	public void setPayee_fee(Integer payee_fee) {
		this.payee_fee = payee_fee;
	}

	public Integer getPartner_fee() {
		return partner_fee;
	}

	public void setPartner_fee(Integer partner_fee) {
		this.partner_fee = partner_fee;
	}

	public Integer getFee() {
		return fee;
	}

	public void setFee(Integer fee) {
		this.fee = fee;
	}

	public String getChannel_send_sn() {
		return channel_send_sn;
	}

	public void setChannel_send_sn(String channel_send_sn) {
		this.channel_send_sn = channel_send_sn;
	}

	public String getPaygate_no() {
		return paygate_no;
	}

	public void setPaygate_no(String paygate_no) {
		this.paygate_no = paygate_no;
	}

	public String getChannel_recv_sn() {
		return channel_recv_sn;
	}

	public void setChannel_recv_sn(String channel_recv_sn) {
		this.channel_recv_sn = channel_recv_sn;
	}

	public String getCard_type() {
		return card_type;
	}

	public void setCard_type(String card_type) {
		this.card_type = card_type;
	}
	
}
