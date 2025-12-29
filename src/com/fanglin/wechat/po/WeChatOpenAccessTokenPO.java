package com.fanglin.wechat.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
// @Table(name = "wechatopenaccesstoken", catalog = "wechat")
@Table(name = "wopenaccesstoken", catalog = "hades")
public class WeChatOpenAccessTokenPO implements java.io.Serializable {

	private static final long serialVersionUID = 5715334057548940175L;

	public static final String COLUMN_CODE_STR = "code";

	private long woatId;

	private String code;

	private String accesstoken;

	private String openId;

	private long operateTime;

	public WeChatOpenAccessTokenPO() {
		super();
	}

	public WeChatOpenAccessTokenPO(String code, String accesstoken, String openId, Long operateTime) {
		super();
		this.code = code;
		this.accesstoken = accesstoken;
		this.openId = openId;
		this.operateTime = operateTime;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "woatId")
	public long getWoatId() {
		return woatId;
	}

	public void setWoatId(long woatId) {
		this.woatId = woatId;
	}

	@Column(name = "code")
	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "accesstoken")
	public String getAccesstoken() {
		return this.accesstoken;
	}

	public void setAccesstoken(String accesstoken) {
		this.accesstoken = accesstoken;
	}

	@Column(name = "openId")
	public String getOpenId() {
		return this.openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	@Column(name = "operateTime")
	public long getOperateTime() {
		return this.operateTime;
	}

	public void setOperateTime(long operateTime) {
		this.operateTime = operateTime;
	}

}
