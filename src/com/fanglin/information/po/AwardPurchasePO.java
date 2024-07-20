package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.information.vo.AwardPurchaseVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Entity
@Table(name = "awardpurchase", catalog = "information")
public class AwardPurchasePO implements java.io.Serializable {

	private static final long serialVersionUID = -5796261556954912446L;

	public static final short STATUS_INIT_INT = 0; // 初始

	public static final short STATUS_PROC_INT = 1; // 采购

	public static final short STATUS_WARE_INT = 2; // 入库

	public static final short STATUS_CLOSE_INT = 3; // 结算

	public static final short STATUS_DISABLE_INT = 4; // 失效

	public static final short STATUS_FINISH_INT = 5; // 完成

	private long apid;

	private long fapid;

	private String activity;

	private String dept;

	private AwardStockPO awardStock;

	private int inprice; // 采购价

	private int baprice; // 结算价

	private int num;

	private int surplus;

	private UserPO creater; // 创建人

	private UserPO purchaser; // 采购员

	private UserPO instorer; // 入库员

	private Timestamp createTime; // 创建时间

	private Timestamp purchaseTime; // 采购时间

	private Timestamp instoreTime; // 入库时间

	private Timestamp balanceTime; // 仓储时间

	private short status;

	private String comment;

	private int company;

	public AwardPurchasePO() {
		super();
	}

	public AwardPurchasePO(AwardStockPO awardStock, UserPO creater, UserPO purchaser, UserPO instorer) {
		super();
		this.awardStock = awardStock;
		this.creater = creater;
		this.purchaser = purchaser;
		this.instorer = instorer;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "apid")
	public long getApid() {
		return apid;
	}

	public void setApid(long apid) {
		this.apid = apid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asid", referencedColumnName = "asid")
	public AwardStockPO getAwardStock() {
		return awardStock;
	}

	public void setAwardStock(AwardStockPO awardStock) {
		this.awardStock = awardStock;
	}

	@Column(name = "fapid")
	public long getFapid() {
		return fapid;
	}

	public void setFapid(long fapid) {
		this.fapid = fapid;
	}

	@Column(name = "inprice")
	public int getInprice() {
		return inprice;
	}

	public void setInprice(int inprice) {
		this.inprice = inprice;
	}

	@Column(name = "baprice")
	public int getBaprice() {
		return baprice;
	}

	public void setBaprice(int baprice) {
		this.baprice = baprice;
	}

	@Column(name = "num")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "surplus")
	public int getSurplus() {
		return surplus;
	}

	public void setSurplus(int surplus) {
		this.surplus = surplus;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
	public UserPO getCreater() {
		return creater;
	}

	public void setCreater(UserPO creater) {
		this.creater = creater;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "puid", referencedColumnName = "uid")
	public UserPO getPurchaser() {
		return purchaser;
	}

	public void setPurchaser(UserPO purchaser) {
		this.purchaser = purchaser;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "inid", referencedColumnName = "uid")
	public UserPO getInstorer() {
		return instorer;
	}

	public void setInstorer(UserPO instorer) {
		this.instorer = instorer;
	}

	@Column(name = "activity")
	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	@Column(name = "dept")
	public String getDept() {
		return dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "purchaseTime")
	public Timestamp getPurchaseTime() {
		return purchaseTime;
	}

	public void setPurchaseTime(Timestamp purchaseTime) {
		this.purchaseTime = purchaseTime;
	}

	@Column(name = "instoreTime")
	public Timestamp getInstoreTime() {
		return instoreTime;
	}

	public void setInstoreTime(Timestamp instoreTime) {
		this.instoreTime = instoreTime;
	}

	@Column(name = "balanceTime")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
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

	public AwardPurchasePO init(AwardStockPO awardStock, UserPO creater, UserPO purchaser, UserPO instorer, short status, Integer company, Integer num, String activity, String dept, String comment) {

		setAwardStock(awardStock);

		setCreater(creater);
		setPurchaser(purchaser);
		setInstorer(instorer);

		setNum(num);
		setSurplus(num);
		setActivity(activity);
		setDept(dept);
		setComment(comment);
		setStatus(status);
		setCompany(company);

		setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		return this;
	}

	public AwardPurchaseVO ptv(AwardPurchaseVO awardPurchaseVO) {

		BeanUtil.copyProperties(this, awardPurchaseVO, Arrays.asList("awardStock", "creater", "purchaser", "instorer"));

		if (awardPurchaseVO.getAwardStock() != null) BeanUtil.copyProperties(getAwardStock(), awardPurchaseVO.getAwardStock());
		if (awardPurchaseVO.getCreater() != null) BeanUtil.copyProperties(getCreater(), awardPurchaseVO.getCreater(), Arrays.asList("dept", "role", "duty"));
		if (awardPurchaseVO.getPurchaser() != null) BeanUtil.copyProperties(getPurchaser(), awardPurchaseVO.getPurchaser(), Arrays.asList("dept", "role", "duty"));
		if (awardPurchaseVO.getInstorer() != null) BeanUtil.copyProperties(getInstorer(), awardPurchaseVO.getInstorer(), Arrays.asList("dept", "role", "duty"));

		return awardPurchaseVO;
	}

}
