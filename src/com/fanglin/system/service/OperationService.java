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
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.OperationVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Paging;

public interface OperationService {

	public void pageOperation(Paging paging, List<Filter> filters);

	public List<OperationVO> queryOperation(OperationVO operationVO);

	public List<OperationVO> queryOperationByUserId(OperationVO operationVO, UserVO userVO) throws FLException;

	public List<OperationVO> queryOperationByRid(OperationVO operationVO, RoleVO roleVO) throws FLException;

	public OperationVO checkOperation(OperationVO operationVO) throws FLException;

	public boolean checkOperation(String userId, String operation, short rollcall) throws FLException;

	public void addOperation(OperationVO operationVO) throws FLException;

	public int updateOpperation(OperationVO operationVO) throws FLException;

	public int updateRoleOperationByRid(List<Integer> oids, RoleVO roleVO, String userId) throws FLException;

	public int updateRoleOperationByUserId(List<Integer> oids, UserVO userVO, String userId) throws FLException;

	public int deleteOperation(OperationVO operationVO) throws FLException;

}
