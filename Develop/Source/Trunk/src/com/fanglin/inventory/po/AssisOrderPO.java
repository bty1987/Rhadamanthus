package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

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
@Table(name = "assisorder", catalog = "inventory")
public class AssisOrderPO implements Serializable{

	private static final long serialVersionUID = -6224676908446000452L;
	
	public static final String COLUMN_CREATER_UID_STR = "creater.uid";
	
	public static final String COLUMN_CREATER_NAME_STR = "creater.userName";
	
	public static final String COLUMN_APPROVER_NAME_STR = "approver.userName";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final String COLUMN_APPROVERTIME_STR = "approverTime";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	public static final short STATUS_REJECT_INT = 2;
	
	private long aoid;
	
	private String no;
	
	private String orderId;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private UserPO approver;
	
	private Timestamp approverTime;
	
	private short status;
	
	private int company;
	
	public AssisOrderPO() {
		super();
	}

	public AssisOrderPO(String no) {
		super();
		this.no = no;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY) //主键由数据库自动生成
	@Column(name = "aoid")
	public long getAoid() {
		return aoid;
	}

	public void setAoid(long aoid) {
		this.aoid = aoid;
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
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "createrId", referencedColumnName = "uId")
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
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "approverId", referencedColumnName = "uId")
	public UserPO getApprover() {
		return approver;
	}

	public void setApprover(UserPO approver) {
		this.approver = approver;
	}
	
	@Column(name = "approverTime")
	public Timestamp getApproverTime() {
		return approverTime;
	}

	public void setApproverTime(Timestamp approverTime) {
		this.approverTime = approverTime;
	}
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
