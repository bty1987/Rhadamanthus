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

package com.fanglin.wechat.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
// @Table(name = "wechatappsession", catalog = "hades")
@Table(name = "wxappsession", catalog = "hades")
public class WeChatAppSessionPO implements java.io.Serializable {

	private static final long serialVersionUID = -7283855201379329855L;

	public static final String COLUMN_CODE_STR = "code";

	public static final String COLUMN_OPENID_STR = "openId";

	private long wxasId;

	private String code;

	private String sessionKey;

	private String openId;

	private long operateTime;

	public WeChatAppSessionPO() {
		super();
	}

	public WeChatAppSessionPO(String code, String sessionKey, String openId, long operateTime) {
		super();
		this.code = code;
		this.sessionKey = sessionKey;
		this.openId = openId;
		this.operateTime = operateTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wxasId")
	public long getWxasId() {
		return wxasId;
	}

	public void setWxasId(long wxasId) {
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
	public long getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(long operateTime) {
		this.operateTime = operateTime;
	}

}
