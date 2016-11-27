/**
 * @FileName	: RegionServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */
package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.RegionDao;
import com.fanglin.system.po.RegionPO;
import com.fanglin.system.service.RegionService;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("regionSercie")
@Transactional(readOnly = true)
public class RegionServiceImpl implements RegionService {

	@Autowired
	private RegionDao regionDao;
	
	@Override
	public void pageRegion(Paging paging, List<FilterVO> filters){

		List<RegionPO> regionPOs = regionDao.pageRegion(paging, filters);
		List<RegionVO> regionVOs = new ArrayList<RegionVO>();
		
		for(RegionPO regionPO: regionPOs){
			RegionVO regionVO = new RegionVO();
			BeanUtil.copyProperties(regionPO, regionVO);
			
			regionVOs.add(regionVO);
		}

		paging.setData(regionVOs);
	}
	
	@Override
	public List<RegionVO> queryRegion(){

		List<RegionPO> regionPOs = regionDao.queryRegion();
		List<RegionVO> regionVOs = new ArrayList<RegionVO>();
		
		for(RegionPO regionPO: regionPOs){
			RegionVO regionVO = new RegionVO();
			BeanUtil.copyProperties(regionPO, regionVO);
			
			regionVOs.add(regionVO);
		}

		return regionVOs;
	}
	
	@Override
	public RegionVO queryRegionById(RegionVO regionVO){

		RegionPO regionPO = regionDao.get(regionVO.getRegionId());
		
		if(regionPO != null){
			regionVO = new RegionVO();
			BeanUtil.copyProperties(regionPO, regionVO);
		}

		return regionVO;
	}

	@Override
	public List<RegionVO> queryRegionByName(RegionVO regionVO) {
		
		List<RegionPO> regionPOs = regionDao.pageRegionByName(new Paging(0, 50), regionVO.getRegionName());
		List<RegionVO> regionVOs = new ArrayList<RegionVO>();
		
		for(RegionPO regionPO: regionPOs){
			regionVO = new RegionVO();
			BeanUtil.copyProperties(regionPO, regionVO);
			
			regionVOs.add(regionVO);
		}

		return regionVOs;
	}

}
