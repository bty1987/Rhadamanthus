/**
 * @File Name	: Acceptance.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="acceptance", catalog = "construction")
public class AcceptancePO implements Serializable{

	private static final long serialVersionUID = -4319485351492418003L;
	
	public static final int ACCEPTANCE_ALLOCATION_WORKER_FLAG_INT = 512;
	
	public static final String ACCEPTANCE_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR = "验收";
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	private int actId;
	
	private String orderId;
	
	private String acceptanceTime;
	
	private int waterwayQuality;
	
	private int waterwayServer;
	
	private int waterwayHygiene;
	
	private String waterwayDes;
	
	private int circuitQuality;
	
	private int circuitServer;
	
	private int circuitHygiene;
	
	private String circuitDes;
	
	private int bricklayQuality;
	
	private int bricklayServer;
	
	private int bricklayHygiene;
	
	private String bricklayDes;
	
	private int carpentQuality;
	
	private int carpentServer;
	
	private int carpentHygiene;
	
	private String carpentDes;
	
	private int oilQuality;
	
	private int oilServer;
	
	private int oilHygiene;
	
	private String oilDes;
	
	private int supervisQuality;
	
	private int supervisServer;
	
	private int supervisHygiene;
	
	private String supervisDes;
	
	private int materialQuality;
	
	private int materialServer;
	
	private String materialDes;
	
	private String question;
	
	private String propose;
	
	private int multiple;
	
	private int internal;

	@Id
	@Column(name="actId")
	public int getActId(){
		return actId;
	}

	public void setActId(int actId){
		this.actId = actId;
	}

	@Column(name="orderId")
	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@Column(name="acceptanceTime")
	public String getAcceptanceTime(){
		return acceptanceTime;
	}

	public void setAcceptanceTime(String acceptanceTime){
		this.acceptanceTime = acceptanceTime;
	}

	@Column(name="waterwayQuality")
	public int getWaterwayQuality(){
		return waterwayQuality;
	}

	public void setWaterwayQuality(int waterwayQuality){
		this.waterwayQuality = waterwayQuality;
	}

	@Column(name="waterwayServer")
	public int getWaterwayServer(){
		return waterwayServer;
	}

	public void setWaterwayServer(int waterwayServer){
		this.waterwayServer = waterwayServer;
	}

	@Column(name="waterwayHygiene")
	public int getWaterwayHygiene(){
		return waterwayHygiene;
	}

	public void setWaterwayHygiene(int waterwayHygiene){
		this.waterwayHygiene = waterwayHygiene;
	}

	@Column(name="circuitQuality")
	public int getCircuitQuality(){
		return circuitQuality;
	}

	public void setCircuitQuality(int circuitQuality){
		this.circuitQuality = circuitQuality;
	}

	@Column(name="circuitServer")
	public int getCircuitServer(){
		return circuitServer;
	}

	public void setCircuitServer(int circuitServer){
		this.circuitServer = circuitServer;
	}

	@Column(name="circuitHygiene")
	public int getCircuitHygiene(){
		return circuitHygiene;
	}

	public void setCircuitHygiene(int circuitHygiene){
		this.circuitHygiene = circuitHygiene;
	}

	@Column(name="bricklayQuality")
	public int getBricklayQuality(){
		return bricklayQuality;
	}

	public void setBricklayQuality(int bricklayQuality){
		this.bricklayQuality = bricklayQuality;
	}

	@Column(name="bricklayServer")
	public int getBricklayServer(){
		return bricklayServer;
	}

	public void setBricklayServer(int bricklayServer){
		this.bricklayServer = bricklayServer;
	}

	@Column(name="bricklayHygiene")
	public int getBricklayHygiene(){
		return bricklayHygiene;
	}

	public void setBricklayHygiene(int bricklayHygiene){
		this.bricklayHygiene = bricklayHygiene;
	}

	@Column(name="carpentQuality")
	public int getCarpentQuality(){
		return carpentQuality;
	}

	public void setCarpentQuality(int carpentQuality){
		this.carpentQuality = carpentQuality;
	}

	@Column(name="carpentServer")
	public int getCarpentServer(){
		return carpentServer;
	}

	public void setCarpentServer(int carpentServer){
		this.carpentServer = carpentServer;
	}

	@Column(name="carpentHygiene")
	public int getCarpentHygiene(){
		return carpentHygiene;
	}

	public void setCarpentHygiene(int carpentHygiene){
		this.carpentHygiene = carpentHygiene;
	}

	@Column(name="oilQuality")
	public int getOilQuality(){
		return oilQuality;
	}

	public void setOilQuality(int oilQuality){
		this.oilQuality = oilQuality;
	}

	@Column(name="oilServer")
	public int getOilServer(){
		return oilServer;
	}

	public void setOilServer(int oilServer){
		this.oilServer = oilServer;
	}

	@Column(name="oilHygiene")
	public int getOilHygiene(){
		return oilHygiene;
	}

	public void setOilHygiene(int oilHygiene){
		this.oilHygiene = oilHygiene;
	}

	@Column(name="supervisQuality")
	public int getSupervisQuality(){
		return supervisQuality;
	}

	public void setSupervisQuality(int supervisQuality){
		this.supervisQuality = supervisQuality;
	}

	@Column(name="supervisServer")
	public int getSupervisServer(){
		return supervisServer;
	}

	public void setSupervisServer(int supervisServer){
		this.supervisServer = supervisServer;
	}

	@Column(name="supervisHygiene")
	public int getSupervisHygiene(){
		return supervisHygiene;
	}

	public void setSupervisHygiene(int supervisHygiene){
		this.supervisHygiene = supervisHygiene;
	}

	@Column(name="materialQuality")
	public int getMaterialQuality(){
		return materialQuality;
	}

	public void setMaterialQuality(int materialQuality){
		this.materialQuality = materialQuality;
	}

	@Column(name="materialServer")
	public int getMaterialServer(){
		return materialServer;
	}

	public void setMaterialServer(int materialServer){
		this.materialServer = materialServer;
	}

	@Column(name="question")
	public String getQuestion(){
		return question;
	}

	public void setQuestion(String question){
		this.question = question;
	}

	@Column(name="propose")
	public String getPropose(){
		return propose;
	}

	public void setPropose(String propose){
		this.propose = propose;
	}

	@Column(name="multiple")
	public int getMultiple(){
		return multiple;
	}

	public void setMultiple(int multiple){
		this.multiple = multiple;
	}

	@Column(name="internal")
	public int getInternal(){
		return internal;
	}

	public void setInternal(int internal){
		this.internal = internal;
	}

	@Column(name="waterwayDes")
	public String getWaterwayDes(){
		return waterwayDes;
	}

	public void setWaterwayDes(String waterwayDes){
		this.waterwayDes = waterwayDes;
	}

	@Column(name="circuitDes")
	public String getCircuitDes(){
		return circuitDes;
	}

	public void setCircuitDes(String circuitDes){
		this.circuitDes = circuitDes;
	}

	@Column(name="bricklayDes")
	public String getBricklayDes(){
		return bricklayDes;
	}

	public void setBricklayDes(String bricklayDes){
		this.bricklayDes = bricklayDes;
	}

	@Column(name="carpentDes")
	public String getCarpentDes(){
		return carpentDes;
	}

	public void setCarpentDes(String carpentDes){
		this.carpentDes = carpentDes;
	}

	@Column(name="oilDes")
	public String getOilDes(){
		return oilDes;
	}

	public void setOilDes(String oilDes){
		this.oilDes = oilDes;
	}

	@Column(name="supervisDes")
	public String getSupervisDes(){
		return supervisDes;
	}

	public void setSupervisDes(String supervisDes){
		this.supervisDes = supervisDes;
	}

	@Column(name="materialDes")
	public String getMaterialDes(){
		return materialDes;
	}
	public void setMaterialDes(String materialDes){
		this.materialDes = materialDes;
	}
	
}
