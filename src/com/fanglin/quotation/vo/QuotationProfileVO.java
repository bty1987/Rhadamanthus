package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

public class QuotationProfileVO implements Serializable {

	private static final long serialVersionUID = -6780048546296201489L;

	private Long qpid;

	private Long tid;

	private Long qid;

	private String orderId;

	private String name;

	private UserBaseVO creater;

	private Timestamp createTime;

	private Short type;

	private Short status;

	private Integer company;

	private List<QuotationProfileItemVO> items;

	public QuotationProfileVO() {
		super();
	}

	public QuotationProfileVO(Long tid, String orderId) {
		super();
		this.tid = tid;
		this.orderId = orderId;
	}

	public QuotationProfileVO(List<QuotationProfileItemVO> items, UserBaseVO creater) {
		super();
		this.items = items;
		this.creater = creater;
	}

	public QuotationProfileVO(UserBaseVO creater) {
		super();
		this.creater = creater;
	}

	public Long getQpid() {
		return qpid;
	}

	public void setQpid(Long qpid) {
		this.qpid = qpid;
	}

	public Long getTid() {
		return tid;
	}

	public void setTid(Long tid) {
		this.tid = tid;
	}

	public Long getQid() {
		return qid;
	}

	public void setQid(Long qid) {
		this.qid = qid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
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

	public List<QuotationProfileItemVO> getItems() {
		return items;
	}

	public void setItems(List<QuotationProfileItemVO> items) {
		this.items = items;
	}

}
