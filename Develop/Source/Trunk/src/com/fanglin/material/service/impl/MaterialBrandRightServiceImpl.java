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

package com.fanglin.material.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.material.dao.MaterialBrandRightDao;
import com.fanglin.material.po.MaterialBrandRightPO;
import com.fanglin.material.service.MaterialBrandRightService;
import com.fanglin.material.vo.MaterialBrandRightVO;
import com.fanglin.utils.BeanUtil;

@Service("materialBrandRightService")
@Transactional(readOnly = true)
public class MaterialBrandRightServiceImpl implements MaterialBrandRightService {
	
	@Autowired
	private MaterialBrandRightDao materialBrandRightDao;

	@Override
	public MaterialBrandRightVO queryMaterialBrandRightByUserId(String userId){
		
		MaterialBrandRightPO materialBrandRightPO = materialBrandRightDao.querymateriBrandRightByUserId(userId);
		MaterialBrandRightVO materialBrandRightVO = new MaterialBrandRightVO();
		
		if(materialBrandRightPO == null){
			materialBrandRightVO.setUserId(userId);
			materialBrandRightVO.setBrandId("");
		}else{
			BeanUtil.copyProperties(materialBrandRightPO, materialBrandRightVO);
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
