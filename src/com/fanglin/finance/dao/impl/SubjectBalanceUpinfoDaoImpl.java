/**
 * @File Name		: SubjectBalanceUpinfoDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-4-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.finance.dao.SubjectBalanceUpinfoDao;
import com.fanglin.finance.po.SubjectBalanceUpinfoPO;

@Repository("subjectBalanceUpinfoDao")
public class SubjectBalanceUpinfoDaoImpl extends DaoImpl<SubjectBalanceUpinfoPO> implements SubjectBalanceUpinfoDao {

	public SubjectBalanceUpinfoDaoImpl(){
		super(SubjectBalanceUpinfoPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SubjectBalanceUpinfoPO> querySubjectBalanceUpinfoForInit() {
		return session().createCriteria(SubjectBalanceUpinfoPO.class).add(Restrictions.eq(SubjectBalanceUpinfoPO.COLUMN_STATUS_STR, SubjectBalanceUpinfoPO.STATUS_INIT_INT)).list();
	}
	
}
