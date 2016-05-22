/**
 * Title: UserDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;

public interface UserDao extends Dao<UserPO> {
	
	public List<UserPO> pageUser(Paging paging, List<FilterVO> filters);
	
	public List<UserPO> pageUserForNameByPinyinName(Paging paging, String pinyinName, Integer company);
	
	public List<UserPO> pageUserForNameByPinyinNameADuty(Paging paging, String pinyinName, String duty);
	
	public List<UserPO> pageUserForNameByPinyinNameADutys(Paging paging, String pinyinName, List<String> dutys);
	
	public List<UserPO> pageUserForNameByPinyinNameADutyADeptId(Paging paging, String pinyinName, String duty, String deptId);

	public List<UserPO> pageUserForNameByPinyinNameADutysADeptId(Paging paging, String pinyinName, List<String> dutys, String deptId);
	
	public List<UserPO> pageUserForNameByPinyinNameADutysAO(Paging paging, String pinyinName, List<String> dutysA, List<String> dutysO);

	public List<UserPO> pageUserForNameByPinyinNameADutysAODeptId(Paging paging, String pinyinName, List<String> dutysA, List<String> dutysO, String deptId);

	public List<UserPO> pageUserForWorking(Paging paging, List<FilterVO> filters);
	
	public UserPO queryUserByLoginId(String loginId);

	public List<UserPO> queryUserByDeptIdADuty(String deptId, String duty);
	
	public List<UserPO> queryUserByDutys(List<String> dutys);
	
	public List<UserPO> queryUserByUserName(String userName);
	
	public List<UserPO> queryUserByUserIds(List<String> userIds);
	
	public UserPO queryUserByOldUserId(String oldUserId);
	
	public void resetPassword(String userId, String password);
	
	public int countUserByRoleId(String roleId);
	
}
