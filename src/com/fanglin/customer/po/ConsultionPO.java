package com.fanglin.customer.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name="consultion",catalog="customer")
public class ConsultionPO implements Serializable{
	
	private static final long serialVersionUID = -7442063179740263209L;
	
	public static final String COLUMN_DECORATION_ORDERID_STR = "decoration.orderId";
	
	public static final String COLUMN_CREATER_UID_STR = "creater.uid";

	private long cid;
	
	private String no;
	
	private DecorationPO decoration;
	
	private UserPO creater;
	
	private String comment;
	
	private int company;

	public ConsultionPO() {
		super();
	}

	public ConsultionPO(DecorationPO decoration, UserPO creater) {
		super();
		this.decoration = decoration;
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name="cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@Column(name="no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name="company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}
	
}
