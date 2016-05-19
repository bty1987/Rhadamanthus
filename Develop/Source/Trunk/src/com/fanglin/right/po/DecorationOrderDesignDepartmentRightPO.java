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
	
	public static final String COLUMN_UID_STR = "uid";

	private int doddrId;
	
	private int uid;
	
	private int did;

	public DecorationOrderDesignDepartmentRightPO() {
		super();
	}

	public DecorationOrderDesignDepartmentRightPO(int uid, int did) {
		super();
		this.uid = uid;
		this.did = did;
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

}