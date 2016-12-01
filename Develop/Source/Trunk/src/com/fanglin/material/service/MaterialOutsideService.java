/**
 * @File Name		: MaterialOutsideService.java
 * @Package   	: com.fanglin.service.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-10
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.vo.MaterialOutsideVO;
import com.fanglin.utils.Paging;

public interface MaterialOutsideService {
	
	public void pageMaterialOutside(Paging paging, List<Filter> filters);
	
	public void pageMaterialOutsideByUserId(Paging paging, List<Filter> filters, String userId);
	
	public void addMaterialOutside(MaterialOutsideVO materialOutsideVO, String userId) throws FLException;
	
	public void updateMaterialOutside(MaterialOutsideVO materialOutsideVO, String userId) throws FLException;
	
}
