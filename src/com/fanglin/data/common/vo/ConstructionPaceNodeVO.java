package com.fanglin.data.common.vo;

import java.io.Serializable;

public class ConstructionPaceNodeVO implements Serializable {

	private static final long serialVersionUID = 7650786358582409834L;

	private Long cpnid;

	private Long cpid;

	private String name;

	private Integer connum;

	private Integer comnum;

	private Short status; // 0: 启用, 1: 禁用

	private String phase;

	private String material;

	private String period;

	private String content;

	private String comment;

	public ConstructionPaceNodeVO() {
		super();
	}

	public Long getCpnid() {
		return cpnid;
	}

	public void setCpnid(Long cpnid) {
		this.cpnid = cpnid;
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

	public Integer getConnum() {
		return connum;
	}

	public void setConnum(Integer connum) {
		this.connum = connum;
	}

	public Integer getComnum() {
		return comnum;
	}

	public void setComnum(Integer comnum) {
		this.comnum = comnum;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getPhase() {
		return phase;
	}

	public void setPhase(String phase) {
		this.phase = phase;
	}

	public String getMaterial() {
		return material;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
