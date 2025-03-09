package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.VillageRuleDao;
import com.fanglin.communion.po.BuildingNameRulePO;
import com.fanglin.communion.po.VillageRulePO;
import com.fanglin.communion.service.VillageRuleService;
import com.fanglin.communion.vo.BuildingNameRuleVO;
import com.fanglin.communion.vo.VillageRuleVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.BeanUtil;

@Service("villageRuleService")
@Transactional(readOnly = true)
public class VillageRuleServiceImpl implements VillageRuleService {

	@Autowired
	private VillageRuleDao villageRuleDao;

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

		VillageRulePO villageRulePO = new VillageRulePO();

		BeanUtil.copyProperties(villageRuleVO, villageRulePO, Arrays.asList("rule"));

		villageRulePO.setRule(new BuildingNameRulePO(villageRuleVO.getRule().getId()));

		villageRuleDao.save(villageRulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteVillageRule(VillageRuleVO villageRule) {

		VillageRulePO villageRulePO = villageRuleDao.get(villageRule.getVrid());

		if (villageRulePO != null) {
			villageRuleDao.delete(villageRulePO);
		}

		return 0;
	}

}
