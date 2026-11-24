package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "activityitem", catalog = "information")
public class ActivityItemPO implements java.io.Serializable {

	private static final long serialVersionUID = -7540185816527717351L;

	public static final String COLUMN_LEVEL_STR = "level";
	public static final short LEVEL_COMMON_INT = 0; // 普通(申领可见)
	public static final short LEVEL_MANAGE_INT = 1; // 管理专用(仅"添加活动物品"高级功能可见), 后续层级递增

	public static final short TYPE_COUPON_INT = 0;// 券

	public static final short TYPE_THING_INT = 1;// 物品

	public static final short TYPE_REDPACKAGE_INT = 2;// 红包

	public static final short TYPE_COST_COUPON_INT = 10;// 优惠额度-券

	public static final short TYPE_COST_THING_INT = 11;// 优惠额度-物品

	public static final short TYPE_COST_REDPACKAGE_INT = 12;// 优惠额度-红包

	public static final short TYPE_LADDER_LOTTERY_INT = 30;// 阶梯奖品(挂awardstock, money=面值, 同活动多行按面值降序降级发放, 收款抵扣走salespayment)

	public static final Short[] TYPE_COST_FAMILY = {TYPE_COST_COUPON_INT, TYPE_COST_THING_INT, TYPE_COST_REDPACKAGE_INT};// 优惠额度族(精确枚举,勿用>=范围判定——type=30阶梯券会被误圈)

	public static final String COLUMN_AID_STR = "aid";

	public static final String COLUMN_STARTTIME_STR = "startTime";
	public static final String COLUMN_ENDTIME_STR = "endTime";

	private long aiid;

	private long aid;

	private long asid;

	private AwardStockPO awardStock; // 奖品库关联(asid只读外联取库存/名称; 增改仍走asid标量, 不参与持久化)

	private String activity;

	private String name;

	private short type;

	private int money;

	private int integral;

	private short level; // 资格层级 0:普通(申领可见) 1:管理专用(仅"添加活动物品"高级功能可见), 后续可扩展更高层级

	private Timestamp startTime; // 物品有效期起(阶梯奖品type=30判窗用, 优先级高于活动窗口, 空=逐边界回退活动)
	private Timestamp endTime; // 物品有效期止(同上)

	public ActivityItemPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aiid")
	public long getAiid() {
		return aiid;
	}

	public void setAiid(long aiid) {
		this.aiid = aiid;
	}

	@Column(name = "aId")
	public long getAid() {
		return this.aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	@Column(name = "activity")
	public String getActivity() {
		return activity;
	}

	public void setActivity(String activity) {
		this.activity = activity;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "asid")
	public long getAsid() {
		return asid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asid", referencedColumnName = "asId", insertable = false, updatable = false)
	public AwardStockPO getAwardStock() {
		return awardStock;
	}

	public void setAwardStock(AwardStockPO awardStock) {
		this.awardStock = awardStock;
	}

	public void setAsid(long asid) {
		this.asid = asid;
	}

	@Column(name = "money")
	public int getMoney() {
		return money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	@Column(name = "integral")
	public int getIntegral() {
		return integral;
	}

	public void setIntegral(int integral) {
		this.integral = integral;
	}

	@Column(name = "level")
	public short getLevel() {
		return level;
	}

	public void setLevel(short level) {
		this.level = level;
	}

	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

}