package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class OccessoriesVO implements Serializable {

	private static final long serialVersionUID = 6149863865123365606L;

	private Long oid;

	private String no;

	private DecorationVO decoration;

	private UserBaseVO creater;

	private UserBaseVO supervisor;

	private UserBaseVO supplier;

	private UserBaseVO deliver;// 配送人

	private UserBaseVO receiver;// 接收人

	private Timestamp createTime; // 创建时间

	private Timestamp deliveTime; // 配送时间

	private Timestamp receiveTime; // 接收时间

	private Timestamp balanceTime;// 结算时间

	private Timestamp finishTime;// 完成时间

	private Long total;

	private Integer rbalance; // 实结算额

	private Integer vbalance; // 虚结算额

	private Long charge; // 外辅费用总额

	private Long rcharge; // 结算费用

	private short isEnter;// 是否可进园区

	private short isLift;// 是否有电梯

	private short isExceed;// 是否超阶

	private short isAttic;// 是否有阁楼

	private Short status;

	private Integer company;

	private UserBaseVO balancer;// 结算人

	private String comment;

	private String content;

	private Integer rate; // 评分

	private String remake; // 评价

	private Integer amount;

	public OccessoriesVO() {
		super();
	}

	public OccessoriesVO(DecorationVO decoration, UserBaseVO creater, UserBaseVO supervisor, UserBaseVO supplier, UserBaseVO balancer) {

		super();

		this.decoration = decoration;
		this.creater = creater;
		this.supervisor = supervisor;
		this.supplier = supplier;
		this.balancer = balancer;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserBaseVO supervisor) {
		this.supervisor = supervisor;
	}

	public UserBaseVO getDeliver() {
		return deliver;
	}

	public void setDeliver(UserBaseVO deliver) {
		this.deliver = deliver;
	}

	public UserBaseVO getReceiver() {
		return receiver;
	}

	public void setReceiver(UserBaseVO receiver) {
		this.receiver = receiver;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getDeliveTime() {
		return deliveTime;
	}

	public void setDeliveTime(Timestamp deliveTime) {
		this.deliveTime = deliveTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getReceiveTime() {
		return receiveTime;
	}

	public void setReceiveTime(Timestamp receiveTime) {
		this.receiveTime = receiveTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Timestamp balanceTime) {
		this.balanceTime = balanceTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Timestamp finishTime) {
		this.finishTime = finishTime;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Integer getRbalance() {
		return rbalance;
	}

	public void setRbalance(Integer rbalance) {
		this.rbalance = rbalance;
	}

	public Integer getVbalance() {
		return vbalance;
	}

	public void setVbalance(Integer vbalance) {
		this.vbalance = vbalance;
	}

	public Long getCharge() {
		return charge;
	}

	public void setCharge(Long charge) {
		this.charge = charge;
	}

	public Long getRcharge() {
		return rcharge;
	}

	public void setRcharge(Long rcharge) {
		this.rcharge = rcharge;
	}

	public short getIsEnter() {
		return isEnter;
	}

	public void setIsEnter(short isEnter) {
		this.isEnter = isEnter;
	}

	public short getIsLift() {
		return isLift;
	}

	public void setIsLift(short isLift) {
		this.isLift = isLift;
	}

	public short getIsExceed() {
		return isExceed;
	}

	public void setIsExceed(short isExceed) {
		this.isExceed = isExceed;
	}

	public short getIsAttic() {
		return isAttic;
	}

	public void setIsAttic(short isAttic) {
		this.isAttic = isAttic;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public UserBaseVO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserBaseVO supplier) {
		this.supplier = supplier;
	}

	public UserBaseVO getBalancer() {
		return balancer;
	}

	public void setBalancer(UserBaseVO balancer) {
		this.balancer = balancer;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	public String getRemake() {
		return remake;
	}

	public void setRemake(String remake) {
		this.remake = remake;
	}

	public Integer getAmount() {
		return amount;
	}

	public void setAmount(Integer amount) {
		this.amount = amount;
	}

}
