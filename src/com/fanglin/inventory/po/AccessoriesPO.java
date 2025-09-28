package com.fanglin.inventory.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.HousePO;
import com.fanglin.inventory.vo.AccessoriesVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "accessories", catalog = "inventory")
public class AccessoriesPO implements Serializable {

	private static final long serialVersionUID = -6891774270799222927L;

	public static final String COLUMN_CREATER_USERID_STR = "creater.userId";

	public static final String COLUMN_APPROVER_USERID_STR = "approver.userId";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_APPROVERTIME_STR = "approverTime";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final String COLUMN_NO_STR = "no";

	public static final short TYPE_COMMON_INT = 0;

	public static final short TYPE_POST_INT = 1;

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_ADVANCE_INT = 1; // 预出

	public static final short STATUS_BATCHOUT_INT = 2; // 出货

	public static final short STATUS_REJECT_INT = 3; // 撤销

	public static final short STATUS_UNDO_INT = 4; // 拒绝

	public static final short STATUS_RETURN_INT = 5; // 退回

	public static final short STATUS_DELIVER_INT = 6; // 到货

	public static final short STATUS_AUDIT_INT = 7; // 审批

	private long aid;

	private String no;

	private String orderId;

	private long csid;

	private long cnid;

	private HousePO house;

	private UserPO supervisor;

	private UserPO creater;

	private UserPO approver;

	private UserPO deliver;

	private Timestamp createTime;

	private Timestamp approverTime;

	private Timestamp fetchTime;

	private Timestamp deliverTime;

	private short type;

	private short status;

	private short schedule;

	private long total;

	private int printnum; // 打印次数

	private String comment;

	private int company;

	public AccessoriesPO() {
		super();
	}

	public AccessoriesPO(String no) {
		super();
		this.no = no;
	}

	public AccessoriesPO(UserPO creater, UserPO approver, UserPO supervisor) {
		super();
		this.creater = creater;
		this.approver = approver;
		this.supervisor = supervisor;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
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

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
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
	@JoinColumn(name = "suid", referencedColumnName = "uid")
	public UserPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor) {
		this.supervisor = supervisor;
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
	@JoinColumn(name = "auid", referencedColumnName = "uid")
	public UserPO getApprover() {
		return approver;
	}

	public void setApprover(UserPO approver) {
		this.approver = approver;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "approverTime")
	public Timestamp getApproverTime() {
		return approverTime;
	}

	public void setApproverTime(Timestamp approverTime) {
		this.approverTime = approverTime;
	}

	@Column(name = "fetchTime")
	public Timestamp getFetchTime() {
		return fetchTime;
	}

	public void setFetchTime(Timestamp fetchTime) {
		this.fetchTime = fetchTime;
	}

	public short getSchedule() {
		return schedule;
	}

	public void setSchedule(short schedule) {
		this.schedule = schedule;
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

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "printnum")
	public int getPrintnum() {
		return printnum;
	}

	public void setPrintnum(int printnum) {
		this.printnum = printnum;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "duid", referencedColumnName = "uid")
	public UserPO getDeliver() {
		return deliver;
	}

	public void setDeliver(UserPO deliver) {
		this.deliver = deliver;
	}

	@Column(name = "deliverTime")
	public Timestamp getDeliverTime() {
		return deliverTime;
	}

	public void setDeliverTime(Timestamp deliverTime) {
		this.deliverTime = deliverTime;
	}

	public AccessoriesPO init(String no, String orderId, long csid, long cnid, HousePO house, UserPO creater, Timestamp fetchTime, short schedule, String comment, int company) {

		setNo(no);
		setOrderId(orderId);
		setHouse(house);

		setCsid(csid);
		setCnid(cnid);
		setSchedule(schedule);

		setCreater(creater);
		setFetchTime(fetchTime);

		setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		setStatus(AccessoriesPO.STATUS_INIT_INT);
		setComment(comment);

		setCompany(company);

		return this;
	}

	public AccessoriesVO ptv(AccessoriesVO accessoriesVO) {

		BeanUtil.copyProperties(this, accessoriesVO, Arrays.asList("house", "creater", "approver", "supervisor", "deliver"));

		if (accessoriesVO.getHouse() != null && getHouse() != null) getHouse().ptv(accessoriesVO.getHouse());

		if (accessoriesVO.getCreater() != null && getCreater() != null) accessoriesVO.getCreater().setBaseInfo(getCreater());
		if (accessoriesVO.getApprover() != null && getApprover() != null) accessoriesVO.getApprover().setBaseInfo(getApprover());
		if (accessoriesVO.getSupervisor() != null && getSupervisor() != null) accessoriesVO.getSupervisor().setBaseInfo(getSupervisor());

		return accessoriesVO;
	}
}
