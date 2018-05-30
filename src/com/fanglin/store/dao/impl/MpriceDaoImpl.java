package com.fanglin.store.dao.impl;

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
		
		return session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_GID_STR, gid)).addOrder(Order.asc(MpricePO.COLUMN_PRICE_STR)).list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMpriceByGid(long gid) {
		
		return session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_GID_STR, gid)).add(Restrictions.ne("status", MpricePO.STATUS_DISABLE_INT)).addOrder(Order.asc(MpricePO.COLUMN_PRICE_STR)).list();
	
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMpriceByBid(long bid) {
		
		return session().createCriteria(MpricePO.class).createAlias("mgoods", "mgoods").createAlias("mgoods.mbrand", "mbrand").add(Restrictions.eq("mbrand.bid", bid)).addOrder(Order.asc(MpricePO.COLUMN_PRICE_STR)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMpriceByPinyinName(String pinyinName) {
		
		return session().createCriteria(MpricePO.class).createAlias("mgoods", "mgoods").add(Restrictions.or(Restrictions.like("mgoods.pinyinName", pinyinName, MatchMode.START), Restrictions.like("mgoods.name", pinyinName, MatchMode.START))).addOrder(Order.asc(MpricePO.COLUMN_PRICE_STR)).list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMpriceByStatus(short status) {
		
		return session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_STATUS_STR, status)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMpriceByGidAndCid(long gid, long cid) {
		
		return session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_GID_STR, gid)).add(Restrictions.eq(MpricePO.COLUMN_CID_STR, cid)).list();
		
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MpricePO> queryMpriceByGidAndFid(long gid, long fid) {
		
		return session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_GID_STR, gid)).add(Restrictions.eq(MpricePO.COLUMN_FID_STR, fid)).list();
	}

	@Override
	public MpricePO queryMpriceByPid(long pid) {
		
		return (MpricePO) session().createCriteria(MpricePO.class).add(Restrictions.eq(MpricePO.COLUMN_PID_STR, pid)).uniqueResult();
	}

}
