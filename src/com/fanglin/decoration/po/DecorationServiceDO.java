package com.fanglin.decoration.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.decoration.vo.DecorationServiceVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.BeanUtil;

/**
 * 装修服务数据对象（DO）
 * 关联装修订单和服务记录，提供 PO 到 VO 的转换功能
 *
 * @author AI Generated
 * @version 1.0
 * @since 2025-12-20
 */
@Entity
@Table(name = "decorationService", catalog = "decoration")
public class DecorationServiceDO implements Serializable {

	private static final long serialVersionUID = -4568396564651596348L;

	// 服务状态常量
	public static final short SERVICESTATUS_INIT_INT = 0;		// 初始
	public static final short SERVICESTATUS_FINISH_INT = 1;	// 完成

	private long dsid;						// 服务ID
	private String orderId;					// 装修单号
	private String name;					// 服务名称
	private String detail;					// 服务详述
	private UserPO operater;				// 操作人
	private Timestamp operateTime;			// 操作时间
	private short status;					// 状态
	private String comment;					// 备注

	// 关联的装修订单对象
	private DecorationPO decoration;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
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

	/**
	 * 关联装修订单
	 * 注意：这里使用 orderId 字段进行关联，而不是外键关联
	 * 实际使用时需要手动设置此关联关系
	 */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "orderId", referencedColumnName = "orderId", insertable = false, updatable = false)
	public DecorationPO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationPO decoration) {
		this.decoration = decoration;
	}

	/**
	 * PO 转 VO 方法
	 * 将 DecorationServiceDO 转换为 DecorationServiceVO
	 *
	 * @param decorationServiceVO 目标VO对象
	 * @return 转换后的VO对象
	 */
	public DecorationServiceVO ptv(DecorationServiceVO decorationServiceVO) {

		// 复制基础属性（排除关联对象）
		BeanUtil.copyProperties(this, decorationServiceVO, Arrays.asList("decoration", "operater"));

		// 处理操作员信息
		if (decorationServiceVO.getOperater() != null && this.getOperater() != null) {
			// 设置操作员的基础信息（排除部门、角色等复杂关联）
			BeanUtil.copyProperties(this.getOperater(), decorationServiceVO.getOperater(),
				Arrays.asList("duty", "dept", "role"));
		}

		// 设置状态文本
		decorationServiceVO.setStatusText(this.getStatusText());

		return decorationServiceVO;
	}

	/**
	 * 扩展的 PO 转 VO 方法（级联转换）
	 * 包含更多关联信息的转换
	 * 注意：装修订单的关联信息需要在 Service 层单独处理
	 *
	 * @param decorationServiceVO 目标VO对象
	 * @return 转换后的VO对象
	 */
	public DecorationServiceVO ptvcascade(DecorationServiceVO decorationServiceVO) {

		// 调用基础转换方法
		ptv(decorationServiceVO);

		// 扩展处理操作员信息（包含部门、角色信息）
		if (decorationServiceVO.getOperater() != null && this.getOperater() != null) {
			decorationServiceVO.getOperater().setBaseInfo(this.getOperater());
		}

		// 注意：装修订单信息需要在 Service 层通过 orderId 单独查询并设置
		// 这里不处理 decoration 关联，避免 N+1 查询问题

		return decorationServiceVO;
	}

	/**
	 * 状态转换为文本
	 *
	 * @return 状态文本描述
	 */
	public String getStatusText() {
		switch (this.status) {
			case SERVICESTATUS_INIT_INT:
				return "初始";
			case SERVICESTATUS_FINISH_INT:
				return "完成";
			default:
				return "未知";
		}
	}

	/**
	 * 是否为初始状态
	 *
	 * @return true 如果是初始状态
	 */
	public boolean isInitial() {
		return this.status == SERVICESTATUS_INIT_INT;
	}

	/**
	 * 是否为完成状态
	 *
	 * @return true 如果是完成状态
	 */
	public boolean isFinished() {
		return this.status == SERVICESTATUS_FINISH_INT;
	}
}