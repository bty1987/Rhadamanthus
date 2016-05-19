/**
 * Title: CityServiceImpl
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
import com.fanglin.system.dao.CityDao;
import com.fanglin.system.dao.CityProperDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.system.po.RegionPO;
import com.fanglin.system.service.CityService;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("citySercie")
@Transactional(readOnly = true)
public class CityServiceImpl implements CityService {

	@Autowired
	private CityDao cityDao;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private CityProperDao cityProperDao;
	
	@Override
	public void pageCity(Paging paging, List<FilterVO> filters){

		List<CityPO> cityPOs = cityDao.pageCity(paging, filters);
		List<CityVO> cityVOs = new ArrayList<CityVO>();
		
		for(CityPO cityPO: cityPOs){
			CityVO cityVO = new CityVO();
			BeanUtil.copyProperties(cityPO, cityVO, Arrays.asList("region"));
			
			cityVO.setRegion(new RegionVO());
			BeanUtil.copyProperties(cityPO.getRegion(), cityVO.getRegion());
			
			cityVOs.add(cityVO);
		}

		paging.setData(cityVOs);
	}
	
	@Override
	public List<CityVO> queryCity(){

		List<CityPO> cityPOs = cityDao.list();
		List<CityVO> cityVOs = new ArrayList<CityVO>();
		
		for(CityPO cityPO: cityPOs){
			CityVO cityVO = new CityVO();
			
			BeanUtil.copyProperties(cityPO, cityVO, Arrays.asList("region"));
			
			cityVO.setRegion(new RegionVO());
			BeanUtil.copyProperties(cityPO.getRegion(), cityVO.getRegion());
			
			cityVOs.add(cityVO);
		}

		return cityVOs;
	}
	
	public List<CityVO> queryCityByRegionId(CityVO cityVO){
		List<CityPO> cityPOs = cityDao.queryCityByRegionId(cityVO.getRegion().getRegionId());
		List<CityVO> cityVOs = new ArrayList<CityVO>();
		
		for(CityPO cityPO: cityPOs){
			CityVO _cityVO = new CityVO();
			
			BeanUtil.copyProperties(cityPO, _cityVO, Arrays.asList("region"));
			
			_cityVO.setRegion(new RegionVO());
			BeanUtil.copyProperties(cityPO.getRegion(), _cityVO.getRegion());
			
			cityVOs.add(_cityVO);
		}

		return cityVOs;
	}
	
	@Override
	public CityVO queryCityById(CityVO cityVO){

		CityPO cityPO = cityDao.get(cityVO.getCityId());
		
		if(cityPO != null){
			BeanUtil.copyProperties(cityPO, cityVO, Arrays.asList("region"));
			
			cityVO.setRegion(new RegionVO());
			BeanUtil.copyProperties(cityPO.getRegion(), cityVO.getRegion());
		}

		return cityVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addCity(CityVO cityVO){

		CityPO cityPO = new CityPO();
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CITY_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		
		StringBuffer cityId = new StringBuffer();
		cityId.append(SystemConfig.getString("companyIdent", ""));
		cityId.append(SystemConfig.getString("cityIdent", "C_"));
		cityId.append(FormatUtil.fillZero(count, "00"));
		
		cityPO.setCityId(cityId.toString());
		
		BeanUtil.copyProperties(cityVO, cityPO, Arrays.asList("cityId", "region"));
		
		cityPO.setRegion(new RegionPO(cityVO.getRegion().getRegionId()));
		BeanUtil.copyProperties(cityVO.getRegion(), cityPO.getRegion());
		
		cityDao.saveOrUpdate(cityPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCity(CityVO cityVO){

		CityPO cityPO = cityDao.get(cityVO.getCityId());
		
		BeanUtil.copyProperties(cityVO, cityPO, Arrays.asList("cityId", "region"));
		
		cityPO.setRegion(new RegionPO(cityVO.getRegion().getRegionId()));
		BeanUtil.copyProperties(cityVO.getRegion(), cityPO.getRegion());
		
		cityDao.saveOrUpdate(cityPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCityById(CityVO cityVO){

		cityDao.deleteById(cityVO.getCityId());
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public String deleteCityByIds(List<String> cityIds){

		String quotedCity = "";
		for(String id: cityIds){
			List<CityProperPO> cityProperList = cityProperDao.queryCityProperByCityId(id);
			
			if(cityProperList.size() != 0){
				quotedCity += id + ",";
			}
		}
		
		if(quotedCity.equals("")){
			for(String id: cityIds){
				deleteCityById(new CityVO(id));
			}
		}else{
			quotedCity = quotedCity.substring(0, quotedCity.length()-1);
		}
		
		return quotedCity;
	}

}
