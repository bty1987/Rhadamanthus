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

package com.fanglin.construction.vo;

import java.io.Serializable;

public class PutlineConstructionScheduleVO implements Serializable {

	private static final long serialVersionUID = -2565279625266292947L;
	
	private Integer plcsId;
	
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
	
	private Integer supervisorRaty;
	
	private String supervisorRatyDes;
	
	private Integer qualityRaty;
	
	private String qualityRatyDes;
	
	private Integer putlineStatus;
	
	private String putlineTime;

	public Integer getPlcsId(){
		return plcsId;
	}

	public void setPlcsId(Integer plcsId){
		this.plcsId = plcsId;
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

	public Integer getSupervisorRaty(){
		return supervisorRaty;
	}

	public void setSupervisorRaty(Integer supervisorRaty){
		this.supervisorRaty = supervisorRaty;
	}

	public String getSupervisorRatyDes(){
		return supervisorRatyDes;
	}

	public void setSupervisorRatyDes(String supervisorRatyDes){
		this.supervisorRatyDes = supervisorRatyDes;
	}

	public Integer getQualityRaty(){
		return qualityRaty;
	}

	public void setQualityRaty(Integer qualityRaty){
		this.qualityRaty = qualityRaty;
	}

	public String getQualityRatyDes(){
		return qualityRatyDes;
	}

	public void setQualityRatyDes(String qualityRatyDes){
		this.qualityRatyDes = qualityRatyDes;
	}

	public Integer getPutlineStatus(){
		return putlineStatus;
	}

	public void setPutlineStatus(Integer putlineStatus){
		this.putlineStatus = putlineStatus;
	}

	public String getPutlineTime(){
		return putlineTime;
	}

	public void setPutlineTime(String putlineTime){
		this.putlineTime = putlineTime;
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
