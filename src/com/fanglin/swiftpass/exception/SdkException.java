package com.fanglin.swiftpass.exception;

/**
 * SDK异常
 * 
 */
public class SdkException extends Exception {

	private static final long serialVersionUID = 3021153021793986332L;

	private String code; // 异常码

	private String msg; // 异常信息

	private String traceId; // 异常跟踪ID

	public SdkException(SdkExType code) {
		this.code = code.getCode();
		this.msg = code.getMsg();
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

	public String getTraceId() {
		return traceId;
	}

	public void setTraceId(String traceId) {
		this.traceId = traceId;
	}

	@Override
	public String toString() {
		return "{\"code\":\"" + code + "\",\"msg\":\"[" + code + "]" + msg + "\",\"traceId\":\"OPEN-00-LOCAL-" + code.substring(code.length() - 3, code.length()) + "\"}";
	}

}
