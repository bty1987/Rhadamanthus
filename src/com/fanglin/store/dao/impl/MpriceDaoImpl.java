package com.fanglin.store.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.MpriceDao;
import com.fanglin.store.po.MpricePO;

@Repository("mpriceDao")
public class MpriceDaoImpl extends DaoImpl<MpricePO> implements MpriceDao{

	public MpriceDaoImpl(){
		super(MpricePO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMprice(long gid) {
		
		return session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_GID_STR, gid)).add(Restrictions.ne("status", MpricePO.STATUS_DISABLE_INT)).addOrder(Order.asc(MpricePO.COLUMN_PRICE_STR)).list();
		
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMpriceByGid(long gid) {
		
		return session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_GID_STR, gid)).addOrder(Order.asc(MpricePO.COLUMN_PRICE_STR)).list();
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMpriceByPinyin(String pinyinName) {
		
		return session().createCriteria(MpricePO.class).createAlias("mgoods", "mgoods").add(Restrictions.or(Restrictions.like("mgoods.pinyin", pinyinName, MatchMode.START), Restrictions.like("mgoods.name", pinyinName, MatchMode.START))).add(Restrictions.ne("status", MpricePO.STATUS_DISABLE_INT)).addOrder(Order.asc(MpricePO.COLUMN_PRICE_STR)).list();
		
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMpriceForShow(short status) {
		
		return session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_STATUS_STR, status)).list();
		
	}

	@Override
	public MpricePO queryMpriceByPid(long pid) {
		
		return (MpricePO) session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_PID_STR, pid)).uniqueResult();
		
	}

	@Override
	public int count(long gid, long cid, long fid) {
		
		String sql = "select count(*) from store.mprice where gid = :gid and cid = :cid and fid = :fid";
		
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("gid", gid).setLong("cid", cid).setLong("fid", fid).uniqueResult();
		
		return count.intValue();
		
	}
}
