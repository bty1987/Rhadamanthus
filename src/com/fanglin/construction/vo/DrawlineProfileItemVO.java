package com.fanglin.construction.vo;

import java.io.Serializable;
import java.util.List;

public class DrawlineProfileItemVO implements Serializable {

	private static final long serialVersionUID = -444774538342112912L;

	private Long dpiid;

	private Long dpid;

	private String name;

	private Short type;

	private Short require;

	private String content;

	private List<DrawlineProfileOptionVO> options;

	public DrawlineProfileItemVO() {
		super();
	}

	public DrawlineProfileItemVO(List<DrawlineProfileOptionVO> options) {
		super();
		this.options = options;
	}

	public Long getDpiid() {
		return dpiid;
	}

	public void setDpiid(Long dpiid) {
		this.dpiid = dpiid;
	}

	public Long getDpid() {
		return dpid;
	}

	public void setDpid(Long dpid) {
		this.dpid = dpid;
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

	public List<DrawlineProfileOptionVO> getOptions() {
		return options;
	}

	public void setOptions(List<DrawlineProfileOptionVO> options) {
		this.options = options;
	}

}
