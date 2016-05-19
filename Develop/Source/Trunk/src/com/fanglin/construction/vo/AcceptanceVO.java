/**
 * @File Name		: AcceptanceVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;

public class AcceptanceVO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -665024502622400928L;

	private Integer actId;
	
	private String orderId;
	
	private String customer;
	
	private String orderAddr;
	
	private String designer;
	
	private String contractCode;
	
	private String acceptanceTime;
	
	private String waterwayQualityName;
	
	private String waterwayWorkerName;
	
	private Integer waterwayQuality;
	
	private Integer waterwayServer;
	
	private Integer waterwayHygiene;
	
	private String waterwayDes;
	
	private String circuitQualityName;
	
	private String circuitWorkerName;
	
	private Integer circuitQuality;
	
	private Integer circuitServer;
	
	private Integer circuitHygiene;
	
	private String circuitDes;
	
	private String bricklayQualityName;
	
	private String bricklayWorkerName;
	
	private Integer bricklayQuality;
	
	private Integer bricklayServer;
	
	private Integer bricklayHygiene;
	
	private String bricklayDes;
	
	private String carpentQualityName;
	
	private String carpentWorkerName;
	
	private Integer carpentQuality;
	
	private Integer carpentServer;
	
	private Integer carpentHygiene;
	
	private String carpentDes;
	
	private String oilQualityName;
	
	private String oilWorkerName;
	
	private Integer oilQuality;
	
	private Integer oilServer;
	
	private Integer oilHygiene;
	
	private String oilDes;
	
	private String supervisId;
	
	private String supervisName;
	
	private Integer supervisQuality;
	
	private Integer supervisServer;
	
	private Integer supervisHygiene;
	
	private String supervisDes;
	
	private Integer materialQuality;
	
	private Integer materialServer;
	
	private String materialDes;
	
	private String question;
	
	private String propose;
	
	private Integer multiple;
	
	private Integer Integerernal;

	public Integer getActId(){
		return actId;
	}

	public void setActId(Integer actId){
		this.actId = actId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getAcceptanceTime(){
		return acceptanceTime;
	}

	public void setAcceptanceTime(String acceptanceTime){
		this.acceptanceTime = acceptanceTime;
	}

	public Integer getWaterwayQuality(){
		return waterwayQuality;
	}

	public void setWaterwayQuality(Integer waterwayQuality){
		this.waterwayQuality = waterwayQuality;
	}

	public Integer getWaterwayServer(){
		return waterwayServer;
	}

	public void setWaterwayServer(Integer waterwayServer){
		this.waterwayServer = waterwayServer;
	}

	public Integer getWaterwayHygiene(){
		return waterwayHygiene;
	}

	public void setWaterwayHygiene(Integer waterwayHygiene){
		this.waterwayHygiene = waterwayHygiene;
	}

	public String getWaterwayDes(){
		return waterwayDes;
	}

	public void setWaterwayDes(String waterwayDes){
		this.waterwayDes = waterwayDes;
	}

	public Integer getCircuitQuality(){
		return circuitQuality;
	}

	public void setCircuitQuality(Integer circuitQuality){
		this.circuitQuality = circuitQuality;
	}

	public Integer getCircuitServer(){
		return circuitServer;
	}

	public void setCircuitServer(Integer circuitServer){
		this.circuitServer = circuitServer;
	}

	public Integer getCircuitHygiene(){
		return circuitHygiene;
	}

	public void setCircuitHygiene(Integer circuitHygiene){
		this.circuitHygiene = circuitHygiene;
	}

	public String getCircuitDes(){
		return circuitDes;
	}

	public void setCircuitDes(String circuitDes){
		this.circuitDes = circuitDes;
	}

	public Integer getBricklayQuality(){
		return bricklayQuality;
	}

	public void setBricklayQuality(Integer bricklayQuality){
		this.bricklayQuality = bricklayQuality;
	}

	public Integer getBricklayServer(){
		return bricklayServer;
	}

	public void setBricklayServer(Integer bricklayServer){
		this.bricklayServer = bricklayServer;
	}

	public Integer getBricklayHygiene(){
		return bricklayHygiene;
	}

	public void setBricklayHygiene(Integer bricklayHygiene){
		this.bricklayHygiene = bricklayHygiene;
	}

	public String getBricklayDes(){
		return bricklayDes;
	}

	public void setBricklayDes(String bricklayDes){
		this.bricklayDes = bricklayDes;
	}

	public Integer getCarpentQuality(){
		return carpentQuality;
	}

	public void setCarpentQuality(Integer carpentQuality){
		this.carpentQuality = carpentQuality;
	}

	public Integer getCarpentServer(){
		return carpentServer;
	}

	public void setCarpentServer(Integer carpentServer){
		this.carpentServer = carpentServer;
	}

	public Integer getCarpentHygiene(){
		return carpentHygiene;
	}

	public void setCarpentHygiene(Integer carpentHygiene){
		this.carpentHygiene = carpentHygiene;
	}

	public String getCarpentDes(){
		return carpentDes;
	}

	public void setCarpentDes(String carpentDes){
		this.carpentDes = carpentDes;
	}

	public Integer getOilQuality(){
		return oilQuality;
	}

	public void setOilQuality(Integer oilQuality){
		this.oilQuality = oilQuality;
	}

	public Integer getOilServer(){
		return oilServer;
	}

	public void setOilServer(Integer oilServer){
		this.oilServer = oilServer;
	}

	public Integer getOilHygiene(){
		return oilHygiene;
	}

	public void setOilHygiene(Integer oilHygiene){
		this.oilHygiene = oilHygiene;
	}

	public String getOilDes(){
		return oilDes;
	}

	public void setOilDes(String oilDes){
		this.oilDes = oilDes;
	}

	public Integer getSupervisQuality(){
		return supervisQuality;
	}

	public void setSupervisQuality(Integer supervisQuality){
		this.supervisQuality = supervisQuality;
	}

	public Integer getSupervisServer(){
		return supervisServer;
	}

	public void setSupervisServer(Integer supervisServer){
		this.supervisServer = supervisServer;
	}

	public Integer getSupervisHygiene(){
		return supervisHygiene;
	}

	public void setSupervisHygiene(Integer supervisHygiene){
		this.supervisHygiene = supervisHygiene;
	}

	public String getSupervisDes(){
		return supervisDes;
	}

	public void setSupervisDes(String supervisDes){
		this.supervisDes = supervisDes;
	}

	public Integer getMaterialQuality(){
		return materialQuality;
	}

	public void setMaterialQuality(Integer materialQuality){
		this.materialQuality = materialQuality;
	}

	public Integer getMaterialServer(){
		return materialServer;
	}

	public void setMaterialServer(Integer materialServer){
		this.materialServer = materialServer;
	}

	public String getMaterialDes(){
		return materialDes;
	}

	public void setMaterialDes(String materialDes){
		this.materialDes = materialDes;
	}

	public String getQuestion(){
		return question;
	}

	public void setQuestion(String question){
		this.question = question;
	}

	public String getPropose(){
		return propose;
	}

	public void setPropose(String propose){
		this.propose = propose;
	}

	public Integer getMultiple(){
		return multiple;
	}

	public void setMultiple(Integer multiple){
		this.multiple = multiple;
	}

	public Integer getIntegerernal(){
		return Integerernal;
	}

	public void setIntegerernal(Integer Integerernal){
		this.Integerernal = Integerernal;
	}

	public String getCustomer(){
		return customer;
	}

	public void setCustomer(String customer){
		this.customer = customer;
	}

	public String getDesigner(){
		return designer;
	}

	public void setDesigner(String designer){
		this.designer = designer;
	}

	public String getContractCode(){
		return contractCode;
	}

	public void setContractCode(String contractCode){
		this.contractCode = contractCode;
	}

	public String getWaterwayQualityName(){
		return waterwayQualityName;
	}

	public void setWaterwayQualityName(String waterwayQualityName){
		this.waterwayQualityName = waterwayQualityName;
	}

	public String getWaterwayWorkerName(){
		return waterwayWorkerName;
	}

	public void setWaterwayWorkerName(String waterwayWorkerName){
		this.waterwayWorkerName = waterwayWorkerName;
	}

	public String getCircuitQualityName(){
		return circuitQualityName;
	}

	public void setCircuitQualityName(String circuitQualityName){
		this.circuitQualityName = circuitQualityName;
	}

	public String getCircuitWorkerName(){
		return circuitWorkerName;
	}

	public void setCircuitWorkerName(String circuitWorkerName){
		this.circuitWorkerName = circuitWorkerName;
	}

	public String getBricklayQualityName(){
		return bricklayQualityName;
	}

	public void setBricklayQualityName(String bricklayQualityName){
		this.bricklayQualityName = bricklayQualityName;
	}

	public String getBricklayWorkerName(){
		return bricklayWorkerName;
	}

	public void setBricklayWorkerName(String bricklayWorkerName){
		this.bricklayWorkerName = bricklayWorkerName;
	}

	public String getCarpentQualityName(){
		return carpentQualityName;
	}

	public void setCarpentQualityName(String carpentQualityName){
		this.carpentQualityName = carpentQualityName;
	}

	public String getCarpentWorkerName(){
		return carpentWorkerName;
	}

	public void setCarpentWorkerName(String carpentWorkerName){
		this.carpentWorkerName = carpentWorkerName;
	}

	public String getOilQualityName(){
		return oilQualityName;
	}

	public void setOilQualityName(String oilQualityName){
		this.oilQualityName = oilQualityName;
	}

	public String getOilWorkerName(){
		return oilWorkerName;
	}

	public void setOilWorkerName(String oilWorkerName){
		this.oilWorkerName = oilWorkerName;
	}

	public String getSupervisId(){
		return supervisId;
	}

	public void setSupervisId(String supervisId){
		this.supervisId = supervisId;
	}

	public String getSupervisName(){
		return supervisName;
	}

	public void setSupervisName(String supervisName){
		this.supervisName = supervisName;
	}

	public String getOrderAddr(){
		return orderAddr;
	}

	public void setOrderAddr(String orderAddr){
		this.orderAddr = orderAddr;
	}
	
}
