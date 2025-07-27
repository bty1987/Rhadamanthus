package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class QuotationPictureVO implements Serializable {

	private static final long serialVersionUID = -2093582506082868036L;

	private Long qpid;

	private String orderId;

	private Long qid;

	private Long areaId;

	private String areaName;

	private Long bid;

	private Long qiid;

	private String name;

	private String path;

	private Integer filesize;

	private Short type;

	private Short atttype;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short status;

	public QuotationPictureVO() {
		super();
	}

	public QuotationPictureVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getQpid() {
		return qpid;
	}

	public void setQpid(Long qpid) {
		this.qpid = qpid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public Long getBid() {
		return bid;
	}

	public void setBid(Long bid) {
		this.bid = bid;
	}

	public Long getQiid() {
		return qiid;
	}

	public void setQiid(Long qiid) {
		this.qiid = qiid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Integer getFilesize() {
		return filesize;
	}

	public void setFilesize(Integer filesize) {
		this.filesize = filesize;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Short getAtttype() {
		return atttype;
	}

	public void setAtttype(Short atttype) {
		this.atttype = atttype;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}
