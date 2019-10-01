package com.yspay.bean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.yspay.utils.DateUtil;
import com.yspay.utils.StringUtils;

public class Business {

	public static final String DIVISION_YES_STR = "01";

	public static final String DIVISON_NO_STR = "02";

	public static final String REDIVISION_YES_STR = "Y";

	public static final String REDIVISION_NO_STR = "N";

	public static final String DIVISION_MODE_RATE_STR = "01";

	public static final String DIVISION_MODE_AMOUNT_STR = "02";

	// common

	private String out_batch_no;

	private String is_divistion;

	// query

	private String src_usercode;

	// division

	private String payee_usercode;

	private String out_trade_no;

	private String sys_flag = "DD";

	private Double total_amount;

	private String is_again_division;

	private String division_mode;

	private List<Account> accounts;

	private String shopdate;

	// refund

	private String out_request_no;

	private Double refund_amount;

	private String refund_reason;

	private String ori_division_mode;

	private Refund refund_split_info;

	// query
	public Business(String src_usercode, String out_trade_no) {
		super();

		this.src_usercode = src_usercode;
		this.out_trade_no = out_trade_no;

		this.out_batch_no = StringUtils.getNo("S", 0, 7);
		this.sys_flag = "DD";
	}

	// division
	public Business(String payee_usercode, String out_trade_no, Double total_amount, String division_mode) {
		super();

		this.payee_usercode = payee_usercode;
		this.out_trade_no = out_trade_no;
		this.total_amount = total_amount;
		this.division_mode = division_mode;

		this.out_batch_no = StringUtils.getNo("S", 0, 7);
		this.is_divistion = DIVISION_YES_STR;
		this.is_again_division = REDIVISION_NO_STR;
		this.accounts = new ArrayList<Account>();
	}

	// refund
	public Business(String out_trade_no, Double refund_amount, String refund_reason, String is_division, String ori_division_mode) {
		super();

		this.out_trade_no = out_trade_no;
		this.refund_amount = refund_amount;
		this.refund_reason = refund_reason;
		this.is_divistion = is_division;
		this.ori_division_mode = ori_division_mode;

		this.shopdate = DateUtil.getCurrentDate("yyyyMMdd");
		this.out_request_no = StringUtils.getNo("RD", 0, 7);
	}

	public String getSrc_usercode() {
		return src_usercode;
	}

	public void setSrc_usercode(String src_usercode) {
		this.src_usercode = src_usercode;
	}

	public String getPayee_usercode() {
		return payee_usercode;
	}

	public void setPayee_usercode(String payee_usercode) {
		this.payee_usercode = payee_usercode;
	}

	public String getOut_batch_no() {
		return out_batch_no;
	}

	public void setOut_batch_no(String out_batch_no) {
		this.out_batch_no = out_batch_no;
	}

	public String getOut_trade_no() {
		return out_trade_no;
	}

	public void setOut_trade_no(String out_trade_no) {
		this.out_trade_no = out_trade_no;
	}

	public String getSys_flag() {
		return sys_flag;
	}

	public void setSys_flag(String sys_flag) {
		this.sys_flag = sys_flag;
	}

	public Double getTotal_amount() {
		return total_amount;
	}

	public void setTotal_amount(Double total_amount) {
		this.total_amount = total_amount;
	}

	public String getIs_divistion() {
		return is_divistion;
	}

	public void setIs_divistion(String is_divistion) {
		this.is_divistion = is_divistion;
	}

	public String getIs_again_division() {
		return is_again_division;
	}

	public void setIs_again_division(String is_again_division) {
		this.is_again_division = is_again_division;
	}

	public String getDivision_mode() {
		return division_mode;
	}

	public void setDivision_mode(String division_mode) {
		this.division_mode = division_mode;
	}

	public String getShopdate() {
		return shopdate;
	}

	public void setShopdate(String shopdate) {
		this.shopdate = shopdate;
	}

	public String getOut_request_no() {
		return out_request_no;
	}

	public void setOut_request_no(String out_request_no) {
		this.out_request_no = out_request_no;
	}

	public Double getRefund_amount() {
		return refund_amount;
	}

	public void setRefund_amount(Double refund_amount) {
		this.refund_amount = refund_amount;
	}

	public String getRefund_reason() {
		return refund_reason;
	}

	public void setRefund_reason(String refund_reason) {
		this.refund_reason = refund_reason;
	}

	public String getOri_division_mode() {
		return ori_division_mode;
	}

	public void setOri_division_mode(String ori_division_mode) {
		this.ori_division_mode = ori_division_mode;
	}

	public Refund getRefund_split_info() {
		return refund_split_info;
	}

	public void setRefund_split_info(Refund refund_split_info) {
		this.refund_split_info = refund_split_info;
	}

	public List<Account> getAccounts() {
		return accounts;
	}

	public void setAccounts(List<Account> accounts) {
		this.accounts = accounts;
	}

	public Business addAccount(Account account) {
		this.accounts.add(account);
		return this;
	}

	public Business addAccount(String division_mer_usercode, Double value, String is_chargeFee) {
		this.accounts.add(new Account(division_mer_usercode, value, is_chargeFee, this.getDivision_mode()));
		return this;
	}

	public Business setRefund(String refund_mer_id, Double refund_amount) {
		this.refund_split_info = new Refund(refund_mer_id, refund_amount);
		return this;
	}

	public String query() {

		Map<String, Object> param = new HashMap<String, Object>();

		param.put("src_usercode", this.src_usercode);
		param.put("out_batch_no", this.out_batch_no);
		param.put("out_trade_no", this.out_trade_no);
		param.put("sys_flag", this.sys_flag);

		return StringUtils.toJson(param);
	}

	public String division() {

		Map<String, Object> param = new HashMap<String, Object>();

		param.put("out_batch_no", this.out_batch_no);
		param.put("out_trade_no", this.out_trade_no);
		param.put("payee_usercode", this.payee_usercode);
		// param.put("sys_flag", this.sys_flag);
		param.put("total_amount", this.total_amount);
		param.put("is_divistion", this.is_divistion);
		param.put("is_again_division", this.is_again_division);
		param.put("division_mode", this.division_mode);
		param.put("div_list", this.accounts);

		return StringUtils.toJson(param);
	}

	public String refund() {

		Map<String, Object> param = new HashMap<String, Object>();

		param.put("out_trade_no", this.out_trade_no);
		param.put("shopdate", this.shopdate);
		// bizContent.put("trade_no", "311160414497667096");
		param.put("refund_amount", this.refund_amount);
		param.put("refund_reason", this.refund_reason);
		param.put("out_request_no", this.out_request_no);
		param.put("is_division", this.is_divistion);
		param.put("ori_division_mode", this.ori_division_mode);

		param.put("refund_split_info", refund_split_info);
		param.put("order_div_list", accounts);

		return StringUtils.toJson(param);
	}
}
