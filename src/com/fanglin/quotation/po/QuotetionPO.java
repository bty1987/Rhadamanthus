package com.fanglin.quotation.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.utils.DateUtil;
import com.fanglin.utils.UUIDUtil;

@Entity
@Table(name = "quotetion", catalog = "quotetion")
public class QuotetionPO implements Serializable {

	private static final long serialVersionUID = -7574124519130135638L;

	private long qid;

	private String no;

	private String name;

	private String version;

	private long cuid;

	private Timestamp createTime;

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

	@Column(name = "version")
	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
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

	@Column(name = "unachePrice")
	public long getUnachePrice() {
		return unachePrice;
	}

	public void setUnachePrice(long unachePrice) {
		this.unachePrice = unachePrice;
	}

	public void ptp(String name, String version, long cuid) {

		this.setName(name);
		this.setVersion(version);
		this.setNo(UUIDUtil.getUuid().substring(0, 15));
		this.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		this.setCuid(cuid);
		this.setDiscount(10000);
		this.setTotalPrice(0);
		this.setContent("");
		this.setBasePrice(0);

	}

}
