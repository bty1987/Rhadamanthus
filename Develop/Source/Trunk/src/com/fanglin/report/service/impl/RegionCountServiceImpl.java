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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.dao.RegionCountDao;
import com.fanglin.report.dao.RegionCountDetailDao;
import com.fanglin.report.po.RegionCountDetailPO;
import com.fanglin.report.po.RegionCountPO;
import com.fanglin.report.service.RegionCountService;
import com.fanglin.report.vo.RegionCountDetailVO;
import com.fanglin.report.vo.RegionCountVO;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("regionCountService")
@Transactional(readOnly=true)
public class RegionCountServiceImpl implements RegionCountService {
	
	@Autowired
	private RegionCountDao regionCountDao;
	
	@Autowired
	private RegionCountDetailDao regionCountDetailDao;

	@Override
	public void pageRegionCountDetail(Paging paging, List<FilterVO> filters) {
		
		List<RegionCountDetailPO> regionCountDetailPOs = regionCountDetailDao.pageRegionCountDetail(paging, filters);
		List<RegionCountDetailVO> regionCountDetailVOs = new ArrayList<RegionCountDetailVO>();
		
		RegionCountDetailVO regionCountDetailVO;
		
		for(RegionCountDetailPO regionCountDetailPO: regionCountDetailPOs){
			
			regionCountDetailVO = new RegionCountDetailVO();
			
			BeanUtil.copyProperties(regionCountDetailPO, regionCountDetailVO);
			
			regionCountDetailVOs.add(regionCountDetailVO);
		}

		paging.setData(regionCountDetailVOs);
	}

	@Override
	public List<RegionCountVO> queryRegionCount() {
		
		List<RegionCountPO> regionCountPOs = regionCountDao.queryRegionCount();
		List<RegionCountVO> regionCountVOs = new ArrayList<RegionCountVO>();
		
		RegionCountVO regionCountVO;
		
		for(RegionCountPO regionCountPO: regionCountPOs){
			
			regionCountVO = new RegionCountVO(new RegionVO());
			
			BeanUtil.copyProperties(regionCountPO, regionCountVO, Arrays.asList("region"));
			BeanUtil.copyProperties(regionCountPO.getRegion(), regionCountVO.getRegion());
			
			regionCountVOs.add(regionCountVO);
		}
		
		return regionCountVOs;
	}

	@Override
	public List<RegionCountDetailVO> queryRegionCountDetail(List<FilterVO> filters) {
		
		List<RegionCountDetailPO> regionCountDetailPOs = regionCountDetailDao.queryRegionCountDetail(filters);
		List<RegionCountDetailVO> regionCountDetailVOs = new ArrayList<RegionCountDetailVO>();
		
		RegionCountDetailVO regionCountDetailVO;
		
		for(RegionCountDetailPO regionCountDetailPO: regionCountDetailPOs){
			
			regionCountDetailVO = new RegionCountDetailVO();
			
			BeanUtil.copyProperties(regionCountDetailPO, regionCountDetailVO);
			
			regionCountDetailVOs.add(regionCountDetailVO);
		}
		
		return regionCountDetailVOs;
	}

}
