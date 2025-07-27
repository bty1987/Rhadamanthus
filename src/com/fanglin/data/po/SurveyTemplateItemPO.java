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
@Table(name = "surveytemplateitem", catalog = "data")
public class SurveyTemplateItemPO implements Serializable {

	private static final long serialVersionUID = 6219800294521503246L;

	public static final short TYPE_TEXT_INT = 0;

	public static final short TYPE_INPUT_INT = 1;

	public static final short TYPE_RADIO_INT = 2;

	public static final short TYPE_CHECK_INT = 3;

	public static final short REQUIRE_REQUIRE_INT = 1;

	private long stiid;

	private long stid;

	private String name;

	private short type;

	private short require;

	private String content;

	private List<SurveyTemplateOptionPO> options;

	private long sort;

	public SurveyTemplateItemPO() {
		super();
	}

	public SurveyTemplateItemPO(long stiid) {
		super();
		this.stiid = stiid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "stiid")
	public long getStiid() {
		return stiid;
	}

	public void setStiid(long stiid) {
		this.stiid = stiid;
	}

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

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "`require`")
	public short getRequire() {
		return require;
	}

	public void setRequire(short require) {
		this.require = require;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@OneToMany(mappedBy = "stiid", fetch = FetchType.LAZY)
	public List<SurveyTemplateOptionPO> getOptions() {
		return options;
	}

	public void setOptions(List<SurveyTemplateOptionPO> options) {
		this.options = options;
	}

	@Column(name = "sort")
	public long getSort() {
		return sort;
	}

	public void setSort(long sort) {
		this.sort = sort;
	}

}
