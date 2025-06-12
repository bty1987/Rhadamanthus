package com.fanglin.customer.vo;

import java.io.Serializable;
import java.util.List;

public class CustomerProfileItemVO implements Serializable {

	private static final long serialVersionUID = -3447745383421129107L;

	private Long cpiid;

	private Long cpid;

	private String name;

	private Short type;

	private Short require;

	private String content;

	private List<CustomerProfileOptionVO> options;

	public CustomerProfileItemVO() {
		super();
	}

	public CustomerProfileItemVO(List<CustomerProfileOptionVO> options) {
		super();
		this.options = options;
	}

	public Long getCpiid() {
		return cpiid;
	}

	public void setCpiid(Long cpiid) {
		this.cpiid = cpiid;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
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

	public Short getRequire() {
		return require;
	}

	public void setRequire(Short require) {
		this.require = require;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public List<CustomerProfileOptionVO> getOptions() {
		return options;
	}

	public void setOptions(List<CustomerProfileOptionVO> options) {
		this.options = options;
	}

}
