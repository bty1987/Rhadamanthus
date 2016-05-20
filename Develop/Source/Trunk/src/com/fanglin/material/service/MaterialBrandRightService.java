/**
 * @File Name		: MaterialBrandRightService.java
 * @Package   	: com.fanglin.service.materialOrder
 * @Version		: 1.0
 * @Date			: 2015-3-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service;

import com.fanglin.material.vo.MaterialBrandRightVO;

public interface MaterialBrandRightService {
	
	public MaterialBrandRightVO queryMaterialBrandRightByUserId(String userId);
	
	public void saveMaterialBrandRight(MaterialBrandRightVO materialBrandRightVO);

}
