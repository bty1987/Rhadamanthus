package com.fanglin.data.common.vo;

import java.io.Serializable;

public class FlowpathVO implements Serializable {

	private static final long serialVersionUID = 7947027665683137145L;

	private Long fpid;

	private String name;

	private String no;

	private String keyword;

	private Short type;

	private Short status;

	public FlowpathVO() {
		super();
	}

	public Long getFpid() {
		return fpid;
	}

	public void setFpid(Long fpid) {
		this.fpid = fpid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
