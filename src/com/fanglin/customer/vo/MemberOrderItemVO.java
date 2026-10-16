package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class MemberOrderItemVO implements Serializable {

	private static final long serialVersionUID = 4776248810374257784L;

	private String no;

	private String name;

	private Integer point;

	private Integer num;

	private Timestamp expireTime; // 有效期

	private Short isPrefer;

	private Short isPayment;

	private String content;

	private Short type; // 类型: 0券/1物品, 未传兜底物品

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getPoint() {
		return point;
	}

	public void setPoint(Integer point) {
		this.point = point;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Timestamp getExpireTime() {
		return expireTime;
	}

	public void setExpireTime(Timestamp expireTime) {
		this.expireTime = expireTime;
	}

	public Short getIsPrefer() {
		return isPrefer;
	}

	public void setIsPrefer(Short isPrefer) {
		this.isPrefer = isPrefer;
	}

	public Short getIsPayment() {
		return isPayment;
	}

	public void setIsPayment(Short isPayment) {
		this.isPayment = isPayment;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

}
