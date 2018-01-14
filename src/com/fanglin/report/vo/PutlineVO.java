/**
 * @File Name		: PutlineConstructionScheduleVO.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.vo;

import java.io.Serializable;

import com.fanglin.decoration.vo.DecorationVO;

public class PutlineVO implements Serializable {

	private static final long serialVersionUID = -2565279625266292947L;
	
	private Integer plcsId;
	
	private Long csId;
	
	private DecorationVO decoration;
	
	private String startTime;
	
	private Integer startTimeFlag;
	
	private String endTime;
	
	private Integer endTimeFlag;
	
	private Integer putlineStatus;
	
	private String putlineTime;

	public Integer getPlcsId() {
		return plcsId;
	}

	public void setPlcsId(Integer plcsId) {
		this.plcsId = plcsId;
	}

	public Long getCsId() {
		return csId;
	}

	public void setCsId(Long csId) {
		this.csId = csId;
	}

	public DecorationVO getDecorationOrder() {
		return decoration;
	}

	public void setDecorationOrder(DecorationVO decoration) {
		this.decoration = decoration;
	}
	
	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public Integer getStartTimeFlag() {
		return startTimeFlag;
	}

	public void setStartTimeFlag(Integer startTimeFlag) {
		this.startTimeFlag = startTimeFlag;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public Integer getEndTimeFlag() {
		return endTimeFlag;
	}

	public void setEndTimeFlag(Integer endTimeFlag) {
		this.endTimeFlag = endTimeFlag;
	}

	public Integer getPutlineStatus() {
		return putlineStatus;
	}

	public void setPutlineStatus(Integer putlineStatus) {
		this.putlineStatus = putlineStatus;
	}

	public String getPutlineTime() {
		return putlineTime;
	}

	public void setPutlineTime(String putlineTime) {
		this.putlineTime = putlineTime;
	}
	
}
