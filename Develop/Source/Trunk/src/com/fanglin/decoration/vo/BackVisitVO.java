/**
 * @FileName	: CityVO.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

public class BackVisitVO implements Serializable {

	private static final long serialVersionUID = 191991919191L;

	private Long bvId;

	private String orderId;

	private String sender;
	
	private String senderId;
	
	private String senderPhoto;
	
	private Timestamp createTime;
	
	private String content;
	
	private List<String> receivers;

	public Long getBvId() {
		return bvId;
	}

	public void setBvId(Long bvId) {
		this.bvId = bvId;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getSenderId() {
		return senderId;
	}

	public void setSenderId(String senderId) {
		this.senderId = senderId;
	}
	
	public String getSenderPhoto() {
		return senderPhoto;
	}

	public void setSenderPhoto(String senderPhoto) {
		this.senderPhoto = senderPhoto;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public List<String> getReceivers() {
		return receivers;
	}

	public void setReceivers(List<String> receivers) {
		this.receivers = receivers;
	}
	
	
	
}
