/**
 * @File Name		: FLException.java
 * @Package   	: com.fanglin.core.interceptor
 * @Version		: 1.0
 * @Date			: 2015-6-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.core.interceptor;

import java.util.List;

public class FLException extends RuntimeException {

	private static final long serialVersionUID = 7028943330243015645L;
	
	private int code;
	
	private String errorMessage;
	
	private List<String> errorArgs;
	
	public FLException(int code) {
		super();
		this.code = code;
	}

	public FLException(int code, String errorMessage) {
		super();
		this.code = code;
		this.errorMessage = errorMessage;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public List<String> getErrorArgs() {
		return errorArgs;
	}

	public void setErrorArgs(List<String> errorArgs) {
		this.errorArgs = errorArgs;
	}
	
}
