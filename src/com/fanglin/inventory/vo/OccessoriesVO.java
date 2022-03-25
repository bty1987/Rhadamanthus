package com.fanglin.inventory.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;

public class OccessoriesVO implements Serializable {

	private static final long serialVersionUID = 6149863865123365606L;

	private Long oid;

	private String no;

	private DecorationVO decoration;

	private UserBaseVO creater;

	private UserBaseVO supervisor;

	private UserVO supplier;

	private Timestamp createTime; // 创建时间

	private Timestamp deliveTime; // 配送时间

	private Timestamp receiveTime; // 接收时间

	private Timestamp balanceTime;// 结算时间

	private short isEnter;// 是否可进园区

	private short isLift;// 是否有电梯

	private short isExceed;// 是否超阶

	private short isAttic;// 是否有阁楼

	private Short status;

	private Integer company;

	private UserBaseVO balancer;// 结算人

	public OccessoriesVO() {
		super();
	}

	public OccessoriesVO(DecorationVO decoration, UserBaseVO creater, UserBaseVO supervisor, UserBaseVO confirmer, UserBaseVO balancer) {

		super();

		this.decoration = decoration;
		this.creater = creater;
		this.supervisor = supervisor;
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

	public UserVO getSupplier() {
		return supplier;
	}

	public void setSupplier(UserVO supplier) {
		this.supplier = supplier;
	}

	public UserBaseVO getBalancer() {
		return balancer;
	}

	public void setBalancer(UserBaseVO balancer) {
		this.balancer = balancer;
	}

}
