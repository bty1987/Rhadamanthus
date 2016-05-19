/**
 * @File Name		: QuotationVersionPO.java
 * @Package   	: com.fanglin.entity
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "orderDesignPicture", catalog = "platform")
public class OrderDesignPicturePO implements Serializable {

	private static final long serialVersionUID = 1344461146L;

	private long autoId;
	
	private DecorationOrderPO orderPO;
	
	private String uploadFileName;
	
	private String picturePath;
	
	private Timestamp uploadTime;
	
	private String pictureContent;
	
	private UserPO userPO;
	
	private int pictureType;

	@Id
	@GeneratedValue
	@Column(name = "autoId")
	public long getAutoId(){
		return autoId;
	}

	public void setAutoId(long autoId){
		this.autoId = autoId;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = false, name = "orderId", referencedColumnName = "orderId")
	public DecorationOrderPO getOrderPO(){
		return orderPO;
	}

	public void setOrderPO(DecorationOrderPO orderPO){
		this.orderPO = orderPO;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "userId", referencedColumnName = "userId")
	public UserPO getUserPO(){
		return userPO;
	}

	public void setUserPO(UserPO userPO){
		this.userPO = userPO;
	}

	public void setPictureType(int pictureType){
		this.pictureType = pictureType;
	}

	public int getPictureType(){
		return pictureType;
	}

}
