package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "surveyoption", catalog = "customer")
public class SurveyOptionPO implements Serializable {

	private static final long serialVersionUID = -6331344145504090936L;

	public static short CHECKED_INIT_INT = 1;

	private long soid;

	private long siid;

	private long sid;

	private String title;

	private short checked;

	public SurveyOptionPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "soid")
	public long getSoid() {
		return soid;
	}

	public void setSoid(long soid) {
		this.soid = soid;
	}

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

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "checked")
	public short getChecked() {
		return checked;
	}

	public void setChecked(short checked) {
		this.checked = checked;
	}

}
