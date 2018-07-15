/**
 * Title: UserDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;

public interface UserDao extends Dao<UserPO> {
	
	public List<UserPO> pageUser(Paging paging, List<Filter> filters, Integer company);
	
	public UserPO queryUserByLoginId(String loginId);
	 
	public UserPO queryUserByUserId(String userId);
	
	public UserPO queryUserByOldUserId(String oldUserId);
	
	public List<UserPO> pageUserForNameByPinyinName(Paging paging, String pinyinName,Short status, Integer dtid);
	
	public List<UserPO> queryUserByPhoneAIdent(String phone, String ident);
	
	public List<UserPO> queryUserByDeptIdADuty(String deptId, String duty);

	public List<UserPO> queryUserByUserName(String userName);
   	
	public List<UserPO> queryUserByUserIds(List<String> userIds);
	
	public List<UserPO> queryUserByUids(List<Integer> uids);
	
	public int countUserByRoleId(Integer rid);

}
