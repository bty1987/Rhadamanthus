package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationmeasurerule", catalog = "data")
public class DecorationMeasureRulePO implements Serializable {

	private static final long serialVersionUID = 5783409708080638787L;

	public static final short STATUS_ENABLE_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	private long dmrid;

	private String name;

	private short status;

	private String comment;

	public DecorationMeasureRulePO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dmrid")
	public long getDmrid() {
		return dmrid;
	}

	public void setDmrid(long dmrid) {
		this.dmrid = dmrid;
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
