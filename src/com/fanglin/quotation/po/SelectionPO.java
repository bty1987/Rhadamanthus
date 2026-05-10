package com.fanglin.quotation.po;

import java.io.Serializable;
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
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.vo.SelectionVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "selection", catalog = "quotation")
public class SelectionPO implements Serializable {

	private static final long serialVersionUID = -5852812670584756277L;

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_QID_STR = "qid";

	public static final short STATUS_LOCK_INT = 1;// 状态, 锁定

	public static final short STATUS_INIT_INT = 0;// 状态, 初始

	public static final short ISAFFIRM_UNCONFIRMED_INT = 0;

	public final short ISAFFIRM_CONFIRMED_INT = 1;

	private long sid;// 选材单ID

	private String orderId;// 装修单号

	private long qid;// 报价ID

	private long total;// 总额

	private long quotationTotal;// 报价总额

	private long extensionAddTotal;// 拓展增总额

	private long extensionReduceTotal;// 拓展减总额

	private long addReduceAddTotal;// 增减增总额

	private long addReduceMinusTotal;// 增减减总额

	private Timestamp createTime;// 创建时间

	private Timestamp affirmTime;// 确认时间

	private Timestamp sendTime;// 推送时间

	private UserPO creater;

	private UserPO splitter;

	private UserPO traner;

	private short status;// 状态 , 0: 初始 , 1: 锁定

	private short isAffirm;// 是否确认 , 0: 未确认 , 1: 客户确认

	private int company;

	public SelectionPO() {
		super();
	}

	@Id
	@GeneratedValue
	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "isAffirm")
	public short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(short isAffirm) {
		this.isAffirm = isAffirm;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "total")
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	@Column(name = "quotationTotal")
	public long getQuotationTotal() {
		return quotationTotal;
	}

	public void setQuotationTotal(long quotationTotal) {
		this.quotationTotal = quotationTotal;
	}

	@Column(name = "extensionAddTotal")
	public long getExtensionAddTotal() {
		return extensionAddTotal;
	}

	public void setExtensionAddTotal(long extensionAddTotal) {
		this.extensionAddTotal = extensionAddTotal;
	}

	@Column(name = "extensionReduceTotal")
	public long getExtensionReduceTotal() {
		return extensionReduceTotal;
	}

	public void setExtensionReduceTotal(long extensionReduceTotal) {
		this.extensionReduceTotal = extensionReduceTotal;
	}

	@Column(name = "addReduceAddTotal")
	public long getAddReduceAddTotal() {
		return addReduceAddTotal;
	}

	public void setAddReduceAddTotal(long addReduceAddTotal) {
		this.addReduceAddTotal = addReduceAddTotal;
	}

	@Column(name = "addReduceMinusTotal")
	public long getAddReduceMinusTotal() {
		return addReduceMinusTotal;
	}

	public void setAddReduceMinusTotal(long addReduceMinusTotal) {
		this.addReduceMinusTotal = addReduceMinusTotal;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "affirmTime")
	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	@Column(name = "sendTime")
	public Timestamp getSendTime() {
		return sendTime;
	}

	public void setSendTime(Timestamp sendTime) {
		this.sendTime = sendTime;
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
	@JoinColumn(nullable = true, name = "suid", referencedColumnName = "uid")
	public UserPO getSplitter() {
		return splitter;
	}

	public void setSplitter(UserPO splitter) {
		this.splitter = splitter;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "tuid", referencedColumnName = "uid")
	public UserPO getTraner() {
		return traner;
	}

	public void setTraner(UserPO traner) {
		this.traner = traner;
	}

	private void ptv(SelectionVO selectionVO) {

		BeanUtil.copyProperties(this, selectionVO, Arrays.asList("creater", "splitter", "traner"));

		selectionVO.setSplitter(new UserBaseVO());
		selectionVO.setTraner(new UserBaseVO());

		BeanUtil.copyPropertie(this.getSplitter(), selectionVO.getSplitter(), Arrays.asList("duty", "dept"));
		BeanUtil.copyPropertie(this.getTraner(), selectionVO.getTraner(), Arrays.asList("duty", "dept"));

	}

	public void ptvcascade(SelectionVO selectionVO) {

		ptv(selectionVO);

	}

	/**
	 * 反向赋值: SelectionVO -> SelectionPO
	 * 将VO中的基本属性拷贝到PO(this)，并处理关联对象的赋值过程。
	 * 排除关联对象(creater/splitter/traner)，需在Service层单独处理。
	 */
	public void set$ptv(SelectionVO selectionVO) {

		BeanUtil.copyProperties(selectionVO, this, Arrays.asList("creater", "splitter", "traner", "decoration", "sid"));

		if (selectionVO.getSplitter() != null && selectionVO.getSplitter().getUserId() != null) {
			UserPO splitter = new UserPO();
			splitter.setUserId(selectionVO.getSplitter().getUserId());
			this.setSplitter(splitter);
		}

		if (selectionVO.getTraner() != null && selectionVO.getTraner().getUserId() != null) {
			UserPO traner = new UserPO();
			traner.setUserId(selectionVO.getTraner().getUserId());
			this.setTraner(traner);
		}
	}
}
