package com.fanglin.salary.po;

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

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "workerSalary", catalog = "salary")
public class WorkerSalaryPO implements Serializable {

	private static final long serialVersionUID = -6436620084581973635L;

	public static final String COLUMN_CSID_STR = "csid";

	public static final String COLUMN_USERID_STR = "user.userId";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_APPROVETIME_STR = "approveTime";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_PASS_INT = 1; // 通过

	public static final short STATUS_REJECT_INT = 2; // 驳回

	public static final short STATUS_REPEAL_INT = 3; // 撤销

	public static final short TYPE_ADD_INT = 0; // 加

	public static final short TYPE_SUB_INT = 1; // 减

	public static final short ONETYPE_SALARY_INT = 0; // 工费

	public static final short ONETYPE_CUT_INT = 1; // 扣/罚

	public static final short ONETYPE_TRAN_INT = 2; // 转额

	public static final short ONETYPE_ELSE_INT = 3; // 其他

	public static final short TWOTYPE_SALARY_INT = 1; // 工费

	public static final short TWOTYPE_ADDITME_INT = 2; // 增项

	public static final short TWOTYPE_OILER_INT = 3; // 油工一级奖励

	public static final short TWOTYPE_MAINTAIN_INT = 4; // 维修款

	public static final short TWOTYPE_CUT_INT = 5; // 罚款

	public static final short TWOTYPE_PROJECT_INT = 6; // 工程质保金

	public static final short TWOTYPE_TOOL_INT = 7; // 工具押金

	public static final short TWOTYPE_LEND_INT = 8; // 借款

	public static final short TWOTYPE_INSURANCE_INT = 9; // 工人家属保险

	public static final short ISSEND_UNSEND_INT = 0;

	public static final short ISSEND_SEND_INT = 1;

	public static final short ISSEND_SENDED_INT = 2;

	public static final short ISAPPR_UNAPPR_INT = 0; // 初始

	public static final short ISAPPR_APPR_INT = 1; // 代发

	public static final short ISAPPR_APPRED_INT = 2; // 已发

	private long wsid;

	private DecorationPO decoration;

	private long cid;

	private long csid;

	private long cwsid;

	private long money;

	private long deposit;

	private long salary;

	private short schedule;

	private short type;

	private short subtype;

	private short onetype;

	private short twotype;

	private int count;

	private short isSend;

	private short isAppr;

	private short status;

	private UserPO user;

	private UserPO creater;

	private UserPO approver;

	private Timestamp createTime;

	private Timestamp approveTime;

	private Timestamp balanceTime;

	private String comment;

	private int company;

	public WorkerSalaryPO init(UserPO worker, UserPO creater, String comment, int company) {

		setUser(worker);
		setCreater(creater);

		setComment(comment);
		setCompany(company);

		setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		return this;
	}

	public WorkerSalaryPO init(long money, long deposit, long salary) {

		setMoney(money);
		setDeposit(deposit);
		setSalary(salary);

		return this;
	}

	public WorkerSalaryPO init(short type, short onetype, short twotype, short status) {

		setType(type);
		setOnetype(onetype);
		setTwotype(twotype);

		setStatus(status);

		return this;
	}

	public WorkerSalaryPO approve(UserPO approver) {

		setApprover(approver);

		setApproveTime(DateUtil.getDateToTimestamp(new Date()));

		return this;
	}

	public WorkerSalaryPO() {
		super();
	}

	public WorkerSalaryPO(DecorationPO decoration, UserPO user, UserPO creater, UserPO approver) {
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
	public long getWsid() {
		return wsid;
	}

	public void setWsid(long wsid) {
		this.wsid = wsid;
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
	public long getSalary() {
		return salary;
	}

	public void setSalary(long salary) {
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
	public long getMoney() {
		return money;
	}

	public void setMoney(long money) {
		this.money = money;
	}

	@Column(name = "deposit")
	public long getDeposit() {
		return deposit;
	}

	public void setDeposit(long deposit) {
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

	@Column(name = "count")
	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	@Column(name = "isSend")
	public short getIsSend() {
		return isSend;
	}

	public void setIsSend(short isSend) {
		this.isSend = isSend;
	}

	@Column(name = "isAppr")
	public short getIsAppr() {
		return isAppr;
	}

	public void setIsAppr(short isAppr) {
		this.isAppr = isAppr;
	}

}
