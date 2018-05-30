/**
 * @File Name		: DecorationRightService.java
 * @Package   	: com.fanglin.right.service
 * @Version		: 1.0
 * @Date			: 2016-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserBaseVO;

public interface DecorationRightService {
	
	public List<Integer> queryDecorationDesignDepartmentRightByUserId(UserBaseVO userBaseVO, int company) throws FLException;
	
	public int updateDecorationDesignDepartmentRight(UserBaseVO userBaseVO, List<Integer> dIds, int company) throws FLException;
	
	public List<Integer> queryDecorationSalesmanDepartmentRightByUserId(UserBaseVO userBaseVO, int company) throws FLException;
	
	public int updateDecorationSalesmanDepartmentRight(UserBaseVO userBaseVO, List<Integer> dIds, int company) throws FLException;
	
	public List<Short> queryDecorationStatusRightByUserId(UserBaseVO userBaseVO, int company) throws FLException;
	
	public int updateDecorationStatusRight(UserBaseVO userBaseVO, List<Short> statuses, int company) throws FLException;
	
}
