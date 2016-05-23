/**
 * Title: UserApproveDao
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: YunFeng Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.po.UserApprovePO;
import com.fanglin.utils.Paging;

public interface UserApproveDao extends Dao<UserApprovePO> {

	public List<UserApprovePO> pageUserApprove(Paging paging, List<FilterVO> filters);
	
	public List<UserApprovePO> queryApproveUserForNameByType(Paging paging, String pinyinName, String type);
	
	public List<UserApprovePO> queryApproveUserByUserId(String userId);
}
