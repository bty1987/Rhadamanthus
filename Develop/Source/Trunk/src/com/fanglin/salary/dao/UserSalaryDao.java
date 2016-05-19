/**
 * Title: UserSalaryDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 */

package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.po.UserSalaryPO;
import com.fanglin.utils.Paging;

public interface UserSalaryDao extends Dao<UserSalaryPO> {
	
	public List<UserSalaryPO> pageUserSalary(Paging paging, List<FilterVO> filters);

	public List<UserSalaryPO> pageUserSalaryByUserId(Paging paging, String userId);
	
	public int paySalary(String userId, String createTimeBetween, String dealUserId);

}
