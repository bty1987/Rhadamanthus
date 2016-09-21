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

package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.common.dao.BrandDao;
import com.fanglin.data.common.vo.BrandVO;
import com.fanglin.data.material.dao.MaterialBrandRightDao;
import com.fanglin.data.material.service.MaterialBrandRightService;
import com.fanglin.data.material.vo.MaterialBrandRightVO;
import com.fanglin.data.po.BrandPO;
import com.fanglin.data.po.MaterialBrandRightPO;
import com.fanglin.utils.BeanUtil;

@Service("materialBrandRightService")
@Transactional(readOnly = true)
public class MaterialBrandRightServiceImpl implements MaterialBrandRightService {
	
	@Autowired
	private MaterialBrandRightDao materialBrandRightDao;
	
	@Autowired
	private BrandDao brandDao;

	@Override
	public MaterialBrandRightVO queryMaterialBrandRightByUserId(MaterialBrandRightVO materialBrandRightVO){
		
		String userId = materialBrandRightVO.getUserId();
		
		MaterialBrandRightPO materialBrandRightPO = materialBrandRightDao.querymateriBrandRightByUserId(userId);
		
		if(materialBrandRightPO == null){
			materialBrandRightVO.setUserId(userId);
			materialBrandRightVO.setBrandId("");
		}else{
			BeanUtil.copyProperties(materialBrandRightPO, materialBrandRightVO, Arrays.asList("brands"));
			
			if(!"".equals(materialBrandRightPO.getBrandId())){
				
				List<BrandPO> brandPOs = brandDao.queryBrandByBrandIds(Arrays.asList(materialBrandRightPO.getBrandId().split("#")));
				List<BrandVO> brandVOs = new ArrayList<BrandVO>();
				
				for(BrandPO brandPO: brandPOs){
					BrandVO brandVO = new BrandVO();
					
					BeanUtil.copyProperties(brandPO, brandVO);
					BeanUtil.copyProperties(brandPO.getCategory(), brandVO);
					
					brandVOs.add(brandVO);
				}
				
				materialBrandRightVO.setBrands(brandVOs);
			}
		}
		
		return materialBrandRightVO;
	}

	@Override
	public MaterialBrandRightVO queryMaterialBrandForBrandByUserId(MaterialBrandRightVO materialBrandRightVO) {
		
		String userId = materialBrandRightVO.getUserId();
		
		MaterialBrandRightPO materialBrandRightPO = materialBrandRightDao.querymateriBrandRightByUserId(userId);
		
		if(materialBrandRightPO == null){
			materialBrandRightVO.setUserId(userId);
			materialBrandRightVO.setBrandId("");
		}else{
			BeanUtil.copyProperties(materialBrandRightPO, materialBrandRightVO, Arrays.asList("brands"));
			
			if(!"".equals(materialBrandRightPO.getBrandId())){
				
				List<BrandPO> brandPOs = brandDao.queryBrandByBrandIds(Arrays.asList(materialBrandRightPO.getBrandId().split("#")));
				List<BrandVO> brandVOs = new ArrayList<BrandVO>();
				
				for(BrandPO brandPO: brandPOs){
					BrandVO brandVO = new BrandVO();
					
					BeanUtil.copyProperties(brandPO, brandVO);
					BeanUtil.copyProperties(brandPO.getCategory(), brandVO);
					
					brandVOs.add(brandVO);
				}
				
				materialBrandRightVO.setBrands(brandVOs);
			}
		}
		
		return materialBrandRightVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveMaterialBrandRight(MaterialBrandRightVO materialBrandRightVO){
		
		MaterialBrandRightPO materialBrandRightPO = materialBrandRightDao.querymateriBrandRightByUserId(materialBrandRightVO.getUserId());
		
		if(materialBrandRightPO == null){
			materialBrandRightPO = new MaterialBrandRightPO();
			
			materialBrandRightPO.setUserId(materialBrandRightVO.getUserId());
			materialBrandRightPO.setBrandId(materialBrandRightVO.getBrandId());
		}else{
			materialBrandRightPO.setBrandId(materialBrandRightVO.getBrandId());
		}
		
		materialBrandRightDao.saveOrUpdate(materialBrandRightPO);
	}

}
