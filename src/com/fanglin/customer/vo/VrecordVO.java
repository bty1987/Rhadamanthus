package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class VrecordVO implements Serializable {

	private static final long serialVersionUID = -7517270342066899566L;

	private Long vrid;

	private Long vid;

	private UserBaseVO creater;

	private Timestamp createTime;

	private String comment;

	public VrecordVO() {
		super();
	}

	public VrecordVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getVrid() {
		return vrid;
	}

	public void setVrid(Long vrid) {
		this.vrid = vrid;
	}

	public Long getVid() {
		return vid;
	}

	public void setVid(Long vid) {
		this.vid = vid;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
