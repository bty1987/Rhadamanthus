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

import org.apache.struts2.json.annotations.JSON;

public class UserExperienceVO implements Serializable {

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

	private String flag;

	@JSON(name="experienceId")
	public Long getId(){
		return id;
	}

	public void setId(Long id){
		this.id = id;
	}

	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	public String getCompany(){
		return company;
	}

	public void setCompany(String company){
		this.company = company;
	}

	public String getPosition(){
		return position;
	}

	public void setPosition(String position){
		this.position = position;
	}

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

	public String getFlag(){
		return flag;
	}

	public void setFlag(String flag){
		this.flag = flag;
	}

}
