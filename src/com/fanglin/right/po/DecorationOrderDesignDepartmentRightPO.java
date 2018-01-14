package com.fanglin.right.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationorderdesigndepartmentright", catalog = "platform")
public class DecorationOrderDesignDepartmentRightPO implements java.io.Serializable {

	private static final long serialVersionUID = -2244025448541318424L;
	
	public static final int DEPARTMENT_ALL_ENABLE_INT = -1;
	
	public static final String COLUMN_UID_STR = "uid";
	
	public static final String COLUMN_COMPANY_STR = "company";

	private int doddrId;
	
	private int uid;
	
	private int did;
	
	private int company;

	public DecorationOrderDesignDepartmentRightPO() {
		super();
	}

	public DecorationOrderDesignDepartmentRightPO(int uid, int did, int company) {
		super();
		this.uid = uid;
		this.did = did;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "doddrId")
	public int getDoddrId() {
		return this.doddrId;
	}

	public void setDoddrId(int doddrId) {
		this.doddrId = doddrId;
	}

	@Column(name = "uId")
	public int getUid() {
		return this.uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@Column(name = "dId")
	public int getDid() {
		return this.did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}