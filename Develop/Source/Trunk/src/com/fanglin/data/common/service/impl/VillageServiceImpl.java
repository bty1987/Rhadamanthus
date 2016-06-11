package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.vo.BuildingNameRuleVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.common.dao.VillageDao;
import com.fanglin.data.common.service.VillageService;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("villageService")
@Transactional(readOnly = true)
public class VillageServiceImpl implements VillageService {

	@Autowired
	private VillageDao villageDao;
	
	@Override
	public void pageVillage(Paging paging, List<FilterVO> filters){

		List<VillagePO> villagePOs = villageDao.pageVillages(paging, filters);
		List<VillageVO> villageVOs = new ArrayList<VillageVO>();
		
		for(VillagePO villagePO: villagePOs){
			villageVOs.add(covertBean(villagePO));
		}
		
		paging.setData(villageVOs);
	}
	
	@Override
	public List<VillageVO> queryVillage(List<FilterVO> filters){
		
		List<VillagePO> villagePOs = villageDao.queryVillage(filters);
		List<VillageVO> villageVOs = new ArrayList<VillageVO>();
		
		for(VillagePO villagePO: villagePOs){
			villageVOs.add(covertBean(villagePO));
		}
		
		return villageVOs;
	}

	@Override
	public VillageVO queryVillageById(VillageVO villageVO){

		VillagePO villagePO = villageDao.get(villageVO.getVillageId());
		
		if(villagePO != null){
			villageVO = covertBean(villagePO);
		}

		return villageVO;
	}
	
	@Override
	public List<VillageVO> queryVillageForNameByPinyin(String pinyinName){
		
		Paging paging = new Paging(0, 20);
		
		List<VillageVO> villageVOs = new ArrayList<VillageVO>();
		List<VillagePO> villagePOs = villageDao.queryVillagesName(paging, pinyinName);
		
		for(VillagePO villagePO: villagePOs){
			villageVOs.add(covertBean(villagePO));
		}

		return villageVOs;
	}

	public VillageVO covertBean(VillagePO villagePO){
		VillageVO villageVO = new VillageVO();
		
		BeanUtil.copyProperties(villagePO, villageVO, Arrays.asList("cityProper", "buildingNameRule"));
		
		villageVO.setCityProper(new CityProperVO());
		villageVO.setBuildingNameRule(new BuildingNameRuleVO());
		BeanUtil.copyProperties(villagePO.getBuildingNameRule(), villageVO.getBuildingNameRule());
		BeanUtil.copyProperties(villagePO.getCityProper(), villageVO.getCityProper(), Arrays.asList("city"));
		
		villageVO.getCityProper().setCity(new CityVO());
		BeanUtil.copyProperties(villagePO.getCityProper().getCity(), villageVO.getCityProper().getCity(), Arrays.asList("region"));
		
		villageVO.getCityProper().getCity().setRegion(new RegionVO());
		BeanUtil.copyProperties(villagePO.getCityProper().getCity().getRegion(), villageVO.getCityProper().getCity().getRegion());

		return villageVO;
	}

}
