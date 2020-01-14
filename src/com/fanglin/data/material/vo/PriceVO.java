package com.fanglin.data.material.vo;

import java.io.Serializable;

public class PriceVO implements Serializable {

	private static final long serialVersionUID = 2071926624574198033L;

	private Long pid;

	private Long gid;

	private String name;

	private Short type; // 0-正价/1-特价

	private Integer purchase; // 进价

	private Integer selling;// 售价

	private Short ctype; // 结算类型,0:底价,1:点位

	private Integer cvalue; // 结算值 , 点位结算对应结算值为0~1之前三位小数 , 底价结算对应结算值为浮点数

	private String content;

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Long getGid() {
		return gid;
	}

	public void setGid(Long gid) {
		this.gid = gid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getPurchase() {
		return purchase;
	}

	public void setPurchase(Integer purchase) {
		this.purchase = purchase;
	}

	public Integer getSelling() {
		return selling;
	}

	public void setSelling(Integer selling) {
		this.selling = selling;
	}

	public Short getCtype() {
		return ctype;
	}

	public void setCtype(Short ctype) {
		this.ctype = ctype;
	}

	public Integer getCvalue() {
		return cvalue;
	}

	public void setCvalue(Integer cvalue) {
		this.cvalue = cvalue;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
