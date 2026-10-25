package com.fanglin.elecsign.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 电子签客户认证信息（按厂商各一份）——signno 双厂商命名空间的结构化落地:
 * 一客户一厂商一行(UNIQUE cid+provider), 切换签约方式互不覆盖,
 * 法大大 customerId 与 e签宝 psnId 各存各的, 客户基础资料仍归 communion.customer
 */
@Entity
@Table(name = "elecsignauth", catalog = "communion")
public class ElecsignAuthPO implements Serializable {

	private static final long serialVersionUID = 621007010000001L;

	public static final short STATUS_INIT_INT = 0;// 初始(已注册账号未实名)

	public static final short STATUS_AUTH_INT = 1;// 已实名

	public static final short STATUS_AUTHED_INT = 2;// 已签署(对齐CustomerPO语义, 兼容预留)

	private int eaid;

	private int cid;// 客户 communion.customer.cid

	private short provider;// 电子签厂商(1法大大/2e签宝)

	private String signno;// 厂商账号(法大大customerId/e签宝psnId)

	private String authurl;// 认证链接

	private String token;// 认证流凭证(法大大transactionNo/e签宝authFlowId)

	private short status;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "eaid")
	public int getEaid() {
		return eaid;
	}

	public void setEaid(int eaid) {
		this.eaid = eaid;
	}

	@Column(name = "cid")
	public int getCid() {
		return cid;
	}

	public void setCid(int cid) {
		this.cid = cid;
	}

	@Column(name = "provider")
	public short getProvider() {
		return provider;
	}

	public void setProvider(short provider) {
		this.provider = provider;
	}

	@Column(name = "signno")
	public String getSignno() {
		return signno;
	}

	public void setSignno(String signno) {
		this.signno = signno;
	}

	@Column(name = "authurl")
	public String getAuthurl() {
		return authurl;
	}

	public void setAuthurl(String authurl) {
		this.authurl = authurl;
	}

	@Column(name = "token")
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

}
