/**
 * @File Name		: CityProperCountServiceImpl.java
 * @Package   	: com.fanglin.report.service.impl
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.dao.CityProperCountDao;
import com.fanglin.report.dao.CityProperCountDetailDao;
import com.fanglin.report.po.CityProperCountDetailPO;
import com.fanglin.report.po.CityProperCountPO;
import com.fanglin.report.service.CityProperCountService;
import com.fanglin.report.vo.CityProperCountDetailVO;
import com.fanglin.report.vo.CityProperCountVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cityProperCountService")
@Transactional(readOnly=true)
public class CityProperCountServiceImpl implements CityProperCountService {
	
	@Autowired
	private CityProperCountDao cityProperCountDao;
	
	@Autowired
	private CityProperCountDetailDao cityProperCountDetailDao;

	@Override
	public void pageCityProperCountDetail(Paging paging, List<FilterVO> filters) {
		
		List<CityProperCountDetailPO> cityProperCountDetailPOs = cityProperCountDetailDao.pageCityProperCountDetail(paging, filters);
		List<CityProperCountDetailVO> cityProperCountDetailVOs = new ArrayList<CityProperCountDetailVO>();
		
		CityProperCountDetailVO cityProperCountDetailVO;
		
		for(CityProperCountDetailPO cityProperCountDetailPO: cityProperCountDetailPOs){
			
			cityProperCountDetailVO = new CityProperCountDetailVO();
			
			BeanUtil.copyProperties(cityProperCountDetailPO, cityProperCountDetailVO);
			
			cityProperCountDetailVOs.add(cityProperCountDetailVO);
		}

		paging.setData(cityProperCountDetailVOs);
	}

	@Override
	public List<CityProperCountVO> queryCityProperCount() {
		
		List<CityProperCountPO> cityProperCountPOs = cityProperCountDao.queryCityProperCount();
		List<CityProperCountVO> cityProperCountVOs = new ArrayList<CityProperCountVO>();
		
		CityProperCountVO cityProperCountVO;
		
		for(CityProperCountPO cityProperCountPO: cityProperCountPOs){
			
			cityProperCountVO = new CityProperCountVO(new CityProperVO());
			
			BeanUtil.copyProperties(cityProperCountPO, cityProperCountVO, Arrays.asList("cityProper"));
			BeanUtil.copyProperties(cityProperCountPO.getCityProper(), cityProperCountVO.getCityProper(), Arrays.asList("city"));
			
			cityProperCountVOs.add(cityProperCountVO);
		}
		
		return cityProperCountVOs;
	}

	@Override
	public List<CityProperCountDetailVO> queryCityProperCountDetail(List<FilterVO> filters) {
		
		List<CityProperCountDetailPO> cityProperCountDetailPOs = cityProperCountDetailDao.queryCityProperCountDetail(filters);
		List<CityProperCountDetailVO> cityProperCountDetailVOs = new ArrayList<CityProperCountDetailVO>();
		
		CityProperCountDetailVO cityProperCountDetailVO;
		
		for(CityProperCountDetailPO cityProperCountDetailPO: cityProperCountDetailPOs){
			
			cityProperCountDetailVO = new CityProperCountDetailVO();
			
			BeanUtil.copyProperties(cityProperCountDetailPO, cityProperCountDetailVO);
			
			cityProperCountDetailVOs.add(cityProperCountDetailVO);
		}
		
		return cityProperCountDetailVOs;
	}

}
