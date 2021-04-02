/**
 * @File Name		: MonitorVO.java
 * @Package   	: com.fanglin.monitor.vo
 * @Version		: 1.0
 * @Date			: 2017-9-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.factory.vo;

import java.io.Serializable;
import java.sql.Timestamp;

public class MonitorVO implements Serializable{
	
	private static final long serialVersionUID = 3133712833307341500L;

	private Integer mid;
	
	private String name;
	
	private String host;
	
	private String type;
	
	private String value;
	
	private String comment;
	
	private Short status;
	
	private Integer count;
	
	private Timestamp updateTime;

	public Integer getMid() {
		return mid;
	}

	public void setMid(Integer mid) {
		this.mid = mid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

}
