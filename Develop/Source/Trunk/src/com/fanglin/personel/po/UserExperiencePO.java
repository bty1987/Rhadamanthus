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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "userExperience", catalog = "communion")
public class UserExperiencePO implements Serializable {

	private static final long serialVersionUID = 8111974803190366547L;

	private Long id;

	private String userId;

	private String type;

	private String startTime;

	private String endTime;

	private String company;

	private String position;

	private String createTime;

	private String des;

	@Id
	@GeneratedValue
	@Column(nullable = false)
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}

	@Column(nullable = false)
	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	@Column(nullable = false)
	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	@Column(nullable = false)
	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	@Column(nullable = false)
	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	@Column(nullable = false)
	public String getCompany(){
		return company;
	}

	@Column(nullable = false)
	public void setCompany(String company){
		this.company = company;
	}

	@Column(nullable = false)
	public String getPosition(){
		return position;
	}

	public void setPosition(String position){
		this.position = position;
	}

	@Column(nullable = false)
	public String getCreateTime(){
		return createTime;
	}

	public void setCreateTime(String createTime){
		this.createTime = createTime;
	}

	public String getDes(){
		return des;
	}

	public void setDes(String des){
		this.des = des;
	}

}
