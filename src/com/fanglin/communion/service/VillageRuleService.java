package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.VillageRuleVO;
import com.fanglin.core.interceptor.FLException;

public interface VillageRuleService {

	public List<VillageRuleVO> queryVillageRule(VillageRuleVO villageRule) throws FLException;

	public int addVillageRule(VillageRuleVO villageRule) throws FLException;

	public int deleteVillageRule(VillageRuleVO villageRule) throws FLException;

}
