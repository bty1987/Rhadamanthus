package com.fanglin.factory.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "token", catalog = "factory")
public class TokenPO implements java.io.Serializable {

	private static final long serialVersionUID = 1882441699733061388L;

	public static final String COLUMN_KEY_STR = "key";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short STATUS_DISABLE_INT = 1;

	private long tid;

	private String key;

	private short status;

	private int buid;

	private short timeout;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "tid")
	public long getTid() {
		return this.tid;
	}

	public void setTid(long tid) {
		this.tid = tid;
	}

	@Column(name = "key")
	public String getKey() {
		return this.key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	@Column(name = "status")
	public short getStatus() {
		return this.status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	// 关联 communion.user.uid: 0=不绑定(兼容存量行),>0 时该码仅可为对应 uid 换票
	@Column(name = "buid")
	public int getBuid() {
		return this.buid;
	}

	public void setBuid(int buid) {
		this.buid = buid;
	}

	// 会话超时档位: 0=正常超时(cookieOvertime), -1=永久(签发映射 TIMEOUT_INT)
	// 列名用正确拼写 timeout;Authentication 内部 timout 系历史错拼,票据协议键实为 "timeout="
	@Column(name = "timeout")
	public short getTimeout() {
		return this.timeout;
	}

	public void setTimeout(short timeout) {
		this.timeout = timeout;
	}

}