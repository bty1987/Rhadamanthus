package com.fanglin.salary.po;

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
@Table(name="workerSalary", catalog = "platform")
public class WorkerSalaryPO  implements Serializable{
	
	private static final long serialVersionUID = -6436620084581973635L;

	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_WSID_STR = "wsId";  
	
	public static final String COLUMN_CSID_STR = "csId";   
	
	public static final String COLUMN_STATUS_STR = "status"; 
	
	public static final String COLUMN_USER_USERID_STR = "user.userId";  //员工编号
	
	public static final String COLUMN_CREATETIME_STR = "createTime";    //创建时间

	public static final String COLUMN_BALANCETIME_STR = "balanceTime";  //结算时间
	
	public static final short TYPE_SALARY_STR = 0;                      //工费类型   0工费 1扣款
	
	public static final short STATUS_INIT_STR = 0;                      //状态  初始为0
	
	public static final String COLUMN_SALARY_STR = "salary";       //如果该工人未设置过工费  初始为0
	
	public static final String ORDERID_STR="orderId";    //订单编号
	
	public static final String COLUMN_USER_USERNAME="user.userName"; //工人 姓名
	
	private long wsId;
	
	private String orderId;

	private long csId;

	private UserPO user;

	private Timestamp createTime;

	private Timestamp balanceTime;

	private float salary;

	private short type;

	private short status;

	public WorkerSalaryPO() {
		super();
	}

	public WorkerSalaryPO(UserPO user) {
		super();
		this.user = user;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="wsid")
	public long getWsId() {
		return wsId;
	}

	public void setWsId(long wsId) {
		this.wsId = wsId;
	}

	@Column(name="orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name="csid")
	public long getCsId() {
		return csId;
	}

	public void setCsId(long csId) {
		this.csId = csId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", referencedColumnName = "userId")
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

	@Column(name="salary")
	public float getSalary() {
		return salary;
	}

	public void setSalary(float salary) {
		this.salary = salary;
	}

	@Column(name="type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name="status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	
}
