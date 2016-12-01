/**
 * @File Name		: RegionCountServiceImpl.java
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
import com.fanglin.report.dao.RegionCountDetailDao;
import com.fanglin.report.po.RegionCountDetailPO;
import com.fanglin.report.service.RegionCountService;
import com.fanglin.report.vo.RegionCountDetailVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("regionCountService")
@Transactional(readOnly=true)
public class RegionCountServiceImpl implements RegionCountService {
	
	@Autowired
	private RegionCountDetailDao regionCountDetailDao;

	@Override
	public void pageRegionCountDetail(Paging paging, List<Filter> filters) throws ParseException {
		
		List<RegionCountDetailPO> regionCountDetailPOs = regionCountDetailDao.pageRegionCountDetail(paging, filters);
		List<RegionCountDetailVO> regionCountDetailVOs = new ArrayList<RegionCountDetailVO>();
		
		RegionCountDetailVO regionCountDetailVO;
		
		for(RegionCountDetailPO regionCountDetailPO: regionCountDetailPOs){
			
			regionCountDetailVO = new RegionCountDetailVO(new RegionVO());
			
			BeanUtil.copyProperties(regionCountDetailPO, regionCountDetailVO, Arrays.asList("region"));
			BeanUtil.copyProperties(regionCountDetailPO.getRegion(), regionCountDetailVO.getRegion());
			
			regionCountDetailVOs.add(regionCountDetailVO);
		}

		paging.setData(regionCountDetailVOs);
	}

	@Override
	public List<RegionCountDetailVO> queryRegionCountDetail(List<Filter> filters) throws ParseException{
		
		List<RegionCountDetailPO> regionCountDetailPOs = regionCountDetailDao.queryRegionCountDetail(filters);
		List<RegionCountDetailVO> regionCountDetailVOs = new ArrayList<RegionCountDetailVO>();
		
		RegionCountDetailVO regionCountDetailVO;
		
		for(RegionCountDetailPO regionCountDetailPO: regionCountDetailPOs){
			
			regionCountDetailVO = new RegionCountDetailVO(new RegionVO());
			
			BeanUtil.copyProperties(regionCountDetailPO, regionCountDetailVO, Arrays.asList("region"));
			BeanUtil.copyProperties(regionCountDetailPO.getRegion(), regionCountDetailVO.getRegion());
			
			regionCountDetailVOs.add(regionCountDetailVO);
		}
		
		return regionCountDetailVOs;
	}

	@Override
	public List<RegionCountDetailVO> queryRegionCountDetailForCurrent(List<Filter> filters) throws ParseException {
		
		filters.add(new Filter(RegionCountDetailPO.COLUMN_CREATEDATE_STR, DateUtil.getDateToDateString(new Date(), "yyyy-MM-dd"), "eq"));
		
		List<RegionCountDetailPO> regionCountDetailPOs = regionCountDetailDao.queryRegionCountDetail(filters);
		List<RegionCountDetailVO> regionCountDetailVOs = new ArrayList<RegionCountDetailVO>();
		
		RegionCountDetailVO regionCountDetailVO;
		
		for(RegionCountDetailPO regionCountDetailPO: regionCountDetailPOs){
			
			regionCountDetailVO = new RegionCountDetailVO(new RegionVO());
			
			BeanUtil.copyProperties(regionCountDetailPO, regionCountDetailVO, Arrays.asList("region"));
			BeanUtil.copyProperties(regionCountDetailPO.getRegion(), regionCountDetailVO.getRegion());
			
			regionCountDetailVOs.add(regionCountDetailVO);
		}
		
		return regionCountDetailVOs;
	}

}
