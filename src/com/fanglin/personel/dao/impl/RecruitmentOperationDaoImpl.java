/**
 * Title: UserContractDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.RecruitmentOperationDao;
import com.fanglin.personel.po.RecruitmentOperationPO;

@Repository("recruitmentOperationDao")
public class RecruitmentOperationDaoImpl extends DaoImpl<RecruitmentOperationPO> implements RecruitmentOperationDao {

	public RecruitmentOperationDaoImpl() {
		super(RecruitmentOperationPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RecruitmentOperationPO> queryRecruitmentOperation(Long rid) {
		return session().createCriteria(RecruitmentOperationPO.class).add(Restrictions.eq("rid", rid)).list();
	}

}
