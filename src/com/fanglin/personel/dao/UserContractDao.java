/**
 * Title: UserContractDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserContractPO;

public interface UserContractDao extends Dao<UserContractPO> {

	public List<UserContractPO> queryUserContract(Long uid);

}
