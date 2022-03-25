package com.fanglin.customer.vo;

import java.io.Serializable;
import java.util.List;

public class SurveyItemVO implements Serializable{
	
	private static final long serialVersionUID = 4750568693936289936L;

	private Long siid;
	
	private Long sid;
	
	private String name;
	
	private Short type;
	
	private String content;
	
	private List<SurveyOptionVO> options;
	
	public SurveyItemVO() {
		super();
	}
	
	public SurveyItemVO(List<SurveyOptionVO> options) {
		super();
		this.options = options;
	}

	public Long getSiid() {
		return siid;
	}

	public void setSiid(Long siid) {
		this.siid = siid;
	}

	public Long getSid() {
		return sid;
	}

	public void setSid(Long sid) {
		this.sid = sid;
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public List<SurveyOptionVO> getOptions() {
		return options;
	}

	public void setOptions(List<SurveyOptionVO> options) {
		this.options = options;
	}
	
}
