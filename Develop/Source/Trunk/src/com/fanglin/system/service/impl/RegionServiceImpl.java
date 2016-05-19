/**
 * @FileName	: RegionServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
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
import com.fanglin.system.dao.RegionDao;
import com.fanglin.system.po.CityPO;
import com.fanglin.system.po.RegionPO;
import com.fanglin.system.service.RegionService;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("regionSercie")
@Transactional(readOnly = true)
public class RegionServiceImpl implements RegionService {

	@Autowired
	private RegionDao regionDao;
	
	@Autowired
	private CityDao cityDao;
	
	@Autowired
	private CountingService countingService;
	
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
	@Transactional(rollbackFor=Exception.class)
	public void addRegion(RegionVO regionVO){

		RegionPO regionPO = new RegionPO();
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_REGION_INT, CountingPO.COUNTING_DATE_SILNLE_STR);
		
		StringBuffer regionId = new StringBuffer();
		regionId.append(SystemConfig.getString("companyIdent", ""));
		regionId.append(SystemConfig.getString("regionIdent", "A_"));
		regionId.append(FormatUtil.fillZero(count, "00"));
		
		regionPO.setRegionId(regionId.toString());
		
		BeanUtil.copyProperties(regionVO, regionPO, new String[]{"regionId"});
		
		regionDao.saveOrUpdate(regionPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateRegion(RegionVO regionVO){

		RegionPO regionPO = regionDao.get(regionVO.getRegionId());
		BeanUtil.copyProperties(regionVO, regionPO, Arrays.asList("rId", "regionId"));
		
		regionDao.saveOrUpdate(regionPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public String deleteRegion(List<String> regionIds){

		String quotedRegion = "";
		
		for(String id: regionIds){
			List<CityPO> cityPOs = cityDao.queryCityByRegionId(id);
			
			if(cityPOs.size() != 0)
				quotedRegion += id + ",";
		}
		
		if(quotedRegion.equals("")){
			for(String id: regionIds)
				deleteRegionById(id);
		}else{
			quotedRegion = quotedRegion.substring(0, quotedRegion.length() - 1);
		}
		
		return quotedRegion;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteRegionById(String regionId){
		
		regionDao.deleteById(regionId);
	}

}
