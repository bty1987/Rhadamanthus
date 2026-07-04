package com.fanglin.construction.vo;

import java.io.Serializable;
import java.util.List;

public class ConstructionProfileItemVO implements Serializable {

	private static final long serialVersionUID = -444774538342112911L;

	private Long cpiid;

	private Long cpid;

	private String name;

	private Short type;

	private Short require;

	private String content;

	private List<ConstructionProfileOptionVO> options;

	public ConstructionProfileItemVO() {
		super();
	}

	public ConstructionProfileItemVO(List<ConstructionProfileOptionVO> options) {
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

	public List<ConstructionProfileOptionVO> getOptions() {
		return options;
	}

	public void setOptions(List<ConstructionProfileOptionVO> options) {
		this.options = options;
	}

}
