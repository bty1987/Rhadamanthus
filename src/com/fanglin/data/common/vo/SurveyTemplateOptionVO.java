package com.fanglin.data.common.vo;

public class SurveyTemplateOptionVO implements java.io.Serializable {

	private static final long serialVersionUID = 1615740458357810080L;

	private Long stoid;

	private Long stiid;

	private Long stid;

	private String title;

	public SurveyTemplateOptionVO() {
		super();
	}

	public Long getStoid() {
		return stoid;
	}

	public void setStoid(Long stoid) {
		this.stoid = stoid;
	}

	public Long getStiid() {
		return stiid;
	}

	public void setStiid(Long stiid) {
		this.stiid = stiid;
	}

	public Long getStid() {
		return stid;
	}

	public void setStid(Long stid) {
		this.stid = stid;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}
