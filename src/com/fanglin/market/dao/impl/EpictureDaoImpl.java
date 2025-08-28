package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.market.dao.EpictureDao;
import com.fanglin.market.po.EpicturePO;

@Repository("epictureDao")
public class EpictureDaoImpl extends DaoImpl<EpicturePO> implements EpictureDao{

	public EpictureDaoImpl(){
		super(EpicturePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<EpicturePO> queryEpictureByCid(long cid, short type) {

		return session().createCriteria(EpicturePO.class).add(Restrictions.eq(EpicturePO.EPICTURE_CID_STR,cid)).add(Restrictions.eq(EpicturePO.COLUMN_TYPE_STR, type)).list();
	}

}
