package com.fanglin.sales.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.personel.po.UserPO;
import com.fanglin.sales.vo.SalesRefundsVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "salesrefunds", catalog = "sales")
public class SalesRefundsPO implements java.io.Serializable {

	private static final long serialVersionUID = -8157873351014476905L;

	public static final String COLUMN_RID_STR = "rid";

	public static final String COLUMN_SID_STR = "sales.sid";

	public static final String COLUMN_SPID_STR = "spid";

	public static final String COLUMN_TOTAL_STR = "total";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short STATUS_TYPE_REFUNDS_INT = 0;

	public static final short ISAFFIRM_AFFIRM_INT = 0;

	public static final short ISAFFIRM_NONE_INT = 0;

	public static final String COLUMN_CUID_STR = "user.uid";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_BALANCETIME_STR = "balanceTime";

	private long rid; // 退货单id

	private SalesPO sales;// 销售单id

	private long spid; // 款项id

	private long total; // 合计

	private short status; // 状态

	private short type; // 类型

	private short isAffirm; // 确认状态 , 0: 确认 , 1: 未确认

	private UserPO creater; // 创建人

	private Timestamp createTime;// 创建时间

	private Timestamp balanceTime;// 结算时间

	private Timestamp affirmTime;// 确认时间

	private String comment; // 说明

	public SalesRefundsPO(long rid) {

		super();

		this.rid = rid;
	}

	public SalesRefundsPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rid")
	public long getRid() {
		return rid;
	}

	public void setRid(long rid) {
		this.rid = rid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sid", referencedColumnName = "sid")
	public SalesPO getSales() {
		return sales;
	}

	public void setSales(SalesPO sales) {
		this.sales = sales;
	}

	@Column(name = "spid")
	public long getSpid() {
		return spid;
	}

	public void setSpid(long spid) {
		this.spid = spid;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
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
	@JoinColumn(name = "cuid", referencedColumnName = "uid")
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

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "isAffirm")
	public short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(short isAffirm) {
		this.isAffirm = isAffirm;
	}

	@Column(name = "affirmTime")
	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public SalesRefundsVO ptv(SalesRefundsVO salesRefundsVO) {

		BeanUtil.copyProperties(this, salesRefundsVO, Arrays.asList("creater", "sales"));

		if (salesRefundsVO.getSales() != null && getSales() != null) getSales().ptv(salesRefundsVO.getSales());

		if (salesRefundsVO.getCreater() != null && getCreater() != null) salesRefundsVO.getCreater().setBaseInfo(getCreater());

		return salesRefundsVO;
	}

}
