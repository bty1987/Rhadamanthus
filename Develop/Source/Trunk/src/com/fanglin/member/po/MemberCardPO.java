package com.fanglin.member.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name = "membercard", catalog = "platform")
public class MemberCardPO  implements java.io.Serializable {

	private static final long serialVersionUID = -1649050342892502087L;
	
	public static final int COLUMN_CREDITS_INT = 0;      //初始积分
	
	public static final String COLUMN_ORDERID_STR = "orderId"; 
	
	public static final String COLUMN_CREATETIME_STR = "createTime"; 

	private long mcId;
	
	private String no;
	
	private String orderId;
	
	private int credits;
	
	private Timestamp createTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "mcid")
	public long getMcId() {
		return mcId;
	}

	public void setMcId(long mcId) {
		this.mcId = mcId;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "credits")
	public int getCredits() {
		return credits;
	}

	public void setCredits(int credits) {
		this.credits = credits;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
}
