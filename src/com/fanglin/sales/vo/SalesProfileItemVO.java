package com.fanglin.sales.vo;

import java.io.Serializable;
import java.util.List;

public class SalesProfileItemVO implements Serializable {

	private static final long serialVersionUID = -806355740592841837L;

	private Long spiid;

	private Long spid;

	private String name;

	private Long bid;

	private Short type;

	private Short require;

	private String content;

	private List<SalesProfileOptionVO> options;

	public SalesProfileItemVO() {
		super();
	}

	public SalesProfileItemVO(List<SalesProfileOptionVO> options) {
		super();
		this.options = options;
	}

	public Long getSpiid() {
		return spiid;
	}

	public void setSpiid(Long spiid) {
		this.spiid = spiid;
	}

	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
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

	public List<SalesProfileOptionVO> getOptions() {
		return options;
	}

	public void setOptions(List<SalesProfileOptionVO> options) {
		this.options = options;
	}

}
