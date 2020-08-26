package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class ComplackVO implements Serializable {

	private static final long serialVersionUID = 7216296775550452522L;

	private Long ckid;
	
	private Long cid;
	
	private Long ctid;
	
	private Timestamp createTime;
	
	private Timestamp operateTime;
	
	private UserBaseVO operater;
	
	private String comment;
	
	public ComplackVO() {
		super();
	}

	public ComplackVO(UserBaseVO operater) {
		super();
		this.operater = operater;
	}

	public Long getCkid() {
		return ckid;
	}

	public void setCkid(Long ckid) {
		this.ckid = ckid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getCtid() {
		return ctid;
	}

	public void setCtid(Long ctid) {
		this.ctid = ctid;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public UserBaseVO getOperater() {
		return operater;
	}

	public void setOperater(UserBaseVO operater) {
		this.operater = operater;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
