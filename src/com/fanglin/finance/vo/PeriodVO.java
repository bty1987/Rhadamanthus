package com.fanglin.finance.vo;

public class PeriodVO implements java.io.Serializable {

	private static final long serialVersionUID = -6266320636935529208L;

	private Long pid;
	
	private String period;
	
	private Short status;

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

}