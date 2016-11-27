/**
 * @File Name		: CityCountServiceImpl.java
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

import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.dao.CityCountDetailDao;
import com.fanglin.report.po.CityCountDetailPO;
import com.fanglin.report.service.CityCountService;
import com.fanglin.report.vo.CityCountDetailVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("cityCountService")
@Transactional(readOnly=true)
public class CityCountServiceImpl implements CityCountService {
	
	@Autowired
	private CityCountDetailDao cityCountDetailDao;

	@Override
	public void pageCityCountDetail(Paging paging, List<FilterVO> filters) throws ParseException {
		
		List<CityCountDetailPO> cityCountDetailPOs = cityCountDetailDao.pageCityCountDetail(paging, filters);
		List<CityCountDetailVO> cityCountDetailVOs = new ArrayList<CityCountDetailVO>();
		
		CityCountDetailVO cityCountDetailVO;
		
		for(CityCountDetailPO cityCountDetailPO: cityCountDetailPOs){
			
			cityCountDetailVO = new CityCountDetailVO(new CityVO());
			
			BeanUtil.copyProperties(cityCountDetailPO, cityCountDetailVO, Arrays.asList("city"));
			BeanUtil.copyProperties(cityCountDetailPO.getCity(), cityCountDetailVO.getCity(), Arrays.asList("region"));
			
			cityCountDetailVOs.add(cityCountDetailVO);
		}

		paging.setData(cityCountDetailVOs);
	}

	@Override
	public List<CityCountDetailVO> queryCityCountDetail(List<FilterVO> filters) throws ParseException {
		
		List<CityCountDetailPO> cityCountDetailPOs = cityCountDetailDao.queryCityCountDetail(filters);
		List<CityCountDetailVO> cityCountDetailVOs = new ArrayList<CityCountDetailVO>();
		
		CityCountDetailVO cityCountDetailVO;
		
		for(CityCountDetailPO cityCountDetailPO: cityCountDetailPOs){
			
			cityCountDetailVO = new CityCountDetailVO(new CityVO());
			
			BeanUtil.copyProperties(cityCountDetailPO, cityCountDetailVO, Arrays.asList("city"));
			BeanUtil.copyProperties(cityCountDetailPO.getCity(), cityCountDetailVO.getCity(), Arrays.asList("region"));
			
			cityCountDetailVOs.add(cityCountDetailVO);
		}
		
		return cityCountDetailVOs;
	}

	@Override
	public List<CityCountDetailVO> queryCityCountDetailByCurrent(List<FilterVO> filters) throws ParseException {
		
		filters.add(new FilterVO(CityCountDetailPO.COLUMN_CREATEDATE_STR, DateUtil.getDateToDateString(new Date(), "yyyy-MM-dd"), "eq"));

		List<CityCountDetailPO> cityCountDetailPOs = cityCountDetailDao.queryCityCountDetail(filters);
		List<CityCountDetailVO> cityCountDetailVOs = new ArrayList<CityCountDetailVO>();
		
		CityCountDetailVO cityCountDetailVO;
		
		for(CityCountDetailPO cityCountDetailPO: cityCountDetailPOs){
			
			cityCountDetailVO = new CityCountDetailVO(new CityVO());
			
			BeanUtil.copyProperties(cityCountDetailPO, cityCountDetailVO, Arrays.asList("city"));
			BeanUtil.copyProperties(cityCountDetailPO.getCity(), cityCountDetailVO.getCity(), Arrays.asList("region"));
			
			cityCountDetailVOs.add(cityCountDetailVO);
		}
		
		return cityCountDetailVOs;
	}

}
