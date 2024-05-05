package com.fanglin.sales.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.personel.vo.UserBaseVO;

public class SalesBalanceVO implements Serializable {

	private static final long serialVersionUID = 8746688072267319344L;

	private Long sbid;

	private SalesVO sales;

	private SalesRefundsVO refunds;

	private UserBaseVO creater;

	private UserBaseVO salesman;

	private DepartmentVO dept;

	private DepartmentVO region;

	private Timestamp createTime;

	private UserBaseVO poster;

	private Timestamp postTime;

	private UserBaseVO voster;

	private Timestamp venderTime;

	private UserBaseVO checker;

	private Timestamp checkTime;

	private Long allowance;

	private Long coupon;

	private Long total;

	private Long balance;

	private Long difference;

	private Long vbalance;

	private Long pbalance;

	private Short type;

	private Short onetype;

	private Short status;

	private Short deliverStatus;

	private Short verifyStatus;

	private Short confirmStatus;

	private Short checkStatus;

	private String comment;

	public SalesBalanceVO() {
		super();
	}

	public SalesBalanceVO(SalesVO sales, SalesRefundsVO refunds, UserBaseVO creater, UserBaseVO poster, UserBaseVO salesman, DepartmentVO dept, DepartmentVO region, UserBaseVO checker) {
		super();
		this.sales = sales;
		this.refunds = refunds;
		this.creater = creater;
		this.poster = poster;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
		this.checker = checker;
	}

	public SalesBalanceVO(SalesVO sales, SalesRefundsVO refunds, UserBaseVO creater, UserBaseVO poster, UserBaseVO salesman, DepartmentVO dept, DepartmentVO region, UserBaseVO checker, UserBaseVO voster) {
		super();
		this.sales = sales;
		this.refunds = refunds;
		this.creater = creater;
		this.poster = poster;
		this.salesman = salesman;
		this.dept = dept;
		this.region = region;
		this.checker = checker;
		this.voster = voster;
	}

	public Long getSbid() {
		return sbid;
	}

	public void setSbid(Long sbid) {
		this.sbid = sbid;
	}

	public SalesVO getSales() {
		return sales;
	}

	public void setSales(SalesVO sales) {
		this.sales = sales;
	}

	public SalesRefundsVO getRefunds() {
		return refunds;
	}

	public void setRefunds(SalesRefundsVO refunds) {
		this.refunds = refunds;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public UserBaseVO getSalesman() {
		return salesman;
	}

	public void setSalesman(UserBaseVO salesman) {
		this.salesman = salesman;
	}

	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public DepartmentVO getRegion() {
		return region;
	}

	public void setRegion(DepartmentVO region) {
		this.region = region;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public UserBaseVO getPoster() {
		return poster;
	}

	public void setPoster(UserBaseVO poster) {
		this.poster = poster;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getPostTime() {
		return postTime;
	}

	public void setPostTime(Timestamp postTime) {
		this.postTime = postTime;
	}

	public UserBaseVO getVoster() {
		return voster;
	}

	public void setVoster(UserBaseVO voster) {
		this.voster = voster;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getVenderTime() {
		return venderTime;
	}

	public void setVenderTime(Timestamp venderTime) {
		this.venderTime = venderTime;
	}

	public UserBaseVO getChecker() {
		return checker;
	}

	public void setChecker(UserBaseVO checker) {
		this.checker = checker;
	}

	public Timestamp getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Timestamp checkTime) {
		this.checkTime = checkTime;
	}

	public Long getAllowance() {
		return allowance;
	}

	public void setAllowance(Long allowance) {
		this.allowance = allowance;
	}

	public Long getCoupon() {
		return coupon;
	}

	public void setCoupon(Long coupon) {
		this.coupon = coupon;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public Long getBalance() {
		return balance;
	}

	public void setBalance(Long balance) {
		this.balance = balance;
	}

	public Long getDifference() {
		return difference;
	}

	public void setDifference(Long difference) {
		this.difference = difference;
	}

	public Long getVbalance() {
		return vbalance;
	}

	public void setVbalance(Long vbalance) {
		this.vbalance = vbalance;
	}

	public Long getPbalance() {
		return pbalance;
	}

	public void setPbalance(Long pbalance) {
		this.pbalance = pbalance;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getOnetype() {
		return onetype;
	}

	public void setOnetype(Short onetype) {
		this.onetype = onetype;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getDeliverStatus() {
		return deliverStatus;
	}

	public void setDeliverStatus(Short deliverStatus) {
		this.deliverStatus = deliverStatus;
	}

	public Short getVerifyStatus() {
		return verifyStatus;
	}

	public void setVerifyStatus(Short verifyStatus) {
		this.verifyStatus = verifyStatus;
	}

	public Short getConfirmStatus() {
		return confirmStatus;
	}

	public void setConfirmStatus(Short confirmStatus) {
		this.confirmStatus = confirmStatus;
	}

	public Short getCheckStatus() {
		return checkStatus;
	}

	public void setCheckStatus(Short checkStatus) {
		this.checkStatus = checkStatus;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
