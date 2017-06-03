/**
 * @File Name		: ConstructionScheduleWorker.java
 * @Package   	: com.fanglin.vo.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-11-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

public class ConstructionScheduleWorkerVO implements Serializable {

	private static final long serialVersionUID = -8674733219777475089L;
	
	private Long csId;
	
	private String orderId;
	
	private Integer pcsId;
	
	private Integer pcswId;
	
	private Integer cswId;
	
	private String workerId;
	
	private String workerName;
	
	private Float workerSalary;
	
	private Integer workerRaty;
	
	private String workerRatyDes;
	
	private String workerDuty;
	
	private String workerPhone;

	public Long getCsId(){
		return csId;
	}

	public void setCsId(Long csId){
		this.csId = csId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public Integer getPcsId(){
		return pcsId;
	}

	public void setPcsId(Integer pcsId){
		this.pcsId = pcsId;
	}

	public String getWorkerId(){
		return workerId;
	}

	public void setWorkerId(String workerId){
		this.workerId = workerId;
	}

	public String getWorkerName(){
		return workerName;
	}

	public void setWorkerName(String workerName){
		this.workerName = workerName;
	}

	public Float getWorkerSalary(){
		return workerSalary;
	}

	public void setWorkerSalary(Float workerSalary){
		this.workerSalary = workerSalary;
	}

	public Integer getPcswId(){
		return pcswId;
	}

	public void setPcswId(Integer pcswId){
		this.pcswId = pcswId;
	}

	public Integer getCswId(){
		return cswId;
	}

	public void setCswId(Integer cswId){
		this.cswId = cswId;
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

	public String getWorkerDuty() {
		return workerDuty;
	}

	public void setWorkerDuty(String workerDuty) {
		this.workerDuty = workerDuty;
	}

	public String getWorkerPhone() {
		return workerPhone;
	}

	public void setWorkerPhone(String workerPhone) {
		this.workerPhone = workerPhone;
	}
	
}
