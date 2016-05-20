/**
 * Title: UserExperienceDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserExperiencePO;
import com.fanglin.utils.Paging;

public interface UserExperienceDao extends Dao<UserExperiencePO> {

	public List<UserExperiencePO> pageUserExperiencesByUserId(Paging paging, String userId);
	
}
