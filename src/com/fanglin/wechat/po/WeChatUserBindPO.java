/**
 * @File Name		: WeChatUserBindPO.java
 * @Package   	: com.fanglin.wechat.po
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信用户绑定持久化对象
 */

package com.fanglin.wechat.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
// @Table(name = "wechatuserbind", catalog = "wechat")
@Table(name = "puser", catalog = "hades")
public class WeChatUserBindPO implements Serializable {

	private static final long serialVersionUID = 2294962304096517553L;

	public static final String COLUMN_UNIONID_STR = "unionId";

	public static final short STATUS_ENABLED_INT = 0;

	public static final short STATUS_DISABLED_INT = 1;

	private long puid;

	private String unionId;

	private String userId;

	private short status;

	public WeChatUserBindPO() {
		super();
	}

	public WeChatUserBindPO(String unionId, String userId) {
		super();
		this.unionId = unionId;
		this.userId = userId;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "puid")
	public long getPuid() {
		return puid;
	}

	public void setPuid(long puid) {
		this.puid = puid;
	}

	@Column(name = "unionId")
	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	@Column(name = "userId")
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
}
