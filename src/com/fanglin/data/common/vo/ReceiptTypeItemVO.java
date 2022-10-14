package com.fanglin.data.common.vo;

import java.io.Serializable;

public class ReceiptTypeItemVO implements Serializable {

	private static final long serialVersionUID = 6370446444060606873L;

	private Long rtiid;

	private Long rtid;

	private String no;

	private String name;

	private Short type;

	private Short paytype;

	public ReceiptTypeItemVO() {
		super();
	}

	public Long getRtiid() {
		return rtiid;
	}

	public void setRtiid(Long rtiid) {
		this.rtiid = rtiid;
	}

	public Long getRtid() {
		return rtid;
	}

	public void setRtid(Long rtid) {
		this.rtid = rtid;
	}

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

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getPaytype() {
		return paytype;
	}

	public void setPaytype(Short paytype) {
		this.paytype = paytype;
	}

}
