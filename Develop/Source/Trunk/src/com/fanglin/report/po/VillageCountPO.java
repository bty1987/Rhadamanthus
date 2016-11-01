package com.fanglin.report.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fanglin.data.po.VillagePO;

@Entity
@Table(name = "villagecount", catalog = "report")
public class VillageCountPO implements java.io.Serializable {

	private static final long serialVersionUID = 7939769521818798794L;
	
	public static final String COLUMN_VILLAGE_X_STR = "village.x";
	
	public static final String COLUMN_VILLAGE_Y_STR = "village.y";

	private Long vcId;
	
	private VillagePO village;
	
	private Integer newOrderNum;
	
	private Integer signOrderNum;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "vcId")
	public Long getVcId() {
		return this.vcId;
	}

	public void setVcId(Long vcId) {
		this.vcId = vcId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "vId", referencedColumnName="vId")
	public VillagePO getVillage() {
		return village;
	}

	public void setVillage(VillagePO village) {
		this.village = village;
	}

	@Column(name = "newOrderNum")
	public Integer getNewOrderNum() {
		return this.newOrderNum;
	}

	public void setNewOrderNum(Integer newOrderNum) {
		this.newOrderNum = newOrderNum;
	}

	@Column(name = "signOrderNum")
	public Integer getSignOrderNum() {
		return this.signOrderNum;
	}

	public void setSignOrderNum(Integer signOrderNum) {
		this.signOrderNum = signOrderNum;
	}

}