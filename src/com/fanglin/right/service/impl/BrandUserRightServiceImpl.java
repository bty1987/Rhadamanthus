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

package com.fanglin.right.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.vo.BrandVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.right.dao.BrandUserRightDao;
import com.fanglin.right.po.BrandUserRightPO;
import com.fanglin.right.service.BrandUserRightService;
import com.fanglin.right.vo.BrandUserRightVO;
import com.fanglin.utils.BeanUtil;

@Service("brandUserRightService")
@Transactional(readOnly = true)
public class BrandUserRightServiceImpl implements BrandUserRightService {
	
	@Autowired
	private BrandUserRightDao brandUserRightDao;
	
	@Autowired
	private BrandDao brandDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public BrandUserRightVO queryBrandUserRightByUid(BrandUserRightVO brandUserRightVO) {
		
		List<BrandUserRightPO> brandUserRightPOs = brandUserRightDao.queryBrandUserRightByUid(brandUserRightVO.getUid());
		
		List<BrandVO> brandVOs = new ArrayList<BrandVO>();
		
		for(BrandUserRightPO brandUserRightPO : brandUserRightPOs){
			
			BrandPO brandPO = brandDao.queryBrandByBid(brandUserRightPO.getBrand().getBid());
			
			BrandVO brandVO = new BrandVO();
			
			BeanUtil.copyProperties(brandPO, brandVO,Arrays.asList("category", "supplier"));
			brandVO.setCategoryId(brandPO.getCategory().getNo());
			brandVO.setCategoryName(brandPO.getCategory().getName());
			brandVO.setCid(brandPO.getCategory().getCid());
			
			brandVOs.add(brandVO);
		}
		
		brandUserRightVO.setBrands(brandVOs);
		
		return brandUserRightVO;
	}
	
	@Override
	public BrandUserRightVO queryBrandUserRightForLogin(String userId) {
		
		UserPO user = userDao.queryUserByUserId(userId);
		
		List<BrandUserRightPO> brandUserRightPOs = brandUserRightDao.queryBrandUserRightByUid(user.getUid());
		
		BrandUserRightVO brandUserRightVO = new BrandUserRightVO();
		
		List<BrandVO> brandVOs = new ArrayList<BrandVO>();
		
		for(BrandUserRightPO brandUserRightPO : brandUserRightPOs){
			
			BrandPO brandPO = brandDao.queryBrandByBid(brandUserRightPO.getBrand().getBid());
			
			BrandVO brandVO = new BrandVO();
			
			BeanUtil.copyProperties(brandPO, brandVO,Arrays.asList("category", "supplier"));
			brandVO.setCategoryId(brandPO.getCategory().getNo());
			brandVO.setCategoryName(brandPO.getCategory().getName());
			brandVO.setCid(brandPO.getCategory().getCid());
			
			brandVOs.add(brandVO);
		}
		
		brandUserRightVO.setBrands(brandVOs);
		
		return brandUserRightVO;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateBrandUserRight(BrandUserRightVO brandUserRightVO, List<Long> bids) {
		
		brandUserRightDao.deleteBrandUserRightByUid(brandUserRightVO.getUid());
		
		if(bids != null && bids.size() > 0){
			for (Long bid : bids) {
				BrandUserRightPO brandUserRightPO = new BrandUserRightPO();

				brandUserRightPO.setUid(brandUserRightVO.getUid());
				brandUserRightPO.setBrand(new BrandPO(bid));

				brandUserRightDao.save(brandUserRightPO);
			}
		}
		
	}

}
