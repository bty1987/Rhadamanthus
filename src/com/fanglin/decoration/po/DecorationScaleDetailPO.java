package com.fanglin.decoration.po;

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

import com.fanglin.personel.po.UserPO;

/**
 * 销售收款配比明细: 阶梯活动券(type=30,已领)在销售收款中使用时, 记录"收款单↔券行↔是否计入配比"。
 * 
 * <p>
 * 修复配比糊涂账——saleTotal 现算构成(销售收款+主材余额+需配比场外款)首次有可追溯明细;
 * 计入效果 = 配比计算链(updateDecorationForSaleScale) SUM(isScale=计入)。
 * 🔴sourceType 枚举可扩(未来场外款明细化等接入), 表结构不动。
 */
@Entity
@Table(name = "decorationscaledetail", catalog = "decoration")
public class DecorationScaleDetailPO implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	public static final short SOURCE_LADDER_COUPON_INT = 1; // 来源: 阶梯活动券

	public static final short ISSCALE_IN_INT = 0; // 计入配比

	public static final short ISSCALE_OUT_INT = 1; // 不计入配比

	public static final short STATUS_VALID_INT = 0; // 有效

	private long dsdId;

	private Long spid;

	private String orderId;

	private Short sourceType;

	private Long sourceId;

	private Long daiId;

	private Long asid;

	private Long money;

	private Short isScale;

	private Short status;

	private UserPO creater;

	private Timestamp createTime;

	private String comment;

	public DecorationScaleDetailPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "dsdId")
	public long getDsdId() {
		return dsdId;
	}

	public void setDsdId(long dsdId) {
		this.dsdId = dsdId;
	}

	@Column(name = "spid")
	public Long getSpid() {
		return spid;
	}

	public void setSpid(Long spid) {
		this.spid = spid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "sourceType")
	public Short getSourceType() {
		return sourceType;
	}

	public void setSourceType(Short sourceType) {
		this.sourceType = sourceType;
	}

	@Column(name = "sourceId")
	public Long getSourceId() {
		return sourceId;
	}

	public void setSourceId(Long sourceId) {
		this.sourceId = sourceId;
	}

	@Column(name = "daiId")
	public Long getDaiId() {
		return daiId;
	}

	public void setDaiId(Long daiId) {
		this.daiId = daiId;
	}

	@Column(name = "asid")
	public Long getAsid() {
		return asid;
	}

	public void setAsid(Long asid) {
		this.asid = asid;
	}

	@Column(name = "money")
	public Long getMoney() {
		return money;
	}

	public void setMoney(Long money) {
		this.money = money;
	}

	@Column(name = "isScale")
	public Short getIsScale() {
		return isScale;
	}

	public void setIsScale(Short isScale) {
		this.isScale = isScale;
	}

	@Column(name = "status")
	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creater", referencedColumnName = "uid")
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

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
