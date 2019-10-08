package com.yspay.bean;

public class Response {

	private String sign;

	private division ysepay_single_division_online_accept_response;

	private division ysepay_single_division_offline_accept_response;

	private String code;

	private String msg;

	private String returnCode;

	private String returnInfo;

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public division getYsepay_single_division_online_accept_response() {
		return ysepay_single_division_online_accept_response;
	}

	public void setYsepay_single_division_online_accept_response(division ysepay_single_division_online_accept_response) {
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
		}

		return this;
	}

	public class division {

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

}
