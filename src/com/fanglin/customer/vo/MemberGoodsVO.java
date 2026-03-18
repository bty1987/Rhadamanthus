package com.fanglin.customer.vo;

import java.io.Serializable;

public class MemberGoodsVO implements Serializable {

	private static final long serialVersionUID = -1009004772661329833L;

	private String no;

	private String name;

	private String category;

	private Integer point;

	private Short isPrefor; // 是否计算业绩（0=计算, 1=不计算）

	private Short isPayment; // 是否计入金额（0=计入, 1=不计入）

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

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Integer getPoint() {
		return point;
	}

	public void setPoint(Integer point) {
		this.point = point;
	}

	public Short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(Short isPrefor) {
		this.isPrefor = isPrefor;
	}

	public Short getIsPayment() {
		return isPayment;
	}

	public void setIsPayment(Short isPayment) {
		this.isPayment = isPayment;
	}

}
