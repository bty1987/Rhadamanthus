package com.fanglin.data.common.vo;

import java.util.List;

public class SurveyTemplateItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 7992373106128702854L;

	private Long stiid;

	private Long stid;

	private String name;

	private Short type;

	private Short require;

	private String content;

	private List<SurveyTemplateOptionVO> options;

	private Long sort;

	public SurveyTemplateItemVO() {
		super();
	}

	public SurveyTemplateItemVO(List<SurveyTemplateOptionVO> options) {
		super();
		this.options = options;
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

	public Long getStiid() {
		return stiid;
	}

	public void setStiid(Long stiid) {
		this.stiid = stiid;
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

	public List<SurveyTemplateOptionVO> getOptions() {
		return options;
	}

	public void setOptions(List<SurveyTemplateOptionVO> options) {
		this.options = options;
	}

	public Long getSort() {
		return sort;
	}

	public void setSort(Long sort) {
		this.sort = sort;
	}

}
