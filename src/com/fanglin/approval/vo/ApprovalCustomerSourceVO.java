package com.fanglin.approval.vo;

import java.io.Serializable;

import com.fanglin.customer.vo.CustomerSourceVO;

public class ApprovalCustomerSourceVO implements Serializable {

	private static final long serialVersionUID = -6273621152285807270L;

	private Long acsid;

	private Long aid;

	private Long csid;

	private Long ccid;

	private Long cid;

	private Long hid;

	private CustomerSourceVO source;

	private Long dbid;

	private Integer rate;

	public Long getAcsid() {
		return acsid;
	}

	public void setAcsid(Long acsid) {
		this.acsid = acsid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public Long getCsid() {
		return csid;
	}

	public void setCsid(Long csid) {
		this.csid = csid;
	}

	public Long getCcid() {
		return ccid;
	}

	public void setCcid(Long ccid) {
		this.ccid = ccid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getHid() {
		return hid;
	}

	public void setHid(Long hid) {
		this.hid = hid;
	}

	public CustomerSourceVO getSource() {
		return source;
	}

	public void setSource(CustomerSourceVO source) {
		this.source = source;
	}

	public Long getDbid() {
		return dbid;
	}

	public void setDbid(Long dbid) {
		this.dbid = dbid;
	}

	public Integer getRate() {
		return rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

}
