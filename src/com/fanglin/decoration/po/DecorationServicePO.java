package com.fanglin.decoration.po;

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

import com.fanglin.decoration.vo.DecorationServiceVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "decorationService", catalog = "decoration")
public class DecorationServicePO implements Serializable {

	private static final long serialVersionUID = -4568396564651596348L;

	public static final String DECORATION_ORDERID_STR = "orderId";

	public static final String DECORATION_DSID_STR = "dsid";

	public static final short SERVICESTATUS_INIT_INT = 0;

	public static final short SERVICESTATUS_FINISH_INT = 1;

	// 服务类型常量
	public static final short TYPE_DESIGN_CONFIRM = 1;      // 设计方案确认
	public static final short TYPE_CONSTRUCTION_CONFIRM = 2; // 施工方案确认
	public static final short TYPE_DRAWLINE = 3;             // 放线服务
	public static final short TYPE_SUPERVISION = 4;          // 施工巡查
	public static final short TYPE_ACCEPTANCE = 5;           // 验收服务
	public static final short TYPE_OTHER = 9;                // 其他自定义服务

	// 设计确认结果常量
	public static final short CONFIRM_RESULT_COMPLETE = 2;  // 完成
	public static final short CONFIRM_RESULT_MINOR = 4;     // 微改
	public static final short CONFIRM_RESULT_MAJOR = 6;     // 大改

	// 设计确认状态常量
	public static final short CONFIRM_STATUS_PENDING = 0;   // 待确认
	public static final short CONFIRM_STATUS_CONFIRMED = 1; // 已确认

	private long dsid;

	private String orderId;

	private String name;

	private String detail;

	private UserPO operater;

    private UserPO finisher;

    private Timestamp createTime;

    private Timestamp planTime;

	private Timestamp operateTime;

    private Timestamp finishTime;

	private short status;

	private String comment;

	private int overdueDays;

	private short type;

	private String args;  // 扩展参数(JSON格式),存储设计确认相关数据

	@Id
	@GeneratedValue
	@Column(name = "dsid")
	public long getDsid() {
		return dsid;
	}

	public void setDsid(long dsid) {
		this.dsid = dsid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "detail")
	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "dsuid", referencedColumnName = "uid")
	public UserPO getOperater() {
		return operater;
	}

	public void setOperater(UserPO operater) {
		this.operater = operater;
	}

	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "comment")
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
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

	@Column(name = "planTime")
	public Timestamp getPlanTime() {
		return planTime;
	}

	public void setPlanTime(Timestamp planTime) {
		this.planTime = planTime;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "fuid", referencedColumnName = "uid")
	public UserPO getFinisher() {
		return finisher;
	}

	public void setFinisher(UserPO finisher) {
		this.finisher = finisher;
	}

	@Column(name = "overdueDays")
	public int getOverdueDays() {
		return overdueDays;
	}

	public void setOverdueDays(int overdueDays) {
		this.overdueDays = overdueDays;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "args", columnDefinition = "TEXT")
	public String getArgs() {
		return args;
	}

	public void setArgs(String args) {
		this.args = args;
	}

	public DecorationServiceVO ptv(DecorationServiceVO decorationServiceVO) {

		BeanUtil.copyProperties(this, decorationServiceVO, Arrays.asList("decoration", "operater", "finisher"));

		if (decorationServiceVO.getOperater() != null && this.getOperater() != null) decorationServiceVO.getOperater().setBaseInfo(getOperater());
		if (decorationServiceVO.getFinisher() != null && this.getFinisher() != null) decorationServiceVO.getFinisher().setBaseInfo(getFinisher());

		return decorationServiceVO;
	}

}
