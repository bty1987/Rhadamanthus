/**
 * @File Name		: StorehouseService.java
 * @Package   	: com.fanglin.inventory.service
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.StorehouseVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Paging;

public interface StorehouseService {

	public void pageStorehouse(Paging paging, List<Filter> filters);

	public List<StorehouseVO> queryStorehouse(StorehouseVO storehouseVO);

	public List<StorehouseVO> queryStorehouseByUserId(UserBaseVO user);

	public int addStorehouse(StorehouseVO storehouseVO) throws FLException;

	public int updateStorehouseForStatus(StorehouseVO storehouseVO) throws FLException;

}
