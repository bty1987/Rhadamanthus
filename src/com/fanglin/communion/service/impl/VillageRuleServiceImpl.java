package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

		VillageRulePO villageRulePO = new VillageRulePO();

		BeanUtil.copyProperties(villageRuleVO, villageRulePO, Arrays.asList("rule"));

		villageRulePO.setRule(new BuildingNameRulePO(villageRuleVO.getRule().getId()));

		villageRuleDao.save(villageRulePO);

		messageQueuingDao.save(new MessageQueuingPO().init("", "addVillageRule", "{\"vid\":" + villagePO.getVid() + "\",\"vrid\":" + villageRulePO.getVrid() + "\",\"brid\":" + villageRulePO.getRule().getId() + ",\"event\":\"BUILDING_RULE_CREATED\"}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteVillageRule(VillageRuleVO villageRule) {

		VillageRulePO villageRulePO = villageRuleDao.get(villageRule.getVrid());

		if (villageRulePO == null) return 0;

		villageRuleDao.delete(villageRulePO);

		messageQueuingDao.save(new MessageQueuingPO().init("", "addVillageRule", "{\"vid\":" + villageRulePO.getVid() + "\",\"vrid\":" + villageRulePO.getVrid() + "\",\"brid\":" + villageRulePO.getRule().getId() + ",\"event\":\"BUILDING_RULE_DELETED\"}"));

		return 0;
	}

}
