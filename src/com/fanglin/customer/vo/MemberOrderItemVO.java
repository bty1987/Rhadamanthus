package com.fanglin.customer.vo;

import java.io.Serializable;

public class MemberOrderItemVO implements Serializable {

	private static final long serialVersionUID = 4776248810374257784L;

	private String no;

	private String name;

	private Integer point;

	private Integer num;

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

}
