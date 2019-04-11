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

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "workerSalary", catalog = "salary")
public class WorkerSalaryPO implements Serializable {

	private static final long serialVersionUID = -6436620084581973635L;

	public static final String COLUMN_CSID_STR = "cid";

	public static final String COLUMN_USERID_STR = "user.userId";

	public static final String COLUMN_CREATETIME_STR = "createTime";
	
	public static final String COLUMN_APPROVETIME_STR = "approveTime";

	public static final short TYPE_SALARY_STRONE = 1;

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_PASS_INT = 1; // 通过

	public static final short STATUS_REJECT_INT = 2; // 驳回

	public static final short STATUS_REPEAL_INT = 3; // 撤销

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_CONSTRUCTION_INT = 1;//工程状态

	public static final short TYPE_ADD_INT = 0;// 加

	public static final short TYPE_SUB_INT = 1;// 减

	public static final short ONETYPE_SALARY_INT = 0;// 工费

	public static final short ONETYPE_CUT_INT = 1;// 扣/罚

	public static final short ONETYPE_TRAN_INT = 2;// 转额

	public static final short ONETYPE_ELSE_INT = 3;// 其他

	public static final short TWOTYPE_SALARY_INT = 1;// 工费

	public static final short TWOTYPE_ADDITME_INT = 2;// 增项

	public static final short TWOTYPE_OILER_INT = 3;// 油工一级奖励

	public static final short TWOTYPE_MAINTAIN_INT = 4;// 维修款

	public static final short TWOTYPE_CUT_INT = 5;// 罚款

	public static final short TWOTYPE_PROJECT_INT = 6;// 工程质保金

	public static final short TWOTYPE_TOOL_INT = 7;// 工具押金

	public static final short TWOTYPE_LEND_INT = 8;// 借款

	public static final short TWOTYPE_INSURANCE_INT = 9;// 工人家属保险

	private long wsId;

	private long cwsid;

	private long cid;

	private DecorationPO decoration;

	private UserPO user;

	private UserPO creater;

	private Timestamp createTime;

	private UserPO approver;

	private Timestamp approveTime;

	private Timestamp balanceTime;

	private float salary;

	private short type;

	private short subtype;

	private short status;

	private String comment;

	private int company;

	private long csid;

	private float money;

	private float deposit;

	private short onetype;

	private short twotype;

	private short schedule;

	public WorkerSalaryPO() {
		super();
	}

	public WorkerSalaryPO(DecorationPO decoration, UserPO user, UserPO creater,UserPO approver) {
		super();
		this.decoration = decoration;
		this.user = user;
		this.creater = creater;
		this.approver = approver;
	}

	public WorkerSalaryPO(DecorationPO decoration, UserPO user, UserPO creater) {
		super();
		this.decoration = decoration;
		this.user = user;
		this.creater = creater;
	}

	public WorkerSalaryPO(UserPO user, UserPO creater) {
		super();
		this.user = user;
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "wsid")
	public long getWsId() {
		return wsId;
	}

	public void setWsId(long wsId) {
		this.wsId = wsId;
	}

	@Column(name = "cwsid")
	public long getCwsid() {
		return cwsid;
	}

	public void setCwsid(long cwsid) {
		this.cwsid = cwsid;
	}

	@Column(name = "cid")
	public long getCid() {
		return cid;
	}

	public void setCid(long cid) {
		this.cid = cid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wuid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "salary")
	public float getSalary() {
		return salary;
	}

	public void setSalary(float salary) {
		this.salary = salary;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "approveTime")
	public Timestamp getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Timestamp approveTime) {
		this.approveTime = approveTime;
	}

	@Column(name = "subtype")
	public short getSubtype() {
		return subtype;
	}

	public void setSubtype(short subtype) {
		this.subtype = subtype;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "auid", referencedColumnName = "uid")
	public UserPO getApprover() {
		return approver;
	}

	public void setApprover(UserPO approver) {
		this.approver = approver;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "money")
	public float getMoney() {
		return money;
	}

	public void setMoney(float money) {
		this.money = money;
	}

	@Column(name = "deposit")
	public float getDeposit() {
		return deposit;
	}

	public void setDeposit(float deposit) {
		this.deposit = deposit;
	}

	@Column(name = "onetype")
	public short getOnetype() {
		return onetype;
	}

	public void setOnetype(short onetype) {
		this.onetype = onetype;
	}

	@Column(name = "twotype")
	public short getTwotype() {
		return twotype;
	}

	public void setTwotype(short twotype) {
		this.twotype = twotype;
	}

	@Column(name = "schedule")
	public short getSchedule() {
		return schedule;
	}

	public void setSchedule(short schedule) {
		this.schedule = schedule;
	}

}
