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
import com.fanglin.personel.dao.RecruitmentEducationDao;
import com.fanglin.personel.po.RecruitmentEducationPO;

@Repository("recruitmentEducationDao")
public class RecruitmentEducationDaoImpl extends DaoImpl<RecruitmentEducationPO> implements RecruitmentEducationDao {

	public RecruitmentEducationDaoImpl() {
		super(RecruitmentEducationPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RecruitmentEducationPO> queryRecruitmentEducation(Long rid) {
		return session().createCriteria(RecruitmentEducationPO.class).add(Restrictions.eq("rid", rid)).list();
	}

}
