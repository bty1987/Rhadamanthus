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

	private Long mid;

	private UserVO receiver;

	private UserVO sender;

	private Short type;

	private Short subtype;

	private Long ident;

	private String contents;

	private Timestamp createTime;

	private Short status;

	private String args;

	private Integer company;

	private Short dresult;

	public MessageVO() {
		super();
	}

	public MessageVO(String receiverId, String senderId, short type, String contents) {
		super();
		this.receiver = new UserVO(receiverId);
		this.sender = new UserVO(senderId);
		this.type = type;
		this.contents = contents;
	}

	public Long getMid() {
		return mid;
	}

	public void setMid(Long mid) {
		this.mid = mid;
	}

	public UserVO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserVO receiver) {
		this.receiver = receiver;
	}

	public UserVO getSender() {
		return sender;
	}

	public void setSender(UserVO sender) {
		this.sender = sender;
	}

	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public Short getSubtype() {
		return subtype;
	}

	public void setSubtype(Short subtype) {
		this.subtype = subtype;
	}

	public Long getIdent() {
		return ident;
	}

	public void setIdent(Long ident) {
		this.ident = ident;
	}

	public String getContents() {
		return contents;
	}

	public void setContents(String contents) {
		this.contents = contents;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getArgs() {
		return args;
	}

	public void setArgs(String args) {
		this.args = args;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public Short getDresult() {
		return dresult;
	}

	public void setDresult(Short dresult) {
		this.dresult = dresult;
	}

}
