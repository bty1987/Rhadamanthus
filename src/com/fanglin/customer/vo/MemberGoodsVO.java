package com.fanglin.customer.vo;

import java.io.Serializable;

public class MemberGoodsVO implements Serializable {

	private static final long serialVersionUID = -1009004772661329833L;

	private String no;

	private String name;

	private String category;

	private Integer point;

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

}
