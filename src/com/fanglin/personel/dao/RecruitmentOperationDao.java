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
import com.fanglin.personel.po.RecruitmentOperationPO;

public interface RecruitmentOperationDao extends Dao<RecruitmentOperationPO> {

	public List<RecruitmentOperationPO> queryRecruitmentOperation(Long rid);

}
