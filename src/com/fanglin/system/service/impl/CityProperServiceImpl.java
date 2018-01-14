/**
 * Title: CityProperServiceImpl
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

import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CityProperDao;
import com.fanglin.system.po.CityProperPO;
import com.fanglin.system.service.CityProperService;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cityProperService")
@Transactional(readOnly = true)
public class CityProperServiceImpl implements CityProperService {

	@Autowired
	private CityProperDao cityProperDao;
	
	@Override
	public void pageCityProper(Paging paging, List<Filter> filters){

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
	
	public CityProperVO covertBean(CityProperPO cityProperPO){
		CityProperVO cityProperVO = new CityProperVO();
		BeanUtil.copyProperties(cityProperPO, cityProperVO, Arrays.asList("city"));
		
		cityProperVO.setCity(new CityVO());
		BeanUtil.copyProperties(cityProperPO.getCity(), cityProperVO.getCity(), Arrays.asList("region"));
		
		cityProperVO.getCity().setRegion(new RegionVO());
		BeanUtil.copyProperties(cityProperPO.getCity().getRegion(), cityProperVO.getCity().getRegion());

		return cityProperVO;
	}

	@Override
	public List<CityProperVO> queryCityProperByName(CityProperVO cityProperVO) {
		
		List<CityProperPO> cityProperPOs = cityProperDao.pageCityProperByName(new Paging(0, 50), cityProperVO.getCityProperName());
		List<CityProperVO> cityProperVOs = new ArrayList<CityProperVO>();
		
		for(CityProperPO cityProperPO: cityProperPOs){
			cityProperVOs.add(covertBean(cityProperPO));
		}

		return cityProperVOs;
	}

}
