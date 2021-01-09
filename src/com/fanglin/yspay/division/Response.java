package com.fanglin.yspay.division;

public class Response {

	private String sign;

	private Division ysepay_single_division_online_accept_response;

	private Division ysepay_single_division_offline_accept_response;

	private Query ysepay_single_division_offline_query_response;

	private String code;

	private String msg;

	private String returnCode;

	private String returnInfo;

	public Response() {
		super();
	}

	public Response(String code, String msg) {
		super();
		this.code = code;
		this.msg = msg;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public Division getYsepay_single_division_online_accept_response() {
		return ysepay_single_division_online_accept_response;
	}

	public void setYsepay_single_division_online_accept_response(Division ysepay_single_division_online_accept_response) {
		this.ysepay_single_division_online_accept_response = ysepay_single_division_online_accept_response;

		this.code = ysepay_single_division_online_accept_response.getCode();
		this.msg = ysepay_single_division_online_accept_response.getMsg();
		this.returnCode = ysepay_single_division_online_accept_response.getReturnCode();
		this.returnInfo = ysepay_single_division_online_accept_response.getRetrunInfo();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getReturnCode() {
		return returnCode;
	}

	public void setReturnCode(String returnCode) {
		this.returnCode = returnCode;
	}

	public String getReturnInfo() {
		return returnInfo;
	}

	public void setReturnInfo(String returnInfo) {
		this.returnInfo = returnInfo;
	}

	public Response init() {

		if (this.ysepay_single_division_online_accept_response != null) {
			this.code = ysepay_single_division_online_accept_response.getCode();
			this.msg = ysepay_single_division_online_accept_response.getMsg();
			this.returnCode = ysepay_single_division_online_accept_response.getReturnCode();
			this.returnInfo = ysepay_single_division_online_accept_response.getRetrunInfo();
		} else if (this.ysepay_single_division_offline_accept_response != null) {
			this.code = ysepay_single_division_offline_accept_response.getCode();
			this.msg = ysepay_single_division_offline_accept_response.getMsg();
			this.returnCode = ysepay_single_division_offline_accept_response.getReturnCode();
			this.returnInfo = ysepay_single_division_offline_accept_response.getRetrunInfo();
		} else if (this.ysepay_single_division_offline_query_response != null) {
			this.code = ysepay_single_division_offline_query_response.getCode();
			this.msg = ysepay_single_division_offline_query_response.getMsg();
			this.returnCode = ysepay_single_division_offline_query_response.getDivision_status_code();
			this.returnInfo = ysepay_single_division_offline_query_response.getDivision_status();
			System.out.println(ysepay_single_division_offline_query_response.getNote());
		}

		return this;
	}

	public class Division {

		private String code;

		private String msg;

		private String returnCode;

		private String retrunInfo;

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
		}

		public String getMsg() {
			return msg;
		}

		public void setMsg(String msg) {
			this.msg = msg;
		}

		public String getReturnCode() {
			return returnCode;
		}

		public void setReturnCode(String returnCode) {
			this.returnCode = returnCode;
		}

		public String getRetrunInfo() {
			return retrunInfo;
		}

		public void setRetrunInfo(String retrunInfo) {
			this.retrunInfo = retrunInfo;
		}

	}

	public class Query {

		private String code;

		private String msg;

		private String note;

		private String division_status_code;

		private String division_status;

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
		}

		public String getMsg() {
			return msg;
		}

		public void setMsg(String msg) {
			this.msg = msg;
		}

		public String getNote() {
			return note;
		}

		public void setNote(String note) {
			this.note = note;
		}

		public String getDivision_status_code() {
			return division_status_code;
		}

		public void setDivision_status_code(String division_status_code) {
			this.division_status_code = division_status_code;
		}

		public String getDivision_status() {
			return division_status;
		}

		public void setDivision_status(String division_status) {
			this.division_status = division_status;
		}

	}

}
