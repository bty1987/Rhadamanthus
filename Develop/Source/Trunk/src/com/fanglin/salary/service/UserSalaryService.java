/**
 * Title: UserSalaryService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.salary.service;

import java.util.List;

import com.fanglin.common.vo.ExcelWorkSheet;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.vo.UserSalaryVO;
import com.fanglin.utils.Paging;

public interface UserSalaryService {
	
	public void pageUserSalary(Paging paging, List<FilterVO> filters) throws FLException;
	
	public void pageUserSalaryByUserId(Paging paging, UserSalaryVO userSalary) throws FLException;

	public int saveUserSalary(UserSalaryVO userSalary) throws FLException;
	
	public int updateUserSalary(UserSalaryVO userSalary) throws FLException;

	public int paySalary(String userId, String createTimeBetween, String dealUserId);

	public int importUserSalary(ExcelWorkSheet<UserSalaryVO> sheet) throws FLException;
	
	public int deleteUserSalaryById(Long id) throws FLException;

	public int deleteUserSalary(List<Long> ids) throws FLException;

}
