package com.fanglin.data.common.vo;

import java.io.Serializable;

public class FlowitemVO implements Serializable {

	private static final long serialVersionUID = 7947027665683137145L;

	private Long fiid;

	private Long fpid;

	private String name;

	private String content;

	private Short type;

	private Integer x;

	private Integer y;

	private Long pfiid;

	private Long nfiid;

	public FlowitemVO() {
		super();
	}

	public Long getFiid() {
		return fiid;
	}

	public void setFiid(Long fiid) {
		this.fiid = fiid;
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Integer getX() {
		return x;
	}

	public void setX(Integer x) {
		this.x = x;
	}

	public Integer getY() {
		return y;
	}

	public void setY(Integer y) {
		this.y = y;
	}

	public Long getPfiid() {
		return pfiid;
	}

	public void setPfiid(Long pfiid) {
		this.pfiid = pfiid;
	}

	public Long getNfiid() {
		return nfiid;
	}

	public void setNfiid(Long nfiid) {
		this.nfiid = nfiid;
	}

}
