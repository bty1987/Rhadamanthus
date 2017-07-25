package com.fanglin.inventory.po;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Column;
import com.fanglin.personel.po.UserPO;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.FetchType;
import java.io.Serializable;
import java.sql.Timestamp;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Table(name="purchase", catalog = "inventory")
public class PurchasePO implements Serializable{

	private static final long serialVersionUID = -3959134790545293130L;

	public static final String COLUMN_CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_PID_STR = "pid";                  //采购单ID
	
	public static final String COLUMN_NO_STR = "no";                    //编号
	
	public static final String COLUMN_USER_UID_STR = "user.uid";        //员工编号
	
	public static final String COLUMN_USER_NAME_STR = "user.userName";  //创建人名字
	
	public static final String COLUMN_CREATETIME_STR = "createTime";    //创建时间
	
	public static final String COLUMN_BALANCETIME_STR = "balanceTime";  //结算时间
	
	public static final short COLUMN_STATUS_STR = 0;                    //初始入库状态
	
	public static final short COLUMN_SECTIONSTATUS_STR = 1;             //部分入库状态
	
	public static final short COLUMN_BALANCESTATUS_STR = 0;             //结算状态
	
	public static final String COLUMN_COMMENT_STR = "comment";          //说明
	
	public static final String COLUMN_COMPANY_STR = "company";
	
	private long pid;
	
	private String no;
	
	private UserPO user;
	
	private Timestamp createTime;
	
	private Timestamp balanceTime;
	
	private Timestamp deliveryTime;
	
	private short status;
	
	private short balanceStatus;
	
	private String comment;
	
	private int company;
	
	public PurchasePO() {
		super();
	}
	
	public PurchasePO(String no) {
		super();
		this.no = no;
	}
	
	public PurchasePO(Long pid) {
		super();
		this.pid = pid;
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name="no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name="createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name="balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}
	
	@Column(name="deliveryTime")
	public Timestamp getDeliveryTime() {
		return deliveryTime;
	}

	public void setDeliveryTime(Timestamp deliveryTime) {
		this.deliveryTime = deliveryTime;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name="balanceStatus")
	public short getBalanceStatus() {
		return balanceStatus;
	}

	public void setBalanceStatus(short balanceStatus) {
		this.balanceStatus = balanceStatus;
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
