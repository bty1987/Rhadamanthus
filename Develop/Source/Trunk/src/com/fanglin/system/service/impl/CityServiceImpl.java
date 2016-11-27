/**
 * Title: CityServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.CityDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.system.service.CityService;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cityService")
@Transactional(readOnly = true)
public class CityServiceImpl implements CityService {

	@Autowired
	private CityDao cityDao;
	
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
	public void pageCityByName(Paging paging, CityVO cityVO) {
		
		List<CityPO> cityPOs = cityDao.pageCityByName(paging, cityVO.getCityName());
		List<CityVO> cityVOs = new ArrayList<CityVO>();
		
		for(CityPO cityPO: cityPOs){
			cityVO = new CityVO();
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

}
