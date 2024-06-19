package com.fanglin.customer.po;

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

import com.fanglin.personel.po.UserPO;

@Entity
@Table(name = "customerUserRule", catalog = "customer")
public class CustomerUserRulePO implements Serializable {

	private static final long serialVersionUID = 6310243647781392121L;

	public static final String COLUMN_USER_STR = "user.userId";

	public static final String COLUMN_CREATER_STR = "creater.userId";

	public static final String COLUMN_CREATETIME_STR = "createTime";

	public static final String COLUMN_FINISHTIME_STR = "finishTime";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_COMPANY_STR = "company";

	public static final short STATUS_ENABLE_INT = 0; // 启用

	public static final short STATUS_DISABLE_INT = 1; // 禁用

	private long curid;

	private UserPO user;

	private String period;

	private int measureNum;

	private int contractNum;

	private int contractPrice;

	private int materialPrice;

	private int designPrice;

	private int score;

	private int rank;

	private int chance;

	private int surplus;

	private int polling;

	private UserPO creater;

	private Timestamp createTime;

	private Timestamp finishTime;

	private short status;

	private int company;

	public CustomerUserRulePO() {
		super();
	}

	public CustomerUserRulePO(UserPO user, UserPO creater) {
		super();
		this.user = user;
		this.creater = creater;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "curid")
	public long getCurid() {
		return curid;
	}

	public void setCurid(long curid) {
		this.curid = curid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "period")
	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@Column(name = "measureNum")
	public int getMeasureNum() {
		return measureNum;
	}

	public void setMeasureNum(int measureNum) {
		this.measureNum = measureNum;
	}

	@Column(name = "contractNum")
	public int getContractNum() {
		return contractNum;
	}

	public void setContractNum(int contractNum) {
		this.contractNum = contractNum;
	}

	@Column(name = "contractPrice")
	public int getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(int contractPrice) {
		this.contractPrice = contractPrice;
	}

	@Column(name = "materialPrice")
	public int getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(int materialPrice) {
		this.materialPrice = materialPrice;
	}

	@Column(name = "designPrice")
	public int getDesignPrice() {
		return designPrice;
	}

	public void setDesignPrice(int designPrice) {
		this.designPrice = designPrice;
	}

	@Column(name = "score")
	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	@Column(name = "rank")
	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	@Column(name = "chance")
	public int getChance() {
		return chance;
	}

	public void setChance(int chance) {
		this.chance = chance;
	}

	@Column(name = "surplus")
	public int getSurplus() {
		return surplus;
	}

	public void setSurplus(int surplus) {
		this.surplus = surplus;
	}

	@Column(name = "polling")
	public int getPolling() {
		return polling;
	}

	public void setPolling(int polling) {
		this.polling = polling;
	}

	@ManyToOne(fetch = FetchType.EAGER)
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

	@Column(name = "finishTime")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
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

}
