package com.fanglin.quotation.po;

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

import com.fanglin.data.po.GoodsPO;
import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "selectionItem", catalog = "quotation")
public class SelectionItemPO implements Serializable {

	private static final long serialVersionUID = 3447514822840845685L;

	public static final String COLUMN_QUOTEID_STR = "quoteId";

	public static final String COLUMN_TYPE_STR = "type";

	public static final String COLUMN_SID_STR = "sid";

	public static final String COLUMN_SUID_STR = "suid";

	public static final String COLUMN_AREAID_STR = "areaId";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short TYPE_QUOTATION_SHORT = 0;// 类型, 报价项

	public static final short TYPE_EXTENSIONADD_SHORT = 1;// 类型, 拓展增

	public static final short TYPE_EXTENSIONMINUS_SHORT = 2;// 类型, 拓展减

	public static final short TYPE_ADDITEM_SHORT = 3;// 类型, 增项

	public static final short TYPE_MINUSITEM_SHORT = 4;// 类型, 减项

	public static final short STATUS_INIT_SHORT = 0;// 状态, 初始

	public static final short STATUS_TRAN_SHORT = 1;// 状态, 配送

	public static final short STATUS_CHECK_SHORT = 2;// 状态, 审核

	public static final short STATUS_CONFIRM_SHORT = 3;// 状态, 确认

	public static final short STATUS_FINISH_SHORT = 4;// 状态, 完结

	public static final short STATUS_BALANCE_SHORT = 5;// 状态, 结算

	private long siid;// 选材项ID

	private long sid;// 选材单ID

	private long quoteId;// 引用项ID , 包括三个类型 , 分别是报价项 , 拓展项 , 增减项

	private short type;// 类型 , 0: 报价项 , 1: 拓展增项 , 2: 拓展减项 , 3: 增项, 4: 减项

	private GoodsPO goods;// 商品

	private int num;// 数量

	private String orderId;// 装修单号

	private long areaId;// 功能区id

	private String areaName;// 功能区名字

	private long suid;// 厂商id

	private short status;// 状态 , 0: 初始 , 1: 配送 , 2: 审核 , 3: 确认 , 4: 结算

	private int initNum;// 工程量

	private int refnum;// 退数量

	private int postprice;// 售价

	private int preprice;// 预算金额

	private Timestamp createTime;// 创建时间

	private Timestamp tranTime;// 配送时间

	private Timestamp checkTime;// 审核时间

	private Timestamp confirmTime;// 确认时间

	private Timestamp balanceTime;// 结算时间

	private Timestamp finishTime;// 完结时间

	private UserPO traner;// 配送人

	private UserPO checker;// 审核人

	private UserPO confirmer;// 确认人

	private UserPO balancer;// 结算人

	private UserPO finish;// 完结人

	private String comment;// 注释

	private int company;

	public SelectionItemPO() {
		super();
	}

	public SelectionItemPO(GoodsPO goods) {
		super();
		this.goods = goods;
	}

	@Id
	@GeneratedValue
	@Column(name = "siid")
	public long getSiid() {
		return siid;
	}

	public void setSiid(long siid) {
		this.siid = siid;
	}

	@Column(name = "sid")
	public long getSid() {
		return sid;
	}

	public void setSid(long sid) {
		this.sid = sid;
	}

	@Column(name = "quoteId")
	public long getQuoteId() {
		return quoteId;
	}

	public void setQuoteId(long quoteId) {
		this.quoteId = quoteId;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "gid", referencedColumnName = "gid")
	public GoodsPO getGoods() {
		return goods;
	}

	public void setGoods(GoodsPO goods) {
		this.goods = goods;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "areaId")
	public long getAreaId() {
		return areaId;
	}

	public void setAreaId(long areaId) {
		this.areaId = areaId;
	}

	@Column(name = "suid")
	public long getSuid() {
		return suid;
	}

	public void setSuid(long suid) {
		this.suid = suid;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "initnum")
	public int getInitNum() {
		return initNum;
	}

	public void setInitNum(int initNum) {
		this.initNum = initNum;
	}

	@Column(name = "refnum")
	public int getRefnum() {
		return refnum;
	}

	public void setRefnum(int refnum) {
		this.refnum = refnum;
	}

	@Column(name = "postprice")
	public int getPostprice() {
		return postprice;
	}

	public void setPostprice(int postprice) {
		this.postprice = postprice;
	}

	@Column(name = "preprice")
	public int getPreprice() {
		return preprice;
	}

	public void setPreprice(int preprice) {
		this.preprice = preprice;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "tranTime")
	public Timestamp getTranTime() {
		return tranTime;
	}

	public void setTranTime(Timestamp tranTime) {
		this.tranTime = tranTime;
	}

	@Column(name = "checkTime")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	@Column(name = "confirmTime")
	public Timestamp getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Timestamp confirmTime) {
		this.confirmTime = confirmTime;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "tuid", referencedColumnName = "uid")
	public UserPO getTraner() {
		return traner;
	}

	public void setTraner(UserPO traner) {
		this.traner = traner;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "chuid", referencedColumnName = "uid")
	public UserPO getChecker() {
		return checker;
	}

	public void setChecker(UserPO checker) {
		this.checker = checker;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "couid", referencedColumnName = "uid")
	public UserPO getConfirmer() {
		return confirmer;
	}

	public void setConfirmer(UserPO confirmer) {
		this.confirmer = confirmer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "buid", referencedColumnName = "uid")
	public UserPO getBalancer() {
		return balancer;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "fuid", referencedColumnName = "uid")
	public UserPO getFinish() {
		return finish;
	}

	public void setFinish(UserPO finish) {
		this.finish = finish;
	}

	public void setBalancer(UserPO balancer) {
		this.balancer = balancer;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "areaName")
	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
