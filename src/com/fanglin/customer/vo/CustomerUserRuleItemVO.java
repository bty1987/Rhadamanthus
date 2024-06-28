package com.fanglin.customer.vo;

import java.io.Serializable;

public class CustomerUserRuleItemVO implements Serializable {

	private static final long serialVersionUID = 6941559609803170652L;

	private Long curiid;

	private Long curid;

	private String name;

	private Short type;

	private Integer uppval;

	private Integer lowval;

	public CustomerUserRuleItemVO() {
		super();
	}

	public Long getCuriid() {
		return curiid;
	}

	public void setCuriid(Long curiid) {
		this.curiid = curiid;
	}

	public Long getCurid() {
		return curid;
	}

	public void setCurid(Long curid) {
		this.curid = curid;
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

	public Integer getUppval() {
		return uppval;
	}

	public void setUppval(Integer uppval) {
		this.uppval = uppval;
	}

	public Integer getLowval() {
		return lowval;
	}

	public void setLowval(Integer lowval) {
		this.lowval = lowval;
	}

}
