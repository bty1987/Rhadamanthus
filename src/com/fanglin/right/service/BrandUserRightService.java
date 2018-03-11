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

package com.fanglin.right.service;

import com.fanglin.right.vo.BrandUserRightVO;

public interface BrandUserRightService {
	
	public BrandUserRightVO queryBrandUserRightByUid(BrandUserRightVO brandUserRightVO);
	
	public BrandUserRightVO queryBrandUserRightForLogin(String userId);
	
	public void updateBrandUserRight(BrandUserRightVO brandUserRightVO);

}
