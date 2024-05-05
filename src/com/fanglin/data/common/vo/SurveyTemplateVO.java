package com.fanglin.data.common.vo;

import java.io.Serializable;
import java.util.List;

import com.fanglin.data.po.SurveyTemplatePO;

public class SurveyTemplateVO implements Serializable {

	private static final long serialVersionUID = -5695437132754725625L;

	private Long stid;

	private String name;

	private Short status;

	private Short isSend;

	private Integer company;

	private List<SurveyTemplateItemVO> items;

	public SurveyTemplateVO() {
		super();
	}

	public SurveyTemplateVO(List<SurveyTemplateItemVO> items) {
		super();
		this.items = items;
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getIsSend() {
		return isSend;
	}

	public void setIsSend(Short isSend) {
		this.isSend = isSend;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public List<SurveyTemplateItemVO> getItems() {
		return items;
	}

	public void setItems(List<SurveyTemplateItemVO> items) {
		this.items = items;
	}

	public SurveyTemplateVO setBaseInfo(SurveyTemplatePO surveyTemplatePO) {

		if (surveyTemplatePO != null) {
			setStid(surveyTemplatePO.getStid());
			setName(surveyTemplatePO.getName());
			setStatus(surveyTemplatePO.getStatus());
		}

		return this;
	}

}
