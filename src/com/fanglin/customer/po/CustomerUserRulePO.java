package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

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

import com.fanglin.customer.vo.CustomerUserRuleVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

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

	public static final short STATUS_USER_INVALID_INT = 1; // 个人失效

	public static final short STATUS_DEPT_INVALID_INT = 2; // 部分失效

	public static final short STATUS_REGION_INVALID_INT = 3; // 分区失效

	public static final short STATUS_DISABLE_INT = 4; // 禁用

	private long curid;

	private UserPO user;

	private String period;

	private int measureNum;

	private int contractNum;

	private long contractPrice;

	private long materialPrice;

	private long designPrice;

	private long predisPrice; // 折前额

	private int score;

	private int rank;

	private int chance;

	private int surplus;

	private int polling;

	private UserPO creater;

	private Timestamp createTime;

	private Timestamp updateTime;

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
	public long getContractPrice() {
		return contractPrice;
	}

	public void setContractPrice(long contractPrice) {
		this.contractPrice = contractPrice;
	}

	@Column(name = "materialPrice")
	public long getMaterialPrice() {
		return materialPrice;
	}

	public void setMaterialPrice(long materialPrice) {
		this.materialPrice = materialPrice;
	}

	@Column(name = "designPrice")
	public long getDesignPrice() {
		return designPrice;
	}

	public void setDesignPrice(long designPrice) {
		this.designPrice = designPrice;
	}

	@Column(name = "predisPrice")
	public long getPredisPrice() {
		return predisPrice;
	}

	public void setPredisPrice(long predisPrice) {
		this.predisPrice = predisPrice;
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

	@Column(name = "updateTime")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
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

	public CustomerUserRuleVO ptv(CustomerUserRuleVO customerUserRuleVO) {

		BeanUtil.copyProperties(this, customerUserRuleVO, Arrays.asList("user", "creater"));

		if (customerUserRuleVO.getUser() != null) customerUserRuleVO.getUser().ptv(getUser());
		if (customerUserRuleVO.getCreater() != null) customerUserRuleVO.getCreater().ptv(getCreater());

		return customerUserRuleVO;
	}
}
