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
@Table(name = "decorationpicture", catalog = "platform")
public class DecorationPicturePO implements Serializable {

	private static final long serialVersionUID = 8022061676288156331L;

	private long dpId;
	
	private String orderId;
	
	private String name;
	
	private String path;
	
	private Timestamp uploadTime;
	
	private String content;
	
	private UserPO userPO;
	
	private int type;

	@Id
	@GeneratedValue
	@Column(name = "dpId")
	public long getDpId(){
		return dpId;
	}

	public void setDpId(long dpId){
		this.dpId = dpId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Timestamp getUploadTime(){
		return uploadTime;
	}

	public void setUploadTime(Timestamp uploadTime){
		this.uploadTime = uploadTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", referencedColumnName = "userId")
	public UserPO getUserPO(){
		return userPO;
	}

	public void setUserPO(UserPO userPO){
		this.userPO = userPO;
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

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

}
