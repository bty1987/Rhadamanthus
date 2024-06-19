package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.vo.ProtationVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "protation", catalog = "quotation")
public class ProtationDO implements Serializable {

	private static final long serialVersionUID = -7576350125993452066L;

	public static final short DEFAULT_COMMON_INT = 0;

	public static final short DEFAULT_DEFAULT_INT = 1;

	public static final short STATUS_INIT_INT = 0;

	public static final short STATUS_UNLOCK_INT = 0;

	public static final short STATUS_LOCK_INT = 2;

	private long pid;

	private long ppid;

	private String product;

	private DecorationPO decoration;

	private String name;

	private Timestamp createTime;

	private UserPO creater;

	private QuotationVersionPO version;

	private long quotePrice;

	private int quoteArea;

	private long unitPrice;

	private long costPrice;

	private int profitRate;

	private long basicPrice;

	private long comdPrice;

	private long commPrice;

	private long adddPrice;

	private long addmPrice;

	private long subdPrice;

	private long submPrice;

	private long subcPrice;

	private long preferPrice;

	private String manageFormula;

	private long managePrice;

	private long totalPrice;

	private short status;

	private short defaults;

	private long mostPrice;

	private int costRate;

	private int mostRate;

	private long totalCost;

	private long totalProfit;

	private long accdPrice;

	private long accmPrice;

	private int discount;

	private int manageRate;

	private String comment;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@Column(name = "ppid")
	public long getPpid() {
		return ppid;
	}

	public void setPpid(long ppid) {
		this.ppid = ppid;
	}

	@Column(name = "product")
	public String getProduct() {
		return product;
	}

	public void setProduct(String product) {
		this.product = product;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName = "orderId")
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
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
	@JoinColumn(name = "qvid", referencedColumnName = "qvId")
	public QuotationVersionPO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionPO version) {
		this.version = version;
	}

	@Column(name = "quotePrice")
	public long getQuotePrice() {
		return quotePrice;
	}

	public void setQuotePrice(long quotePrice) {
		this.quotePrice = quotePrice;
	}

	@Column(name = "quoteArea")
	public int getQuoteArea() {
		return quoteArea;
	}

	public void setQuoteArea(int quoteArea) {
		this.quoteArea = quoteArea;
	}

	@Column(name = "unitPrice")
	public long getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(long unitPrice) {
		this.unitPrice = unitPrice;
	}

	@Column(name = "costPrice")
	public long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(long costPrice) {
		this.costPrice = costPrice;
	}

	@Column(name = "profitRate")
	public int getProfitRate() {
		return profitRate;
	}

	public void setProfitRate(int profitRate) {
		this.profitRate = profitRate;
	}

	@Column(name = "basicPrice")
	public long getBasicPrice() {
		return basicPrice;
	}

	public void setBasicPrice(long basicPrice) {
		this.basicPrice = basicPrice;
	}

	@Column(name = "comdPrice")
	public long getComdPrice() {
		return comdPrice;
	}

	public void setComdPrice(long comdPrice) {
		this.comdPrice = comdPrice;
	}

	@Column(name = "commPrice")
	public long getCommPrice() {
		return commPrice;
	}

	public void setCommPrice(long commPrice) {
		this.commPrice = commPrice;
	}

	@Column(name = "adddPrice")
	public long getAdddPrice() {
		return adddPrice;
	}

	public void setAdddPrice(long adddPrice) {
		this.adddPrice = adddPrice;
	}

	@Column(name = "addmPrice")
	public long getAddmPrice() {
		return addmPrice;
	}

	public void setAddmPrice(long addmPrice) {
		this.addmPrice = addmPrice;
	}

	@Column(name = "subdPrice")
	public long getSubdPrice() {
		return subdPrice;
	}

	public void setSubdPrice(long subdPrice) {
		this.subdPrice = subdPrice;
	}

	@Column(name = "submPrice")
	public long getSubmPrice() {
		return submPrice;
	}

	public void setSubmPrice(long submPrice) {
		this.submPrice = submPrice;
	}

	@Column(name = "subcPrice")
	public long getSubcPrice() {
		return subcPrice;
	}

	public void setSubcPrice(long subcPrice) {
		this.subcPrice = subcPrice;
	}

	@Column(name = "preferPrice")
	public long getPreferPrice() {
		return preferPrice;
	}

	public void setPreferPrice(long preferPrice) {
		this.preferPrice = preferPrice;
	}

	@Column(name = "manageFormula")
	public String getManageFormula() {
		return manageFormula;
	}

	public void setManageFormula(String manageFormula) {
		this.manageFormula = manageFormula;
	}

	@Column(name = "managePrice")
	public long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(long managePrice) {
		this.managePrice = managePrice;
	}

	@Column(name = "totalPrice")
	public long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(long totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "defaults")
	public short getDefaults() {
		return defaults;
	}

	public void setDefaults(short defaults) {
		this.defaults = defaults;
	}

	@Column(name = "mostPrice")
	public long getMostPrice() {
		return mostPrice;
	}

	public void setMostPrice(long mostPrice) {
		this.mostPrice = mostPrice;
	}

	@Column(name = "costRate")
	public int getCostRate() {
		return costRate;
	}

	public void setCostRate(int costRate) {
		this.costRate = costRate;
	}

	@Column(name = "mostRate")
	public int getMostRate() {
		return mostRate;
	}

	public void setMostRate(int mostRate) {
		this.mostRate = mostRate;
	}

	@Column(name = "totalCost")
	public long getTotalCost() {
		return totalCost;
	}

	public void setTotalCost(long totalCost) {
		this.totalCost = totalCost;
	}

	@Column(name = "totalProfit")
	public long getTotalProfit() {
		return totalProfit;
	}

	public void setTotalProfit(long totalProfit) {
		this.totalProfit = totalProfit;
	}

	@Column(name = "accdPrice")
	public long getAccdPrice() {
		return accdPrice;
	}

	public void setAccdPrice(long accdPrice) {
		this.accdPrice = accdPrice;
	}

	@Column(name = "accmPrice")
	public long getAccmPrice() {
		return accmPrice;
	}

	public void setAccmPrice(long accmPrice) {
		this.accmPrice = accmPrice;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "manageRate")
	public int getManageRate() {
		return manageRate;
	}

	public void setManageRate(int manageRate) {
		this.manageRate = manageRate;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public ProtationVO ptv(ProtationVO protationVO) {

		BeanUtil.copyPropertie(this, protationVO, Arrays.asList("decoration", "creater", "version"));

		if (protationVO.getDecoration() != null) {
			getDecoration().ptvcascade(protationVO.getDecoration());
			protationVO.getDecoration().setSupervisor(new UserBaseVO());
		}
		if (protationVO.getCreater() != null) BeanUtil.copyProperties(getCreater(), protationVO.getCreater(), Arrays.asList("duty", "dept", "role"));
		if (protationVO.getVersion() != null) BeanUtil.copyProperties(getVersion(), protationVO.getVersion());

		return protationVO;
	}
}
