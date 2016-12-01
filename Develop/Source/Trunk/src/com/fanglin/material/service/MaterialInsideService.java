/**
 * @File Name		: MaterialInside.java
 * @Package   	: com.fanglin.service.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.material.vo.MaterialInsideVO;
import com.fanglin.utils.Paging;

public interface MaterialInsideService {
	
	public void pageMaterialInside(Paging paging, List<Filter> filters);
	
	public void pageMaterialInsideByUserId(Paging paging, List<Filter> filters, String userId);
	
	public void addMaterialInside(MaterialInsideVO materialInsideVO, String userId);
	
	public void updateMaterialInside(MaterialInsideVO materialInsideVO, String userId);
	
	public void deleteMaterialInsideByMiIds(List<Integer> miIds);
	
}
