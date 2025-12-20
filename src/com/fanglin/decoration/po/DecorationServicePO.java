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

	private long dsid;

	private String orderId;

	private String name;

	private String detail;

	private UserPO operater;

	private Timestamp operateTime;

	private short status;

	private String comment;

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

	public DecorationServiceVO ptv(DecorationServiceVO decorationServiceVO) {

		BeanUtil.copyProperties(this, decorationServiceVO, Arrays.asList("decoration", "operater"));

		if (decorationServiceVO.getOperater() != null && this.getOperater() != null) decorationServiceVO.getOperater().setBaseInfo(getOperater());

		return decorationServiceVO;
	}

}
