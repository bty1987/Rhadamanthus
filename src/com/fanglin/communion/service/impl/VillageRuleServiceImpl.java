package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BuildingNameRuleDao;
import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.dao.VillageRuleDao;
import com.fanglin.communion.po.BuildingNameRulePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.po.VillageRulePO;
import com.fanglin.communion.service.VillageRuleService;
import com.fanglin.communion.vo.BuildingNameRuleVO;
import com.fanglin.communion.vo.VillageRuleVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.utils.BeanUtil;

@Service("villageRuleService")
@Transactional(readOnly = true)
public class VillageRuleServiceImpl implements VillageRuleService {

	@Autowired
	private VillageRuleDao villageRuleDao;

	@Autowired
	private VillageDao villageDao;

	@Autowired
	private BuildingNameRuleDao buildingNameRuleDao;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

	@Override
	public List<VillageRuleVO> queryVillageRule(VillageRuleVO villageRule) throws FLException {

		List<VillageRulePO> villageRulePOs = villageRuleDao.queryVillageRule(villageRule.getVid());
		List<VillageRuleVO> villageRuleVOs = new ArrayList<VillageRuleVO>();

		for (VillageRulePO villageRulePO : villageRulePOs) {
			villageRuleVOs.add(villageRulePO.ptv(new VillageRuleVO(new BuildingNameRuleVO())));
		}

		return villageRuleVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addVillageRule(VillageRuleVO villageRuleVO) throws FLException {

		VillagePO villagePO = villageDao.queryVillage(villageRuleVO.getVid());

		if (villagePO == null) {
			throw new FLException(130003, "楼盘信息不存在");
		}

		BuildingNameRulePO buildingNameRulePO = null;

		// 分支1: 如果传入了规则ID，直接查询验证
		if (villageRuleVO.getRule() != null && villageRuleVO.getRule().getId() != 0) {
			buildingNameRulePO = buildingNameRuleDao.get(villageRuleVO.getRule().getId());
			if (buildingNameRulePO == null) {
				throw new FLException(130004, "楼盘命名规则不存在");
			}
		}
		// 分支2: 如果未传入规则ID，但传入了rule内容，则根据rule查询或创建
		else if (villageRuleVO.getRule() != null && villageRuleVO.getRule().getRule() != null
				&& !villageRuleVO.getRule().getRule().trim().isEmpty()) {
			String ruleContent = villageRuleVO.getRule().getRule().trim();

			// 先根据rule查询是否存在
			buildingNameRulePO = buildingNameRuleDao.queryBuildingNameRule(ruleContent);

			// 如果不存在，创建新规则
			if (buildingNameRulePO == null) {
				buildingNameRulePO = new BuildingNameRulePO();
				buildingNameRulePO.setRule(ruleContent);
				if (villageRuleVO.getRule().getRuleExample() != null) {
					buildingNameRulePO.setRuleExample(villageRuleVO.getRule().getRuleExample().trim());
				}
				if (villageRuleVO.getRule().getRuleContent() != null) {
					buildingNameRulePO.setRuleContent(villageRuleVO.getRule().getRuleContent().trim());
				}
				if (villageRuleVO.getRule().getRulefill() != null) {
					buildingNameRulePO.setRulefill(villageRuleVO.getRule().getRulefill().trim());
				}
				buildingNameRuleDao.save(buildingNameRulePO);
			}
		} else {
			throw new FLException(130005, "请传入规则ID或规则内容");
		}

		VillageRulePO villageRulePO = new VillageRulePO();

		BeanUtil.copyProperties(villageRuleVO, villageRulePO, Arrays.asList("rule"));

		villageRulePO.setRule(new BuildingNameRulePO(buildingNameRulePO.getId()));

		villageRuleDao.save(villageRulePO);

		messageQueuingDao.save(new MessageQueuingPO().init("", "addVillageRule", "{\"vid\":" + villagePO.getVid() + ",\"vrid\":" + villageRulePO.getVrid() + ",\"brid\":" + villageRulePO.getRule().getId() + ",\"event\":\"BUILDING_RULE_CREATED\"}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteVillageRule(VillageRuleVO villageRule) {

		VillageRulePO villageRulePO = villageRuleDao.get(villageRule.getVrid());

		if (villageRulePO == null) return 0;

		villageRuleDao.delete(villageRulePO);

		messageQueuingDao.save(new MessageQueuingPO().init("", "addVillageRule", "{\"vid\":" + villageRulePO.getVid() + ",\"vrid\":" + villageRulePO.getVrid() + ",\"brid\":" + villageRulePO.getRule().getId() + ",\"event\":\"BUILDING_RULE_DELETED\"}"));

		return 0;
	}

}
