package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.customer.vo.FeedbackGuaranteeVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "feedbackguarantee", catalog = "customer")
public class FeedbackGuaranteePO implements Serializable {

	private static final long serialVersionUID = 4363854156163156719L;

	private long fgid;

	private long fid;

	private String orderId;

	private short source;

	private String phone;

	private short cutomerType;

	private String deptType;

	private String workType;

	private String bids;

	private String brands;

	private UserPO creater;

	private Timestamp createTime;

	private String content;

	private Timestamp reportedDate;

	private String renovationYear;

	private UserPO supervisor;

	private short svUserStatus;

	private short repairResult;

	public FeedbackGuaranteePO() {
		super();

	}

	public FeedbackGuaranteePO(long fgid, long fid, String orderId, short source, String phone, short cutomerType, String deptType, String workType, String bids, String brands, UserPO creater, Timestamp createTime, String content, Timestamp reportedDate, String renovationYear, UserPO supervisor, short svUserStatus, short repairResult) {
		super();
		this.fgid = fgid;
		this.fid = fid;
		this.orderId = orderId;
		this.source = source;
		this.phone = phone;
		this.cutomerType = cutomerType;
		this.deptType = deptType;
		this.workType = workType;
		this.bids = bids;
		this.brands = brands;
		this.creater = creater;
		this.createTime = createTime;
		this.content = content;
		this.reportedDate = reportedDate;
		this.renovationYear = renovationYear;
		this.supervisor = supervisor;
		this.svUserStatus = svUserStatus;
		this.repairResult = repairResult;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "fgid")
	public long getFgid() {
		return fgid;
	}

	public void setFgid(long fgid) {
		this.fgid = fgid;
	}

	@Column(name = "fid")
	public long getFid() {
		return fid;
	}

	public void setFid(long fid) {
		this.fid = fid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "source")
	public short getSource() {
		return source;
	}

	public void setSource(short source) {
		this.source = source;
	}

	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "cutomerType")
	public short getCutomerType() {
		return cutomerType;
	}

	public void setCutomerType(short cutomerType) {
		this.cutomerType = cutomerType;
	}

	@Column(name = "deptType")
	public String getDeptType() {
		return deptType;
	}

	public void setDeptType(String deptType) {
		this.deptType = deptType;
	}

	@Column(name = "workType")
	public String getWorkType() {
		return workType;
	}

	public void setWorkType(String workType) {
		this.workType = workType;
	}

	@Column(name = "bids")
	public String getBids() {
		return bids;
	}

	public void setBids(String bids) {
		this.bids = bids;
	}

	@Column(name = "brands")
	public String getBrands() {
		return brands;
	}

	public void setBrands(String brands) {
		this.brands = brands;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "cuid", referencedColumnName = "uid")
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

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "reportedDate")
	public Timestamp getReportedDate() {
		return reportedDate;
	}

	public void setReportedDate(Timestamp reportedDate) {
		this.reportedDate = reportedDate;
	}

	@Column(name = "renovationYear")
	public String getRenovationYear() {
		return renovationYear;
	}

	public void setRenovationYear(String renovationYear) {
		this.renovationYear = renovationYear;
	}

	@ManyToOne
	@JoinColumn(nullable = true, name = "svuid", referencedColumnName = "uid")
	public UserPO getSupervisor() {
		return supervisor;
	}

	public void setSupervisor(UserPO supervisor) {
		this.supervisor = supervisor;
	}

	@Column(name = "svUserStatus")
	public short getSvUserStatus() {
		return svUserStatus;
	}

	public void setSvUserStatus(short svUserStatus) {
		this.svUserStatus = svUserStatus;
	}

	@Column(name = "repairResult")
	public short getRepairResult() {
		return repairResult;
	}

	public void setRepairResult(short repairResult) {
		this.repairResult = repairResult;
	}

	public FeedbackGuaranteeVO ptv(FeedbackGuaranteeVO feedbackGuaranteeVO) {

		BeanUtil.copyPropertie(this, feedbackGuaranteeVO, Arrays.asList("creater"));

		if (feedbackGuaranteeVO.getCreater() != null && getCreater() != null) feedbackGuaranteeVO.getCreater().ptv(getCreater());

		if (feedbackGuaranteeVO.getSupervisor() != null && getSupervisor() != null) feedbackGuaranteeVO.getSupervisor().ptv(getSupervisor());

		return feedbackGuaranteeVO;
	}

}
