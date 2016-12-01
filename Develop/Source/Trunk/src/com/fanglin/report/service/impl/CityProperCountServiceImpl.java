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

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.CityProperCountDetailDao;
import com.fanglin.report.po.CityProperCountDetailPO;
import com.fanglin.report.service.CityProperCountService;
import com.fanglin.report.vo.CityProperCountDetailVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("cityProperCountService")
@Transactional(readOnly=true)
public class CityProperCountServiceImpl implements CityProperCountService {
	
	@Autowired
	private CityProperCountDetailDao cityProperCountDetailDao;

	@Override
	public void pageCityProperCountDetail(Paging paging, List<Filter> filters) throws ParseException {
		
		List<CityProperCountDetailPO> cityProperCountDetailPOs = cityProperCountDetailDao.pageCityProperCountDetail(paging, filters);
		List<CityProperCountDetailVO> cityProperCountDetailVOs = new ArrayList<CityProperCountDetailVO>();
		
		CityProperCountDetailVO cityProperCountDetailVO;
		
		for(CityProperCountDetailPO cityProperCountDetailPO: cityProperCountDetailPOs){
			
			cityProperCountDetailVO = new CityProperCountDetailVO(new CityProperVO());
			
			BeanUtil.copyProperties(cityProperCountDetailPO, cityProperCountDetailVO, Arrays.asList("cityProper"));
			BeanUtil.copyProperties(cityProperCountDetailPO.getCityProper(), cityProperCountDetailVO.getCityProper(), Arrays.asList("city"));
			
			cityProperCountDetailVOs.add(cityProperCountDetailVO);
		}

		paging.setData(cityProperCountDetailVOs);
	}

	@Override
	public List<CityProperCountDetailVO> queryCityProperCountDetail(List<Filter> filters) throws ParseException {
		
		List<CityProperCountDetailPO> cityProperCountDetailPOs = cityProperCountDetailDao.queryCityProperCountDetail(filters);
		List<CityProperCountDetailVO> cityProperCountDetailVOs = new ArrayList<CityProperCountDetailVO>();
		
		CityProperCountDetailVO cityProperCountDetailVO;
		
		for(CityProperCountDetailPO cityProperCountDetailPO: cityProperCountDetailPOs){
			
			cityProperCountDetailVO = new CityProperCountDetailVO(new CityProperVO());
			
			BeanUtil.copyProperties(cityProperCountDetailPO, cityProperCountDetailVO, Arrays.asList("cityProper"));
			BeanUtil.copyProperties(cityProperCountDetailPO.getCityProper(), cityProperCountDetailVO.getCityProper(), Arrays.asList("city"));
			
			cityProperCountDetailVOs.add(cityProperCountDetailVO);
		}
		
		return cityProperCountDetailVOs;
	}

	@Override
	public List<CityProperCountDetailVO> queryCityProperCountDetailByCurrent(List<Filter> filters) throws ParseException {
		
		filters.add(new Filter(CityProperCountDetailPO.COLUMN_CREATEDATE_STR, DateUtil.getDateToDateString(new Date(), "yyyy-MM-dd"), "eq"));

		List<CityProperCountDetailPO> cityProperCountDetailPOs = cityProperCountDetailDao.queryCityProperCountDetail(filters);
		List<CityProperCountDetailVO> cityProperCountDetailVOs = new ArrayList<CityProperCountDetailVO>();
		
		CityProperCountDetailVO cityProperCountDetailVO;
		
		for(CityProperCountDetailPO cityProperCountDetailPO: cityProperCountDetailPOs){
			
			cityProperCountDetailVO = new CityProperCountDetailVO(new CityProperVO());
			
			BeanUtil.copyProperties(cityProperCountDetailPO, cityProperCountDetailVO, Arrays.asList("cityProper"));
			BeanUtil.copyProperties(cityProperCountDetailPO.getCityProper(), cityProperCountDetailVO.getCityProper(), Arrays.asList("city"));
			
			cityProperCountDetailVOs.add(cityProperCountDetailVO);
		}
		
		return cityProperCountDetailVOs;
	}

}
