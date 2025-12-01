package com.fanglin.yspay.union;

import java.io.Serializable;

public class SsoToken implements Serializable {

	private static final long serialVersionUID = -5006580233073349083L;

    private String userId;

    private String code;

    private String token;

    private Integer expiresIn;
    
    private String domain;

	public SsoToken() {
		super();
	}


    public SsoToken(String userId, String code, String token,
			Integer expiresIn, String domain) {
		super();
		this.userId = userId;
		this.code = code;
		this.token = token;
		this.expiresIn = expiresIn;
		this.domain = domain;
	}

	public String getUserId() {
		return userId;
	}


	public void setUserId(String userId) {
		this.userId = userId;
	}


	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Integer getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(Integer expiresIn) {
		this.expiresIn = expiresIn;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

}
