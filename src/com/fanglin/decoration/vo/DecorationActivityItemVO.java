package com.fanglin.decoration.vo;

import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class DecorationActivityItemVO implements java.io.Serializable {

	private static final long serialVersionUID = 1820529592422543989L;

	private Long daiId;

	private Long aid;

	private String orderId;

	private String activityName;

	private String activityItemName;

	private Short type;

	private Short state;

	private Integer num;

	private Integer money;

	private Integer expendPrice;

	private Integer discountPrice;

	private UserBaseVO receiver;

	private UserBaseVO refunder;

	private Timestamp createTime;

	private Timestamp receiveTime;

	private Timestamp refundTime;

	private Timestamp affirmTime;

	private Timestamp checkTime;

	private Long asid;

	private Short stateType;

	private Short isStock; // 库存标识

	private Short isPrefor; // 业绩标识

	private Short isPayment; // 金额标识

	private Short isAffirm; // 是否确认

	private String content;

	private String comment;

	public DecorationActivityItemVO() {
		super();
	}

	public Long getDaiId() {
		return daiId;
	}

	public void setDaiId(Long daiId) {
		this.daiId = daiId;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getActivityName() {
		return activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}

	public String getActivityItemName() {
		return activityItemName;
	}

	public void setActivityItemName(String activityItemName) {
		this.activityItemName = activityItemName;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getState() {
		return state;
	}

	public void setState(Short state) {
		this.state = state;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public Integer getMoney() {
		return money;
	}

	public void setMoney(Integer money) {
		this.money = money;
	}

	public Integer getExpendPrice() {
		return expendPrice;
	}

	public void setExpendPrice(Integer expendPrice) {
		this.expendPrice = expendPrice;
	}

	public Integer getDiscountPrice() {
		return discountPrice;
	}

	public void setDiscountPrice(Integer discountPrice) {
		this.discountPrice = discountPrice;
	}

	public UserBaseVO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserBaseVO receiver) {
		this.receiver = receiver;
	}

	public UserBaseVO getRefunder() {
		return refunder;
	}

	public void setRefunder(UserBaseVO refunder) {
		this.refunder = refunder;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getRefundTime() {
		return refundTime;
	}

	public void setRefundTime(Timestamp refundTime) {
		this.refundTime = refundTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getAffirmTime() {
		return affirmTime;
	}

	public void setAffirmTime(Timestamp affirmTime) {
		this.affirmTime = affirmTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	public Long getAsid() {
		return asid;
	}

	public void setAsid(Long asid) {
		this.asid = asid;
	}

	public Short getStateType() {
		return stateType;
	}

	public void setStateType(Short stateType) {
		this.stateType = stateType;
	}

	public Short getIsStock() {
		return isStock;
	}

	public void setIsStock(Short isStock) {
		this.isStock = isStock;
	}

	public Short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(Short isPrefor) {
		this.isPrefor = isPrefor;
	}

	public Short getIsPayment() {
		return isPayment;
	}

	public void setIsPayment(Short isPayment) {
		this.isPayment = isPayment;
	}

	public Short getIsAffirm() {
		return isAffirm;
	}

	public void setIsAffirm(Short isAffirm) {
		this.isAffirm = isAffirm;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}