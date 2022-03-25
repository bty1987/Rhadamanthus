package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "surveytemplateoption", catalog = "data")
public class SurveyTemplateOptionPO implements Serializable {

	private static final long serialVersionUID = 6570772259090181093L;

	private long stoid;

	private long stiid;

	private long stid;

	private String title;

	public SurveyTemplateOptionPO() {
		super();
	}

	public SurveyTemplateOptionPO(long stoid) {
		super();
		this.stoid = stoid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "stoid")
	public long getStoid() {
		return stoid;
	}

	public void setStoid(long stoid) {
		this.stoid = stoid;
	}

	@Column(name = "stiid")
	public long getStiid() {
		return stiid;
	}

	public void setStiid(long stiid) {
		this.stiid = stiid;
	}

	@Column(name = "[stid]")
	public long getStid() {
		return stid;
	}

	public void setStid(long stid) {
		this.stid = stid;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}
