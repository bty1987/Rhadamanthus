package com.fanglin.communion.vo;

import java.io.Serializable;

public class VscoreVO implements Serializable {

	private static final long serialVersionUID = 5450420287962263536L;

	private Long vsid;
	
	private String unionId;
	
	private Integer score;
	
	public VscoreVO(){
		super();
	}

	public Long getVsid() {
		return vsid;
	}

	public void setVsid(Long vsid) {
		this.vsid = vsid;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}
	
	
}
