package com.fanglin.right.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserVO;


public interface CustomerSourceRightService {

	public List<Integer> queryCustomerSourceDepartmentRightByUserId(UserVO userVO, Integer company) throws FLException;
 	
	public void updateCustomerSourceDepartmentRight(UserVO userVO,List<Integer> dids, Integer company) throws FLException;
	
}
