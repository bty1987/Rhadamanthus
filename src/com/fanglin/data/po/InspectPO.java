package com.fanglin.data.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "inspect", catalog = "data")
public class InspectPO implements Serializable {

	private static final long serialVersionUID = 11524448435210485L;

	public static final String COLUMN_NAME_STR = "name";

	public static final String COLUMN_ATTTYPE_STR = "atttype";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short ATTTYPE_DECORATION_SHORT = 0;

	public static final short ATTTYPE_MATERIAL_SHORT = 1;

	public static final short STATUS_ENABLE_SHORT = 0;

	public static final short STATUS_DISABLE_SHORT = 1;

	private long iid;

	private String name;

	private short atttype;

	private short type;

	private short status;

	private String content;

	private int company;

	public InspectPO() {
		super();
	}

	public InspectPO(long iid) {
		super();
		this.iid = iid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "iid")
	public long getIid() {
		return iid;
	}

	public void setIid(long iid) {
		this.iid = iid;
	}

	@Column(name = "atttype")
	public short getAtttype() {
		return atttype;
	}

	public void setAtttype(short atttype) {
		this.atttype = atttype;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
