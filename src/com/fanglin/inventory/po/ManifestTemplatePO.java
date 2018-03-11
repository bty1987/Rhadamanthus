package com.fanglin.inventory.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "manifesttemplate", catalog = "inventory")
public class ManifestTemplatePO implements java.io.Serializable {

	private static final long serialVersionUID = -4378871277910572592L;
	
	public static final String COLUMN_MTID_STR = "mtId";
	
	public static final String COLUMN_NAME_STR = "name";
	
	public static final String COLUMN_COMPANY_STR ="company";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	private long mtId;
	
	private String name;
	
	private String comment;
	
	private short status;
	
	private int company;

	public ManifestTemplatePO() {
		super();
	}

	public ManifestTemplatePO(long mtId) {
		super();
		this.mtId = mtId;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mtId")
	public long getMtId() {
		return this.mtId;
	}

	public void setMtId(long mtId) {
		this.mtId = mtId;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "comment")
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
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

}