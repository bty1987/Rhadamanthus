package com.fanglin.customer.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class RevisitVO implements Serializable {

	private static final long serialVersionUID = -2662543828398103654L;

	private Long rid;

	private DecorationVO decoration;

	private Short type;

	private Long ident;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short gladness;

	private String content;

	public RevisitVO() {
		super();
	}

	public RevisitVO(DecorationVO decoration, UserBaseVO creater) {
		super();
		this.decoration = decoration;
		this.creater = creater;
	}

	public Long getRid() {
		return rid;
	}

	public void setRid(Long rid) {
		this.rid = rid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getIdent() {
		return ident;
	}

	public void setIdent(Long ident) {
		this.ident = ident;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getGladness() {
		return gladness;
	}

	public void setGladness(Short gladness) {
		this.gladness = gladness;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
