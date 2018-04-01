package com.fanglin.right.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "houseSourceDepartmentright", catalog = "platform")
public class HouseSourceDepartmentRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 8662490182490903385L;
	
	public static final int DEPARTMENT_ALL_ENABLE_INT = -1;
	
	public static final String COLUMN_UID_STR = "uid";
	
	public static final String COLUMN_COMPANY_STR = "company";

	private int hsdrId;
	
	private int uid;
	
	private int did;
	
	private int company;

	public HouseSourceDepartmentRightPO() {
		super();
	}
	
	public HouseSourceDepartmentRightPO(int uid, int did) {
		super();
		this.uid = uid;
		this.did = did;
	}

	public HouseSourceDepartmentRightPO(int uid, int did, int company) {
		super();
		this.uid = uid;
		this.did = did;
		this.company = company;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "hsdrId")
	public int getHsdrId() {
		return this.hsdrId;
	}

	public void setHsdrId(int hsdrId) {
		this.hsdrId = hsdrId;
	}

	@Column(name = "uid")
	public int getUid() {
		return this.uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@Column(name = "did")
	public int getDid() {
		return this.did;
	}

	public void setDid(int did) {
		this.did = did;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}