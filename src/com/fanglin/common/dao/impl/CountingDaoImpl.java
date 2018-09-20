/**
 * @File Name		: CountingDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-1-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.common.dao.CountingDao;
import com.fanglin.common.po.CountingPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("countingDao")
public class CountingDaoImpl extends DaoImpl<CountingPO> implements CountingDao {
	
	public CountingDaoImpl(){
		super(CountingPO.class);
	}

	@Override
	public CountingPO queryCountingByTypeDate(int type, String date, int company){
		return (CountingPO) session().createCriteria(CountingPO.class).add(Restrictions.eq(CountingPO.COLUMN_DATE_STR, date)).add(Restrictions.eq(CountingPO.COLUMN_TYPE_STR, type)).add(Restrictions.eq(CountingPO.COLUMN_COMPANY_STR, company)).uniqueResult();
	}

}
