package com.fanglin.communion.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rolechart", catalog = "communion")
public class RoleChartPO implements java.io.Serializable {

	private static final long serialVersionUID = -6566273229389992941L;

	private int rcid;
	
	private int rid;
	
	private ChartPO chartPO;

	public RoleChartPO() {
		super();
	}
	
	public RoleChartPO(int rid, ChartPO chartPO) {
		super();
		this.rid = rid;
		this.chartPO = chartPO;
	}

	@Id
	@GeneratedValue
	@Column(name = "rcid")
	public int getRcid() {
		return rcid;
	}

	public void setRcid(int rcid) {
		this.rcid = rcid;
	}

	@Column(name = "rid")
	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
		this.rid = rid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cid", referencedColumnName = "cid")
	public ChartPO getChartPO() {
		return chartPO;
	}

	public void setChartPO(ChartPO chartPO) {
		this.chartPO = chartPO;
	}
	

}
