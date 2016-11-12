/**
 * @File Name		: VillageCountServiceImpl.java
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
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.report.dao.VillageCountDao;
import com.fanglin.report.dao.VillageCountDetailDao;
import com.fanglin.report.po.VillageCountDetailPO;
import com.fanglin.report.po.VillageCountPO;
import com.fanglin.report.service.VillageCountService;
import com.fanglin.report.vo.VillageCountDetailVO;
import com.fanglin.report.vo.VillageCountVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("villageCountService")
@Transactional(readOnly=true)
public class VillageCountServiceImpl implements VillageCountService {
	
	@Autowired
	private VillageCountDao villageCountDao;
	
	@Autowired
	private VillageCountDetailDao villageCountDetailDao;

	@Override
	public void pageVillageCountDetail(Paging paging, List<FilterVO> filters) {
		
		List<VillageCountDetailPO> villageCountDetailPOs = villageCountDetailDao.pageVillageCountDetail(paging, filters);
		List<VillageCountDetailVO> villageCountDetailVOs = new ArrayList<VillageCountDetailVO>();
		
		VillageCountDetailVO villageCountDetailVO;
		
		for(VillageCountDetailPO villageCountDetailPO: villageCountDetailPOs){
			
			villageCountDetailVO = new VillageCountDetailVO();
			
			BeanUtil.copyProperties(villageCountDetailPO, villageCountDetailVO);
			
			villageCountDetailVOs.add(villageCountDetailVO);
		}

		paging.setData(villageCountDetailVOs);
	}

	@Override
	public List<VillageCountVO> queryVillageCountByXY(VillageVO villageVO, double range) {
		
		List<VillageCountPO> villageCountPOs = villageCountDao.queryVillageCountByXY(villageVO.getX(), villageVO.getY(), range);
		List<VillageCountVO> villageCountVOs = new ArrayList<VillageCountVO>();
		
		VillageCountVO villageCountVO;
		
		for(VillageCountPO villageCountPO: villageCountPOs){
			
			villageCountVO = new VillageCountVO(new VillageVO());
			
			BeanUtil.copyProperties(villageCountPO, villageCountVO, Arrays.asList("village"));
			BeanUtil.copyProperties(villageCountPO.getVillage(), villageCountVO.getVillage(), Arrays.asList("cityProper", "buildingNameRule"));
			
			villageCountVOs.add(villageCountVO);
		}
		
		return villageCountVOs;
	}

	@Override
	public List<VillageCountDetailVO> queryVillageCountDetails(List<FilterVO> filters) {
		
		List<VillageCountDetailPO> villageCountDetailPOs = villageCountDetailDao.queryVillageCountDetail(filters);
		List<VillageCountDetailVO> villageCountDetailVOs = new ArrayList<VillageCountDetailVO>();
		
		VillageCountDetailVO villageCountDetailVO;
		
		for(VillageCountDetailPO villageCountDetailPO: villageCountDetailPOs){
			
			villageCountDetailVO = new VillageCountDetailVO();
			
			BeanUtil.copyProperties(villageCountDetailPO, villageCountDetailVO);
			
			villageCountDetailVOs.add(villageCountDetailVO);
		}
		
		return villageCountDetailVOs;
	}

}
