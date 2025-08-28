package com.fanglin.market.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="eopinions", catalog = "market")
public class EopinionsPO implements Serializable{

	private static final long serialVersionUID = -2441019342075110879L;

	public static final String COLUMN_TYPE_STR = "type";

	private long eoid;

	private long ecid;

	private long esid;

	private short type;

	private String title;

	private String content;

	public EopinionsPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name="eoid")
	public long getEoid() {
		return eoid;
	}

	public void setEoid(long eoid) {
		this.eoid = eoid;
	}

	@Column(name="ecid")
	public long getEcid() {
		return ecid;
	}

	public void setEcid(long ecid) {
		this.ecid = ecid;
	}

	@Column(name="esid")
	public long getEsid() {
		return esid;
	}

	public void setEsid(long esid) {
		this.esid = esid;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
