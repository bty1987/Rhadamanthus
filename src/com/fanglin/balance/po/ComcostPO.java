package com.fanglin.balance.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "comcost", catalog = "balance")
public class ComcostPO implements java.io.Serializable {


	private static final long serialVersionUID = 8987366758237861706L;
	
	public static final short STATUS_VALID_SHORT = 0;
	
	private long cid;

	private short type;

	private String orderId;

	private long ident;

	private long money;

	private UserPO creater;

	private Timestamp createTime;

	private short status;

	private String comment;
    
	private Integer company;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}
   
	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}
    
	
	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "ident")
	public long getIdent() {
		return ident;
	}

	public void setIdent(long ident) {
		this.ident = ident;
	}

	@Column(name = "money")
	public long getMoney() {
		return money;
	}

	public void setMoney(long money) {
		this.money = money;
	}
    
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = false, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
    
	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
    
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
    
	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	
	
	@Column(name = "company")
	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public ComcostPO() {
		super();
	}

	public ComcostPO(UserPO creater) {
		super();
		this.creater = creater;
	}

	
	
	
}
