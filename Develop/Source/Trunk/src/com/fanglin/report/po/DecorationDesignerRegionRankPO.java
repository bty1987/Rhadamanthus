package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "decorationdesignerregionrank", catalog = "platform")
public class DecorationDesignerRegionRankPO implements java.io.Serializable {

	private static final long serialVersionUID = 4985808246215863830L;
	
	public static final int STATUS_TYPE_INIT_INT = 0;
	
	public static final int STATUS_TYPE_DISABLED_INT = 1;
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final String COLUMN_DESIGNERREGIONID_STR = "designerRegionId";
	
	public static final String COLUMN_RANK_STR = "rank";

	private int ddrrId;
	
	private String designerRegionId;
	
	private String designerRegionName;
	
	private String createTime;
	
	private String endTime;
	
	private double rank;
	
	private int status;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ddrrId")
	public int getDdrrId() {
		return this.ddrrId;
	}

	public void setDdrrId(int ddrrId) {
		this.ddrrId = ddrrId;
	}

	@Column(name = "designerRegionId")
	public String getDesignerRegionId() {
		return this.designerRegionId;
	}

	public void setDesignerRegionId(String designerRegionId) {
		this.designerRegionId = designerRegionId;
	}

	@Column(name = "designerRegionName")
	public String getDesignerRegionName() {
		return this.designerRegionName;
	}

	public void setDesignerRegionName(String designerRegionName) {
		this.designerRegionName = designerRegionName;
	}

	@Column(name = "createTime")
	public String getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "endTime")
	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "rank")
	public double getRank() {
		return this.rank;
	}

	public void setRank(double rank) {
		this.rank = rank;
	}

	@Column(name = "status")
	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}