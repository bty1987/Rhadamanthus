package com.fanglin.decoration.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "decorationUser", catalog = "decoration")
public class DecorationUserPO implements Serializable {

	private static final long serialVersionUID = 6764019265517629272L;

	public static final String DECORATION_ORDERID_STR = "orderId";

	private long duid;

	private String orderId;

	private UserPO user;

	private short isShow;

	private short isPay;

	private String content;

	@Id
	@GeneratedValue
	@Column(name = "duid")
	public long getDuid() {
		return duid;
	}

	public void setDuid(long duid) {
		this.duid = duid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "user", referencedColumnName = "uId")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "isShow")
	public short getIsShow() {
		return isShow;
	}

	public void setIsShow(short isShow) {
		this.isShow = isShow;
	}

	@Column(name = "isPay")
	public short getIsPay() {
		return isPay;
	}

	public void setIsPay(short isPay) {
		this.isPay = isPay;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
