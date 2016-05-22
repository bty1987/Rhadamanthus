/**
 * @FileName	: CityVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.google.gson.annotations.SerializedName;

public class BackVisitVO implements Serializable {

	private static final long serialVersionUID = 191991919191L;

	private Long autoId;

	@SerializedName("订单编号")
	private String orderId;

	@SerializedName("创建人")
	private String designer;
	
	@SerializedName("创建人编号")
	private String designerId;
	
	@SerializedName("创建时间")
	private Timestamp createTime;
	
	@SerializedName("等级")
	private Integer grade;
	
	@SerializedName("备注")
	private String backVisitContent;
	
	public Long getAutoId(){
		return autoId;
	}

	public void setAutoId(Long autoId){
		this.autoId = autoId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	public String getDesigner(){
		return designer;
	}

	public void setDesigner(String designer){
		this.designer = designer;
	}

	public String getDesignerId(){
		return designerId;
	}

	public void setDesignerId(String designerId){
		this.designerId = designerId;
	}

	@JSON(format="yyyy-MM-dd")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public Integer getGrade(){
		return grade;
	}

	public void setGrade(Integer grade){
		this.grade = grade;
	}

	public String getBackVisitContent(){
		return backVisitContent;
	}

	public void setBackVisitContent(String backVisitContent){
		this.backVisitContent = backVisitContent;
	}
}
