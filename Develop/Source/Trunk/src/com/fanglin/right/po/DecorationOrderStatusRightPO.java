package com.fanglin.right.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationorderstatusright", catalog = "platform")
public class DecorationOrderStatusRightPO implements java.io.Serializable {

	private static final long serialVersionUID = 6652444709974531640L;
	
	public static final String COLUMN_UID_STR = "uid";

	private int dosrId;
	
	private int uid;
	
	private String status;
	
	public DecorationOrderStatusRightPO() {
		super();
	}

	public DecorationOrderStatusRightPO(int uid, String status) {
		super();
		this.uid = uid;
		this.status = status;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dosrId")
	public int getDosrId() {
		return this.dosrId;
	}

	public void setDosrId(int dosrId) {
		this.dosrId = dosrId;
	}

	@Column(name = "uId")
	public int getUid() {
		return this.uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@Column(name = "status")
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}