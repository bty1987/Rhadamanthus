/**
 * Title: UserApproveService
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: YunFeng Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.vo.UserApproveVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Paging;

public interface UserApproveService {
	
	public void pageUserApprove(Paging paging, List<FilterVO> filters);
	
	public List<UserApproveVO> queryApproveUserForNameByType(UserVO userVO, UserApproveVO userApproveVO);

	public int addUserApprove(UserApproveVO userApproveVO) throws FLException;

	public int updateUserApprove(UserApproveVO userApproveVO) throws FLException;

	public void deleteUserApprove(List<Integer> ids);

	public void deleteUserApproveById(Integer approveId);
}
