/**
 * Title: CityProperServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.dao.VillageDao;
import com.fanglin.system.dao.CityProperDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.system.service.CityProperService;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("cityProperService")
@Transactional(readOnly = true)
public class CityProperServiceImpl implements CityProperService {

	@Autowired
	private CityProperDao cityProperDao;
	
	@Autowired
	private VillageDao villageDao;
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageCityProper(Paging paging, List<FilterVO> filters){

		List<CityProperPO> cityProperPOs = cityProperDao.pageCityProper(paging, filters);
		List<CityProperVO> cityProperVOs = new ArrayList<CityProperVO>();
		
		for(CityProperPO cityProperPO: cityProperPOs){
			cityProperVOs.add(covertBean(cityProperPO));
		}
		
		paging.setData(cityProperVOs);
	}
	
	@Override
	public List<CityProperVO> queryCityProper(){

		List<CityProperPO> cityProperPOs = cityProperDao.list();
		List<CityProperVO> cityProperVOs = new ArrayList<CityProperVO>();
		
		for(CityProperPO cityProperPO: cityProperPOs){
			cityProperVOs.add(covertBean(cityProperPO));
		}
		
		return cityProperVOs;
	}

	@Override
	public CityProperVO queryCityProperById(CityProperVO cityProperVO){
		
		CityProperPO cityProperPO = cityProperDao.get(cityProperVO.getCityProperId());
		
		if(cityProperPO != null){
			cityProperVO = covertBean(cityProperPO);
		}
		
		return cityProperVO;
	}
	
	@Override
	public List<CityProperVO> queryCityProperByCityId(CityProperVO cityProperVO){
		List<CityProperPO> cityProperPOs = cityProperDao.queryCityProperByCityId(cityProperVO.getCity().getCityId());
		List<CityProperVO> cityProperVOs = new ArrayList<CityProperVO>();
		
		for(CityProperPO cityProperPO: cityProperPOs){
			cityProperVOs.add(covertBean(cityProperPO));
		}

		return cityProperVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateCityProper(CityProperVO cityProperVO){
		CityProperPO cityProperPO = null;
		
		if(cityProperVO.getCityProperId() != null){
			cityProperPO = cityProperDao.get(cityProperVO.getCityProperId());
		}
		
		if(cityProperPO == null){
			cityProperPO = new CityProperPO();
			
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CITY_PROPER_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
			
			StringBuffer cityProperId = new StringBuffer();
			cityProperId.append(SystemConfig.getString("companyIdent", ""));
			cityProperId.append(SystemConfig.getString("cityProperIdent", "R_"));
			cityProperId.append(FormatUtil.fillZero(count, "00"));
			
			cityProperPO.setCityProperId(cityProperId.toString());
		}
		
		BeanUtil.copyProperties(cityProperVO, cityProperPO, Arrays.asList("cityProperId", "city"));
		
		cityProperPO.setCity(new CityPO());
		BeanUtil.copyProperties(cityProperVO.getCity(), cityProperPO.getCity(), Arrays.asList("region"));
		
		cityProperDao.saveOrUpdate(cityProperPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public String deleteCityProper(List<String> ids){
		String quotedCityProper = "";
		
		for(String id: ids){
			int count = villageDao.countVillageByCityProperId(id);
			
			if(count != 0){
				quotedCityProper += id + ",";
			}
		}
		
		if(quotedCityProper.equals("")){
			for(String id: ids){
				deleteCityProperById(id);
			}
		}else{
			quotedCityProper = quotedCityProper.substring(0, quotedCityProper.length() - 1);
		}
		
		return quotedCityProper;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCityProperById(String id){
		cityProperDao.deleteById(id);
	}
	
	public CityProperVO covertBean(CityProperPO cityProperPO){
		CityProperVO cityProperVO = new CityProperVO();
		BeanUtil.copyProperties(cityProperPO, cityProperVO, Arrays.asList("city"));
		
		cityProperVO.setCity(new CityVO());
		BeanUtil.copyProperties(cityProperPO.getCity(), cityProperVO.getCity(), Arrays.asList("region"));
		
		cityProperVO.getCity().setRegion(new RegionVO());
		BeanUtil.copyProperties(cityProperPO.getCity().getRegion(), cityProperVO.getCity().getRegion());

		return cityProperVO;
	}

}
