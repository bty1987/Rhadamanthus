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

import org.apache.struts2.json.annotations.JSON;

public class DecorationPictureVO implements Serializable {

	private static final long serialVersionUID = 8552727503707783015L;

	private Long dpId;
	
	private String orderId;
	
	private String name;
	
	private String path;
	
	private Timestamp uploadTime;
	
	protected String content;
	
	private String userId;
	
	private String userName;
	
	private Integer type;

	public Long getDpId(){
		return dpId;
	}

	public void setDpId(Long dpId){
		this.dpId = dpId;
	}

	public String getOrderId(){
		return orderId;
	}

	public void setOrderId(String orderId){
		this.orderId = orderId;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getUploadTime(){
		return uploadTime;
	}

	public void setUploadTime(Timestamp uploadTime){
		this.uploadTime = uploadTime;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

}
