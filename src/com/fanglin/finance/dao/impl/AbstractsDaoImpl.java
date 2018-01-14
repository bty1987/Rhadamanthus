/**
 * @File Name		: AbstractsDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-4-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.finance.dao.AbstractsDao;
import com.fanglin.finance.po.AbstractsPO;

@Repository("abstractsDao")
public class AbstractsDaoImpl extends DaoImpl<AbstractsPO> implements AbstractsDao {

	public AbstractsDaoImpl(){
		super(AbstractsPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AbstractsPO> queryAbstractsByOwnerId(int ownerId) {
		return session().createCriteria(AbstractsPO.class).add(Restrictions.eq(AbstractsPO.COLUMN_OWNERID_STR, ownerId)).list();
	}

	@Override
	public int countAbstractsByOwnerId(int ownerId) {
		
		String sql = "select count(*) from finance.abstracts where ownerId = :ownerId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("ownerId", ownerId).uniqueResult();
		
		return count.intValue();
	}
	
}
