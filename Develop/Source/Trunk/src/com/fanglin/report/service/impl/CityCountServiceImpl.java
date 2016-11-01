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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.dao.CityCountDao;
import com.fanglin.report.dao.CityCountDetailDao;
import com.fanglin.report.po.CityCountDetailPO;
import com.fanglin.report.po.CityCountPO;
import com.fanglin.report.service.CityCountService;
import com.fanglin.report.vo.CityCountDetailVO;
import com.fanglin.report.vo.CityCountVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cityCountService")
@Transactional(readOnly=true)
public class CityCountServiceImpl implements CityCountService {
	
	@Autowired
	private CityCountDao cityCountDao;
	
	@Autowired
	private CityCountDetailDao cityCountDetailDao;

	@Override
	public void pageCityCountDetail(Paging paging, List<FilterVO> filters) {
		
		List<CityCountDetailPO> cityCountDetailPOs = cityCountDetailDao.pageCityCountDetail(paging, filters);
		List<CityCountDetailVO> cityCountDetailVOs = new ArrayList<CityCountDetailVO>();
		
		CityCountDetailVO cityCountDetailVO;
		
		for(CityCountDetailPO cityCountDetailPO: cityCountDetailPOs){
			
			cityCountDetailVO = new CityCountDetailVO();
			
			BeanUtil.copyProperties(cityCountDetailPO, cityCountDetailVO);
			
			cityCountDetailVOs.add(cityCountDetailVO);
		}

		paging.setData(cityCountDetailVOs);
	}

	@Override
	public List<CityCountVO> queryCityCount() {
		
		List<CityCountPO> cityCountPOs = cityCountDao.queryCityCount();
		List<CityCountVO> cityCountVOs = new ArrayList<CityCountVO>();
		
		CityCountVO cityCountVO;
		
		for(CityCountPO cityCountPO: cityCountPOs){
			
			cityCountVO = new CityCountVO(new CityVO());
			
			BeanUtil.copyProperties(cityCountPO, cityCountVO, Arrays.asList("city"));
			BeanUtil.copyProperties(cityCountPO.getCity(), cityCountVO.getCity(), Arrays.asList("region"));
			
			cityCountVOs.add(cityCountVO);
		}
		
		return cityCountVOs;
	}

	@Override
	public List<CityCountDetailVO> queryCityCountDetail(List<FilterVO> filters) {
		
		List<CityCountDetailPO> cityCountDetailPOs = cityCountDetailDao.queryCityCountDetail(filters);
		List<CityCountDetailVO> cityCountDetailVOs = new ArrayList<CityCountDetailVO>();
		
		CityCountDetailVO cityCountDetailVO;
		
		for(CityCountDetailPO cityCountDetailPO: cityCountDetailPOs){
			
			cityCountDetailVO = new CityCountDetailVO();
			
			BeanUtil.copyProperties(cityCountDetailPO, cityCountDetailVO);
			
			cityCountDetailVOs.add(cityCountDetailVO);
		}
		
		return cityCountDetailVOs;
	}

}
