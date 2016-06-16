/**
 * @File Name		: DecorationOrderRightService.java
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
import com.fanglin.personel.vo.UserVO;

public interface DecorationOrderRightService {
	
	public List<Integer> queryDecorationOrderDesignDepartmentRightByUserId(UserVO userVO) throws FLException;
	
	public int updateDecorationOrderDesignDepartmentRight(UserVO userVO, List<Integer> dIds) throws FLException;
	
	public List<Integer> queryDecorationOrderSalesmanDepartmentRightByUserId(UserVO userVO) throws FLException;
	
	public int updateDecorationOrderSalesmanDepartmentRight(UserVO userVO, List<Integer> dIds) throws FLException;
	
	public List<String> queryDecorationOrderStatusRightByUserId(UserVO userVO) throws FLException;
	
	public int updateDecorationOrderStatusRight(UserVO userVO, List<String> statuses) throws FLException;
	
}
