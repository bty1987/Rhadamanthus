package com.fanglin.customer.po;

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
@Table(name="decorationcircle",catalog="customer")
public class DecorationCirclePO implements Serializable{

	private static final long serialVersionUID = 8355382147537561375L;
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final Integer PRAISE_INIT_INTEGER = 0;
	
	private long dcid;
	
	private String orderId;
	
	private String address;
	
	private UserPO creater;
	
	private String content;
	
	private Timestamp createTime;
	
	private int praise;

	public DecorationCirclePO() {
		super();
	}

	public DecorationCirclePO(UserPO creater) {
		super();
		this.creater = creater;
	}

	@Id
	@GeneratedValue
	@Column(name="dcid")
	public long getDcid() {
		return dcid;
	}

	public void setDcid(long dcid) {
		this.dcid = dcid;
	}

	@Column(name="orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name="address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="cuid",referencedColumnName="uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@Column(name="content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
	@Column(name="praise")
	public int getPraise() {
		return praise;
	}

	public void setPraise(int praise) {
		this.praise = praise;
	}
	
}
