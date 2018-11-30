package com.fanglin.market.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.market.dao.CnoticeDao;
import com.fanglin.market.po.CnoticePO;

@Repository("cnoticeDao")
public class CnoticeDaoImpl extends DaoImpl<CnoticePO> implements CnoticeDao {

	public CnoticeDaoImpl(){
		super(CnoticePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CnoticePO> queryCnoticeBySuid(long suid) {
		return (List<CnoticePO>) session().createCriteria(CnoticePO.class).add(Restrictions.eq(CnoticePO.COLUMN_SUID_STR, suid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CnoticePO> queryCnoticeByRuid(long ruid) {
		return (List<CnoticePO>) session().createCriteria(CnoticePO.class).add(Restrictions.eq(CnoticePO.COLUMN_RUID_STR, ruid)).list();
	}
	
	@Override
	public int countCnoticeBySuid(long suid, short status) {
		
		String sql = "select count(*) from market.cnotice where suid = :suid and status = :status"; 
		
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("suid", suid).setInteger("status", status).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countCnoticeByRuid(long ruid, short status) {
		
		String sql = "select count(*) from market.cnotice where ruid = :ruid and status = :status"; 
		
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("ruid", ruid).setInteger("status", status).uniqueResult();

		return count.intValue();
	}

}
