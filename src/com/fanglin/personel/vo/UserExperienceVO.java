/**
 * Title: UserExperienceVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

public class UserExperienceVO implements Serializable {

	private static final long serialVersionUID = 8111974803190366547L;

	private Long upid;

	private Integer uid;

	private UserBaseVO operator;

	private String type;

	private Timestamp createTime;

	private String comment;

	private Timestamp operateTime;

	public UserExperienceVO() {
		super();
	}

	public UserExperienceVO(UserBaseVO operator) {
		super();
		this.operator = operator;
	}

	public Long getUpid() {
		return upid;
	}

	public void setUpid(Long upid) {
		this.upid = upid;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public UserBaseVO getOperator() {
		return operator;
	}

	public void setOperator(UserBaseVO operator) {
		this.operator = operator;
	}
}
