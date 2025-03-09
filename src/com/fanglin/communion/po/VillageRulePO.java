package com.fanglin.communion.po;

import java.io.Serializable;
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

import com.fanglin.communion.vo.VillageRuleVO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "villagerule", catalog = "communion")
public class VillageRulePO implements Serializable {

	private static final long serialVersionUID = 3456497337671193517L;

	private Long vrid;

	private long vid;

	private BuildingNameRulePO rule;

	@Id
	@Column(name = "vrid")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long getVrid() {
		return vrid;
	}

	public void setVrid(Long vrid) {
		this.vrid = vrid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "brid", referencedColumnName = "id")
	public BuildingNameRulePO getRule() {
		return rule;
	}

	public void setRule(BuildingNameRulePO rule) {
		this.rule = rule;
	}

	@Column(name = "vid")
	public long getVid() {
		return vid;
	}

	public void setVid(long vid) {
		this.vid = vid;
	}

	public VillageRuleVO ptv(VillageRuleVO villageRuleVO) {

		BeanUtil.copyProperties(this, villageRuleVO, Arrays.asList("rule", "village"));

		if (villageRuleVO.getRule() != null && getRule() != null) BeanUtil.copyProperties(getRule(), villageRuleVO.getRule());

		return villageRuleVO;
	}
}
