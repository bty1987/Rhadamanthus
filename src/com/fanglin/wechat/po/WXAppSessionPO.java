/**
 * @File Name		: WXAppSessionPO.java
 * @Package   	: com.fanglin.common.po
 * @Version		: 1.0
 * @Date			: 2017-5-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "wxappsession", catalog = "hades")
public class WXAppSessionPO implements java.io.Serializable {

	private static final long serialVersionUID = -7283855201379329855L;
	
	public static final String COLUMN_CODE_STR = "code";
	
	public static final String COLUMN_OPENID_STR = "openId";
	
	private Long wxasId;
	
	private String code;
	
	private String sessionKey;
	
	private String openId;
	
	private Long operateTime;

	public WXAppSessionPO() {
		super();
	}

	public WXAppSessionPO(String code, String sessionKey, String openId, Long operateTime) {
		super();
		this.code = code;
		this.sessionKey = sessionKey;
		this.openId = openId;
		this.operateTime = operateTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wxasId")
	public Long getWxasId() {
		return wxasId;
	}

	public void setWxasId(Long wxasId) {
		this.wxasId = wxasId;
	}

	@Column(name = "code")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "sessionKey")
	public String getSessionKey() {
		return sessionKey;
	}

	public void setSessionKey(String sessionKey) {
		this.sessionKey = sessionKey;
	}

	@Column(name = "openId")
	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	@Column(name = "operateTime")
	public Long getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Long operateTime) {
		this.operateTime = operateTime;
	}
	
}
