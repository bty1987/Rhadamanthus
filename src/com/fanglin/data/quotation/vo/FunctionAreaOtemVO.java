package com.fanglin.data.quotation.vo;

import java.io.Serializable;
import java.util.List;

public class FunctionAreaOtemVO implements Serializable {

	private static final long serialVersionUID = 6376033258048752812L;

	private Long faiid;

	private Long faid;

	private Long stid;

	private String name;

	private Short type;

	private Short require;

	private String content;

	private List<FunctionAreaOptionVO> options;

	public FunctionAreaOtemVO() {
		super();
	}

	public FunctionAreaOtemVO(Long faiid) {
		super();
		this.faiid = faiid;
	}

	public FunctionAreaOtemVO(List<FunctionAreaOptionVO> options) {
		super();
		this.options = options;
	}

	public Long getFaiid() {
		return faiid;
	}

	public void setFaiid(Long faiid) {
		this.faiid = faiid;
	}

	public Long getFaid() {
		return faid;
	}

	public void setFaid(Long faid) {
		this.faid = faid;
	}

	public Long getStid() {
		return stid;
	}

	public void setStid(Long stid) {
		this.stid = stid;
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

	public List<FunctionAreaOptionVO> getOptions() {
		return options;
	}

	public void setOptions(List<FunctionAreaOptionVO> options) {
		this.options = options;
	}

}
