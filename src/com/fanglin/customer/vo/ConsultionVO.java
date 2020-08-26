package com.fanglin.customer.vo;

import java.io.Serializable;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class ConsultionVO implements Serializable {
	
	private static final long serialVersionUID = -3281908738783279576L;
	
	private Long cid;
	
	private String no;
	
	private DecorationVO decoration;
	
	private UserBaseVO creater;
	
	private String comment;
	
	private Integer company;

	public ConsultionVO() {
		super();
	}

	public ConsultionVO(DecorationVO decoration, UserBaseVO creater) {
		super();
		this.decoration = decoration;
		this.creater = creater;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
