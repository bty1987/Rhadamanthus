package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "occessories", catalog = "inventory")
public class OccessoriesPO implements Serializable {

	private static final long serialVersionUID = 7990398717523266950L;
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	public static final String COLUMN_CREATER_USERID_STR = "creater.userId";
	
	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_NO_STR = "no";
	
	public static final short STATUS_INIT_INT = 0;
	
	public static final short STATUS_INIT_END = 2;

	private long oid;
	
	private String no;
	
	private String orderId;
	
	private UserPO creater;
	
	private UserPO supervisor;
	
	private Timestamp createTime;
	
	private short status;
	
	private int company;
	
	private UserPO supplier;
	
	private UserPO confirmer;// 确认人

	private UserPO balancer;// 结算人

	public OccessoriesPO(){
		super();
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "oid")
	public long getOid() {
		return oid;
	}

	public void setOid(long oid) {
		this.oid = oid;
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
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "svuid", referencedColumnName = "uid")
	public UserPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor) {
		this.supervisor = supervisor;
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
	
	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "spuid", referencedColumnName = "uid")
	public UserPO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserPO supplier) {
		this.supplier = supplier;
	}
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "couid", referencedColumnName = "uid")
	public UserPO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserPO confirmer) {
		this.confirmer = confirmer;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(nullable = true, name = "buid", referencedColumnName = "uid")
	public UserPO getBalancer() {
		return balancer;
	}
	
	public void setBalancer(UserPO balancer) {
		this.balancer = balancer;
	}
	
	public OccessoriesPO init(String no, String orderId, UserPO creater, int company){
		
		setNo(no);
		setOrderId(orderId);
		setCreater(creater);
		setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		setStatus(OccessoriesPO.STATUS_INIT_INT);
		setCompany(company);
		
		return this;
	}

	



}
