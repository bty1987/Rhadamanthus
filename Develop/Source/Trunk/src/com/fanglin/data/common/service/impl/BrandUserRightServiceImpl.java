/**
 * @File Name		: MaterialBrandRightServiceImpl.java
 * @Package   	: com.fanglin.service.materialOrder.impl
 * @Version		: 1.0
 * @Date			: 2015-3-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.dao.BrandUserRightDao;
import com.fanglin.data.common.service.BrandUserRightService;
import com.fanglin.data.common.vo.BrandUserRightVO;
import com.fanglin.data.common.vo.BrandVO;
import com.fanglin.data.po.BrandPO;
import com.fanglin.data.po.BrandUserRightPO;
import com.fanglin.utils.BeanUtil;

@Service("brandUserRightService")
@Transactional(readOnly = true)
public class BrandUserRightServiceImpl implements BrandUserRightService {
	
	@Autowired
	private BrandUserRightDao brandUserRightDao;
	
	@Override
	public List<BrandUserRightVO> queryBrandUserRightForUserId(BrandUserRightVO brandUserRightVO) {
		
		List<BrandUserRightPO> brandUserRightPOs = brandUserRightDao.queryBrandUserRightByUserId(brandUserRightVO.getUserId());
		List<BrandUserRightVO> brandUserRightVOs = new ArrayList<BrandUserRightVO>();
		
		for(BrandUserRightPO brandUserRightPO: brandUserRightPOs){
			
			brandUserRightVO = new BrandUserRightVO(new BrandVO());
			
			BeanUtil.copyProperties(brandUserRightPO, brandUserRightVO, "brand");
			BeanUtil.copyProperties(brandUserRightPO.getBrand(), brandUserRightVO.getBrand());
			BeanUtil.copyProperties(brandUserRightPO.getBrand().getCategory(), brandUserRightVO.getBrand());
			
			brandUserRightVOs.add(brandUserRightVO);
		}
		
		return brandUserRightVOs;
	}

	@Override
	public List<BrandUserRightVO> queryBrandUserRightForLogin(String userId) {
		
		List<BrandUserRightPO> brandUserRightPOs = brandUserRightDao.queryBrandUserRightByUserId(userId);
	
		List<BrandUserRightVO> brandUserRightVOs = new ArrayList<BrandUserRightVO>();
		
		BrandUserRightVO brandUserRightVO;
		
		for(BrandUserRightPO brandUserRightPO: brandUserRightPOs){
			
			brandUserRightVO = new BrandUserRightVO(new BrandVO());
			
			BeanUtil.copyProperties(brandUserRightPO, brandUserRightVO, "brand");
			BeanUtil.copyProperties(brandUserRightPO.getBrand(), brandUserRightVO.getBrand());
			BeanUtil.copyProperties(brandUserRightPO.getBrand().getCategory(), brandUserRightVO.getBrand());
			
			brandUserRightVOs.add(brandUserRightVO);
		}
		
		return brandUserRightVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateBrandUserRight(BrandUserRightVO brandUserRightVO, List<Long> bids) {
		
		String userId = brandUserRightVO.getUserId();
		
		brandUserRightDao.deleteBrandUserRightByUserId(userId);
		
		BrandUserRightPO brandUserRightPO;

		if(bids != null && bids.size() > 0){
			for(long bid: bids){
				brandUserRightPO = new BrandUserRightPO(userId, new BrandPO(bid));
				
				brandUserRightDao.update(brandUserRightPO);
			}
		}
	}

}
