package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "surveytemplate", catalog = "data")
public class SurveyTemplatePO implements Serializable {

	private static final long serialVersionUID = -3744114086090973975L;

	private long stid;

	private String name;

	private short status;

	private int company;

	private List<SurveyTemplateItemPO> items;

	public SurveyTemplatePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "stid")
	public long getStid() {
		return stid;
	}

	public void setStid(long stid) {
		this.stid = stid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@OneToMany(mappedBy = "stid", fetch = FetchType.LAZY)
	public List<SurveyTemplateItemPO> getItems() {
		return items;
	}

	public void setItems(List<SurveyTemplateItemPO> items) {
		this.items = items;
	}

}
