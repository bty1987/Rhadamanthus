package com.fanglin.customer.vo;

import java.io.Serializable;

public class GroupVO implements Serializable {

	private static final long serialVersionUID = -4891279810933343691L;

	private Long gid;

	private String opengid;

	private String orderId;

	private String name;

	private String content;

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getOpengid() {
		return opengid;
	}

	public void setOpengid(String opengid) {
		this.opengid = opengid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
