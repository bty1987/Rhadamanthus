package com.fanglin.customer.po;

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
@Table(name = "surveyitem", catalog = "customer")
public class SurveyItemPO implements Serializable {

	private static final long serialVersionUID = -643388539278030310L;

	public static final short TYPE_TEXT_INT = 0;

	public static final short TYPE_INPUT_INT = 1;

	public static final short TYPE_RADIO_INT = 2;

	public static final short TYPE_CHECK_INT = 3;

	private long siid;

	private long sid;

	private String name;

	private short type;

	private String content;

	private List<SurveyOptionPO> options;

	public SurveyItemPO() {
		super();
	}

	public SurveyItemPO(long siid) {
		super();
		this.siid = siid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "siid")
	public long getSiid() {
		return siid;
	}

	public void setSiid(long siid) {
		this.siid = siid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
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

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@OneToMany(mappedBy = "siid", fetch = FetchType.LAZY)
	public List<SurveyOptionPO> getOptions() {
		return options;
	}

	public void setOptions(List<SurveyOptionPO> options) {
		this.options = options;
	}

}
