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

import com.fanglin.communion.po.HousePO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "accessories", catalog = "inventory")
public class AccessoriesPO implements Serializable{

	private static final long serialVersionUID = -6891774270799222927L;

	public static final String COLUMN_CREATER_UID_STR = "creater.uid";
	
	public static final String COLUMN_CREATER_NAME_STR = "creater.userName";
	
	public static final String COLUMN_CREATER_USERID_STR = "creater.userId";
	
	public static final String COLUMN_APPROVER_NAME_STR = "approver.userName";
	
	public static final String COLUMN_APPROVER_USERID_STR = "approver.userId";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final String COLUMN_APPROVERTIME_STR = "approverTime";
	
	public static final String COLUMN_ORDERID_STR = "orderId";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short STATUS_DISABLE_INT = 1;
	
	public static final short STATUS_REJECT_INT = 2;
	
	public static final short STATUS_UNDO_INT = 3;
	
	private long aid;	
	
	private String no;
	
	private String orderId;
	
	private HousePO house;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private UserPO approver;
	
	private Timestamp approverTime;
	
	private UserPO supervisor;
	
	private Timestamp fetchTime;
	
	private short status;
	
	private int company;
	
	public AccessoriesPO() {
		super();
	}
	
	public AccessoriesPO(String no) {
		super();
		this.no = no;
	}

	public AccessoriesPO(HousePO house, UserPO creater, UserPO approver,
			UserPO supervisor) {
		super();
		this.house = house;
		this.creater = creater;
		this.approver = approver;
		this.supervisor = supervisor;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY) //主键由数据库自动生成
	@Column(name = "aid")
	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
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
	@JoinColumn(name = "hid", referencedColumnName = "hid")
	public HousePO getHouse() {
		return house;
	}

	public void setHouse(HousePO house) {
		this.house = house;
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

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "supervisorId", referencedColumnName = "uId")
	public UserPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor) {
		this.supervisor = supervisor;
	}
	
	@Column(name = "fetchTime")
	public Timestamp getFetchTime() {
		return fetchTime;
	}

	public void setFetchTime(Timestamp fetchTime) {
		this.fetchTime = fetchTime;
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
