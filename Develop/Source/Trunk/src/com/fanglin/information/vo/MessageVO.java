/**
 * Title: Messagermation
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.information.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserVO;

public class MessageVO implements Serializable {

	private static final long serialVersionUID = -6328343602972691168L;

	private Integer messageId;
	
	private UserVO receiver;
	
	private UserVO sender;
	
	private String type;
	
	private String contents;
	
	private Timestamp createTime;
	
	private String status;
	
	private String args;
	
	public MessageVO(){
		super();
	}
	
	public MessageVO(String receiverId, String senderId, String type, String contents) {
		super();
		this.receiver = new UserVO(receiverId);
		this.sender = new UserVO(senderId);
		this.type = type;
		this.contents = contents;
	}

	public Integer getMessageId(){
		return messageId;
	}

	public void setMessageId(Integer MessageId){
		this.messageId = MessageId;
	}
	
	public UserVO getReceiver(){
		return receiver;
	}

	public void setReceiver(UserVO receiver){
		this.receiver = receiver;
	}

	public UserVO getSender(){
		return sender;
	}

	public void setSender(UserVO sender){
		this.sender = sender;
	}

	public String getType(){
		return type;
	}

	public void setType(String type){
		this.type = type;
	}

	public String getContents(){
		return contents;
	}

	public void setContents(String contents){
		this.contents = contents;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime(){
		return createTime;
	}

	public void setCreateTime(Timestamp createTime){
		this.createTime = createTime;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public String getArgs(){
		return args;
	}

	public void setArgs(String args){
		this.args = args;
	}

}
