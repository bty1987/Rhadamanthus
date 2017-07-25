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
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name="workerSalary", catalog = "platform")
public class WorkerSalaryPO  implements Serializable{
	
	private static final long serialVersionUID = -6436620084581973635L;

	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	public static final String COLUMN_WSID_STR = "wsId";  
	
	public static final String COLUMN_CSID_STR = "cid";   
	
	public static final String COLUMN_STATUS_STR = "status"; 
	
	public static final String COLUMN_USER_USERID_STR = "user.userId";  //员工编号
	
	public static final String COLUMN_CREATETIME_STR = "createTime";    //创建时间

	public static final String COLUMN_BALANCETIME_STR = "balanceTime";  //结算时间
	
	public static final short TYPE_SALARY_STR = 0;                      //工费类型   0工费 1扣款
	
	public static final short TYPE_SALARY_STRONE =1 ;
	
	public static final short STATUS_INIT_STR = 0;                      //状态  初始为0
	
	public static final short STATUS_INIT_STRONE = 1;                      //状态  初始为1
	
	public static final short STATUS_INIT_STRTWO = 2;                      //状态  初始为2
	
	public static final String STATUS_INIT_STRA = "status";                      //状态  初始为0
	
	public static final Long CSID_INIT_STR = 0L; 
	
	public static final String COLUMN_SALARY_STR = "salary";       //如果该工人未设置过工费  初始为0
	
	public static final String COLUMN_APPROVETIME = "approveTime"; 
	
	public static final String COLUMN_CREATETIME = "createTime"; 
	
	
	public static final String ORDERID_STR="decorationOrder.orderId"; //订单编号
	
	public static final String COLUMN_USER_USERNAME="user.userName"; //工人 姓名
	
	public static final String COLUMN_USER_USERDUTY="user.duty";  //工人职位
	
	
	
	private long wsId;
	
	private long cid;
	
	private DecorationOrderPO decorationOrder;
	
	private UserPO user;
	
	private UserPO creater;
	
	private Timestamp createTime;
	
	private  UserPO approver;
	
	private Timestamp approveTime ;
	
	private Timestamp balanceTime;
	
	private float salary;
	
	private short type;
	
	private short subtype ;
	
	private short status;
	
	private String comment ;

	public WorkerSalaryPO() {
		super();
	}


	public WorkerSalaryPO(DecorationOrderPO decorationOrder, UserPO user, UserPO creater,UserPO   approver) {
		super();
		this.decorationOrder = decorationOrder;
		this.user = user;
		this.creater = creater;
		this.approver = approver;
	}

	public WorkerSalaryPO( DecorationOrderPO decorationOrder ,UserPO user, UserPO creater) {
	super();
	this.decorationOrder = decorationOrder;
	this.user = user;
	this.creater = creater;
}
	public WorkerSalaryPO(UserPO user ,UserPO creater) {
		super();
		this.user = user;
		this.creater=creater;
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

	
	@Column(name="cid")
	public long getCid() {
		return cid;
	}


	public void setCid(long cid) {
		this.cid = cid;
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
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationOrderPO getDecorationOrder() {
		return decorationOrder;
	}

	public void setDecorationOrder(DecorationOrderPO decorationOrder) {
		this.decorationOrder = decorationOrder;
	}
	@Column(name="approveTime")
	public Timestamp getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Timestamp approveTime) {
		this.approveTime = approveTime;
	}
	@Column(name="subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}
	@Column(name="comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "createrId", referencedColumnName = "userId")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "approverId", referencedColumnName = "userId")
	public UserPO getApprover() {
		return approver;
	}

	public void setApprover(UserPO approver) {
		this.approver = approver;
	}
	



}
