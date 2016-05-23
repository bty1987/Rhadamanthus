/**
 * @File Name		: OrderDesignPictureVO
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.google.gson.annotations.SerializedName;


public class OrderDesignPictureVO implements Serializable {

	private static final long serialVersionUID = -62258203481876631L;

	private Long autoId;
	
	@SerializedName("订单编号")
	private String orderId;
	
	@SerializedName("房屋面积")
	private Float houseArea;
	
	@SerializedName("客户")
	private String customer;
	
	@SerializedName("客户编号")
	private Integer customerId;
	
	@SerializedName("房屋类别")
	private String houseClass;
	
	@SerializedName("楼盘")
	private String village;
	
	@SerializedName("楼盘编号")
	private String villageId;

	@SerializedName("上传文件名")
	private String uploadFileName;
	
	@SerializedName("路径")
	private String picturePath;
	
	@SerializedName("上传时间")
	private Timestamp uploadTime;
	
	@SerializedName("备注")
	protected String pictureContent;
	
	@SerializedName("上传人编号")
	private String userId;
	@SerializedName("上传人")
	private String userName;
	@SerializedName("图片类型")
	private Integer pictureType;

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

	public String getUploadFileName(){
		return uploadFileName;
	}

	public void setUploadFileName(String uploadFileName){
		this.uploadFileName = uploadFileName;
	}

	public String getPicturePath(){
		return picturePath;
	}

	public void setPicturePath(String picturePath){
		this.picturePath = picturePath;
	}

	public Timestamp getUploadTime(){
		return uploadTime;
	}

	public void setUploadTime(Timestamp uploadTime){
		this.uploadTime = uploadTime;
	}

	public String getPictureContent(){
		return pictureContent;
	}

	public void setPictureContent(String pictureContent){
		this.pictureContent = pictureContent;
	}

	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

	public String getUserName(){
		return userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
	}

	public Float getHouseArea(){
		return houseArea;
	}

	public void setHouseArea(Float houseArea){
		this.houseArea = houseArea;
	}

	public String getCustomer(){
		return customer;
	}

	public void setCustomer(String customer){
		this.customer = customer;
	}

	public Integer getCustomerId(){
		return customerId;
	}

	public void setCustomerId(Integer customerId){
		this.customerId = customerId;
	}

	public String getHouseClass(){
		return houseClass;
	}

	public void setHouseClass(String houseClass){
		this.houseClass = houseClass;
	}

	public String getVillage(){
		return village;
	}

	public void setVillage(String village){
		this.village = village;
	}

	public String getVillageId(){
		return villageId;
	}

	public void setVillageId(String villageId){
		this.villageId = villageId;
	}

	public void setPictureType(Integer pictureType){
		this.pictureType = pictureType;
	}

	public Integer getPictureType(){
		return pictureType;
	}

}
