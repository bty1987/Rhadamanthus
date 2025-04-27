package com.fanglin.quotation.po;

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

import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.quotation.vo.QuotetionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.UUIDUtil;

@Entity
@Table(name = "quotetion", catalog = "quotetion")
public class QuotetionPO implements Serializable {

	private static final long serialVersionUID = -7574124519130135638L;

	public static final short KEEPRICE_LATEST_INT = 0;// 最新

	public static final short KEEPRICE_TIMEKEEP_INT = 1;// 保时

	public static final short KEEPRICE_PRICEKEEP_INT = 2;// 保价

	public static final short KEEPRICE_ALLKEEP_INT = 3;// 保时/保价

	private long qid;

	private String no;

	private String name;

	private QuotationVersionPO version;

	private long cuid;

	private Timestamp createTime;

	private Timestamp updateTime;

	private int discount;

	private long basePrice;

	private long undisPrice;

	private long disPrice;

	private long totalPrice;

	private long managePrice;

	private int manageRate;

	private short manageDiscount;

	private long trafficPrice;

	private int trafficRate;

	private short trafficDiscount;

	private long taxPrice;

	private int taxRate;

	private short taxDiscount;

	private long costPrice;

	private long consPrice;

	private long comsPrice;

	private long unachePrice;

	private String content;

	public QuotetionPO() {
		super();
	}

	public QuotetionPO(long qid) {
		super();
		this.qid = qid;
	}

	@Id
	@GeneratedValue
	@Column(name = "qid")
	public long getQid() {
		return qid;
	}

	public void setQid(long qid) {
		this.qid = qid;
	}

	@Column(name = "no")
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "qvid", referencedColumnName = "qvId")
	public QuotationVersionPO getVersion() {
		return version;
	}

	public void setVersion(QuotationVersionPO version) {
		this.version = version;
	}

	@Column(name = "cuid")
	public long getCuid() {
		return cuid;
	}

	public void setCuid(long cuid) {
		this.cuid = cuid;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "undisPrice")
	public long getUndisPrice() {
		return undisPrice;
	}

	public void setUndisPrice(long undisPrice) {
		this.undisPrice = undisPrice;
	}

	@Column(name = "disPrice")
	public long getDisPrice() {
		return disPrice;
	}

	public void setDisPrice(long disPrice) {
		this.disPrice = disPrice;
	}

	@Column(name = "discount")
	public int getDiscount() {
		return discount;
	}

	public void setDiscount(int discount) {
		this.discount = discount;
	}

	@Column(name = "totalPrice")
	public long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(long totalPrice) {
		this.totalPrice = totalPrice;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "managePrice")
	public long getManagePrice() {
		return managePrice;
	}

	public void setManagePrice(long managePrice) {
		this.managePrice = managePrice;
	}

	@Column(name = "manageRate")
	public int getManageRate() {
		return manageRate;
	}

	public void setManageRate(int manageRate) {
		this.manageRate = manageRate;
	}

	@Column(name = "manageDiscount")
	public short getManageDiscount() {
		return manageDiscount;
	}

	public void setManageDiscount(short manageDiscount) {
		this.manageDiscount = manageDiscount;
	}

	@Column(name = "trafficPrice")
	public long getTrafficPrice() {
		return trafficPrice;
	}

	public void setTrafficPrice(long trafficPrice) {
		this.trafficPrice = trafficPrice;
	}

	@Column(name = "trafficRate")
	public int getTrafficRate() {
		return trafficRate;
	}

	public void setTrafficRate(int trafficRate) {
		this.trafficRate = trafficRate;
	}

	@Column(name = "trafficDiscount")
	public short getTrafficDiscount() {
		return trafficDiscount;
	}

	public void setTrafficDiscount(short trafficDiscount) {
		this.trafficDiscount = trafficDiscount;
	}

	@Column(name = "taxPrice")
	public long getTaxPrice() {
		return taxPrice;
	}

	public void setTaxPrice(long taxPrice) {
		this.taxPrice = taxPrice;
	}

	@Column(name = "taxRate")
	public int getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(int taxRate) {
		this.taxRate = taxRate;
	}

	@Column(name = "taxDiscount")
	public short getTaxDiscount() {
		return taxDiscount;
	}

	public void setTaxDiscount(short taxDiscount) {
		this.taxDiscount = taxDiscount;
	}

	@Column(name = "basePrice")
	public long getBasePrice() {
		return basePrice;
	}

	public void setBasePrice(long basePrice) {
		this.basePrice = basePrice;
	}

	@Column(name = "costPrice")
	public long getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(long costPrice) {
		this.costPrice = costPrice;
	}

	@Column(name = "consPrice")
	public long getConsPrice() {
		return consPrice;
	}

	public void setConsPrice(long consPrice) {
		this.consPrice = consPrice;
	}

	@Column(name = "comsPrice")
	public long getComsPrice() {
		return comsPrice;
	}

	public void setComsPrice(long comsPrice) {
		this.comsPrice = comsPrice;
	}

	@Column(name = "unachePrice")
	public long getUnachePrice() {
		return unachePrice;
	}

	public void setUnachePrice(long unachePrice) {
		this.unachePrice = unachePrice;
	}

	public void ptp(QuotationVersionPO version, String name, long cuid, Timestamp updateTime) {

		this.setVersion(version);

		this.setName(name);
		this.setNo(UUIDUtil.getUuid().substring(0, 15));

		this.setCuid(cuid);

		this.setBasePrice(0);
		this.setDiscount(10000);
		this.setTotalPrice(0);

		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setUpdateTime(updateTime);

		this.setContent("");

	}

	public QuotetionVO ptv(QuotetionVO quotetionVO) {

		BeanUtil.copyProperties(this, quotetionVO, Arrays.asList("version"));

		if (quotetionVO.getVersion() != null) BeanUtil.copyProperties(getVersion(), quotetionVO.getVersion());

		return quotetionVO;
	}

}
