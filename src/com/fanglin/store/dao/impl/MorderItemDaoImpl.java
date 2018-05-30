package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.MorderItemDao;
import com.fanglin.store.po.MorderItemPO;

@Repository("morderItemDao")
public class MorderItemDaoImpl extends DaoImpl<MorderItemPO> implements MorderItemDao{

	public MorderItemDaoImpl(){
		super(MorderItemPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MorderItemPO> queryMorderItemByUidAndStatus(Long uid, Short status) {
		
		return session().createCriteria(MorderItemPO.class).createAlias("morder", "morder").createAlias("morder.muser", "muser").add(Restrictions.eq("muser.uid", uid)).add(Restrictions.eq("morder.status", status)).list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MorderItemPO> queryMorderItemByOid(Long oid) {
		return session().createCriteria(MorderItemPO.class).add(Restrictions.eq(MorderItemPO.COLUMN_OID_STR, oid)).list();
	}

}
