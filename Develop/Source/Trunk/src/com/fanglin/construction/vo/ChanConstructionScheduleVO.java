/**
 * @File Name		: ChanConstructionScheduleVO.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

public class ChanConstructionScheduleVO implements Serializable {

	private static final long serialVersionUID = 6672950309795950712L;
	
	private Integer ccsId;
	
	private Integer csId;
	
	private String orderId;
	
	private String workerId;
	
	private String workerName;
	
	private Float workerSalary;
	
	private String workerOldId;
	
	private String workerDuty;
	
	private String workerPhone;
	
	private String workerPhoto;
	
	private String startTime;
	
	private Integer startTimeFlag;
	
	private String endTime;
	
	private Integer endTimeFlag;
	
	private Integer workerRaty;
	
	private String workerRatyDes;
	
	private Integer status;
	
	public Integer getCcsId(){
		return ccsId;
	}

	public void setCcsId(Integer ccsId){
		this.ccsId = ccsId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getWorkerId(){
		return workerId;
	}

	public void setWorkerId(String workerId){
		this.workerId = workerId;
	}

	public Float getWorkerSalary(){
		return workerSalary;
	}

	public void setWorkerSalary(Float workerSalary){
		this.workerSalary = workerSalary;
	}

	public String getStartTime(){
		return startTime;
	}

	public void setStartTime(String startTime){
		this.startTime = startTime;
	}

	public Integer getStartTimeFlag(){
		return startTimeFlag;
	}

	public void setStartTimeFlag(Integer startTimeFlag){
		this.startTimeFlag = startTimeFlag;
	}

	public String getEndTime(){
		return endTime;
	}

	public void setEndTime(String endTime){
		this.endTime = endTime;
	}

	public Integer getEndTimeFlag(){
		return endTimeFlag;
	}

	public void setEndTimeFlag(Integer endTimeFlag){
		this.endTimeFlag = endTimeFlag;
	}

	public Integer getWorkerRaty(){
		return workerRaty;
	}

	public void setWorkerRaty(Integer workerRaty){
		this.workerRaty = workerRaty;
	}

	public String getWorkerRatyDes(){
		return workerRatyDes;
	}

	public void setWorkerRatyDes(String workerRatyDes){
		this.workerRatyDes = workerRatyDes;
	}

	public Integer getStatus(){
		return status;
	}

	public void setStatus(Integer status){
		this.status = status;
	}

	public Integer getCsId(){
		return csId;
	}

	public void setCsId(Integer csId){
		this.csId = csId;
	}

	public String getWorkerOldId() {
		return workerOldId;
	}

	public void setWorkerOldId(String workerOldId) {
		this.workerOldId = workerOldId;
	}

	public String getWorkerDuty() {
		return workerDuty;
	}

	public void setWorkerDuty(String workerDuty) {
		this.workerDuty = workerDuty;
	}

	public String getWorkerName() {
		return workerName;
	}

	public void setWorkerName(String workerName) {
		this.workerName = workerName;
	}

	public String getWorkerPhone() {
		return workerPhone;
	}

	public void setWorkerPhone(String workerPhone) {
		this.workerPhone = workerPhone;
	}

	public String getWorkerPhoto() {
		return workerPhoto;
	}

	public void setWorkerPhoto(String workerPhoto) {
		this.workerPhoto = workerPhoto;
	}
	
}
