/**
 * @File Name		: SupplierUserRightService.java
 * @Package   	: com.fanglin.data.service
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.SupplierUserRightVO;

public interface SupplierUserRightService {
	
	public List<SupplierUserRightVO> querySupplierUserRightBySId(SupplierUserRightVO supplierUserRightVO);
	
	public int updateSupplierUserRight(SupplierUserRightVO supplierUserRightVO, List<String> userIds)throws FLException ;

}
