package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.util.List;

public class QuotationProfileItemVO implements Serializable {

	private static final long serialVersionUID = -4447745383421129107L;

	private Long qpiid;

	private Long qpid;

	private String name;

	private Short type;

	private Short require;

	private String content;

	private List<QuotationProfileOptionVO> options;

	public QuotationProfileItemVO() {
		super();
	}

	public QuotationProfileItemVO(List<QuotationProfileOptionVO> options) {
		super();
		this.options = options;
	}

	public Long getQpiid() {
		return qpiid;
	}

	public void setQpiid(Long qpiid) {
		this.qpiid = qpiid;
	}

	public Long getQpid() {
		return qpid;
	}

	public void setQpid(Long qpid) {
		this.qpid = qpid;
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

	public List<QuotationProfileOptionVO> getOptions() {
		return options;
	}

	public void setOptions(List<QuotationProfileOptionVO> options) {
		this.options = options;
	}

}
