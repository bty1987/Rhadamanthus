/**
 * Title: UserExperienceDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserExperiencePO;

public interface UserExperienceDao extends Dao<UserExperiencePO> {

	public List<UserExperiencePO> queryUserExperiencesByUid(Integer uid);
	
}
