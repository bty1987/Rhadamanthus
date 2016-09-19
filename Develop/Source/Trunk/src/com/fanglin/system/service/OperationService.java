/**
 * @File Name		: OperationService.java
 * @Package   	: com.fanglin.system.service
 * @Version		: 1.0
 * @Date			: 2016-4-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.OperationVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface OperationService {
	
	public void pageOperation(Paging paging, List<FilterVO> filters);
	
	public List<OperationVO> queryOperation(OperationVO operationVO);
	
	public List<OperationVO> queryOperationByUserId(OperationVO operationVO, UserVO userVO) throws FLException;
	
	public List<OperationVO> queryOperationByRoleId(OperationVO operationVO, RoleVO roleVO) throws FLException;
	
	public boolean checkOperationByUserId(String userId, String operation) throws FLException;
	
	public int updateRoleOperationByRoleId(List<Integer> oIds, OperationVO operationVO, RoleVO roleVO) throws FLException;
	
	public int updateRoleOperationByUserId(List<Integer> oIds, OperationVO operationVO, UserVO userVO) throws FLException;

}
