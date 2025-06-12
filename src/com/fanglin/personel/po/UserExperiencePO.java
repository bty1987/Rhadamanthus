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

	private static final long serialVersionUID = 8111974803190366547L;

	private long upid;

	private int uid;

	private UserPO operator;

	private String type;

	private short isPrefor;

	private Timestamp createTime;

	private String comment;

	private Timestamp operateTime;

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

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "operateTime")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ouid", referencedColumnName = "uid")
	public UserPO getOperator() {
		return operator;
	}

	public void setOperator(UserPO operator) {
		this.operator = operator;
	}

}
