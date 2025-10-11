/**
 * Title: UserExperiencePO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "userExperience", catalog = "communion")
public class UserExperiencePO implements Serializable {

	private static final long serialVersionUID = -7779388477309106067L;

	private long upid;

	private int uid;

	private UserPO operator;

	private String type;

	private short isPrefor;

	private int ocid;

	private int tcid;

	private int odid;

	private int tdid;

	private int orid;

	private int trid;

	private Timestamp createTime;

	private Timestamp operateTime;

	private String comment;

	public UserExperiencePO() {
		super();
	}

	public UserExperiencePO(UserPO operator) {
		super();
		this.operator = operator;
	}

	@Id
	@GeneratedValue
	@Column(name = "upid")
	public long getUpid() {
		return upid;
	}

	public void setUpid(long upid) {
		this.upid = upid;
	}

	@Column(name = "uid")
	public int getUid() {
		return uid;
	}

	public void setUid(int uid) {
		this.uid = uid;
	}

	@Column(name = "type")
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "isPrefor")
	public short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(short isPrefor) {
		this.isPrefor = isPrefor;
	}

	@Column(name = "ocid")
	public int getOcid() {
		return ocid;
	}

	public void setOcid(int ocid) {
		this.ocid = ocid;
	}

	@Column(name = "tcid")
	public int getTcid() {
		return tcid;
	}

	public void setTcid(int tcid) {
		this.tcid = tcid;
	}

	@Column(name = "odid")
	public int getOdid() {
		return odid;
	}

	public void setOdid(int odid) {
		this.odid = odid;
	}

	@Column(name = "tdid")
	public int getTdid() {
		return tdid;
	}

	public void setTdid(int tdid) {
		this.tdid = tdid;
	}

	@Column(name = "orid")
	public int getOrid() {
		return orid;
	}

	public void setOrid(int orid) {
		this.orid = orid;
	}

	@Column(name = "trid")
	public int getTrid() {
		return trid;
	}

	public void setTrid(int trid) {
		this.trid = trid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperator() {
		return operator;
	}

	public void setOperator(UserPO operator) {
		this.operator = operator;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
