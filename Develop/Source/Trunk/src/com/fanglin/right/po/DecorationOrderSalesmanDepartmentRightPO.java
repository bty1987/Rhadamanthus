package com.fanglin.right.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationordersalesmandepartmentright", catalog = "platform")
public class DecorationOrderSalesmanDepartmentRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 8662490182490903380L;
	
	public static final String COLUMN_UID_STR = "uid";

	private int dosdrId;
	
	private int uid;
	
	private int did;

	public DecorationOrderSalesmanDepartmentRightPO() {
		super();
	}

	public DecorationOrderSalesmanDepartmentRightPO(int uid, int did) {
		super();
		this.uid = uid;
		this.did = did;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dosdrId")
	public int getDosdrId() {
		return this.dosdrId;
	}

	public void setDosdrId(int dosdrId) {
		this.dosdrId = dosdrId;
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