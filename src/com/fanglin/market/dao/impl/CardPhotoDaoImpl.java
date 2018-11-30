package com.fanglin.market.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.market.dao.CardPhotoDao;
import com.fanglin.market.po.CardPhotoPO;

@Repository("cardPhotoDao")
public class CardPhotoDaoImpl extends DaoImpl<CardPhotoPO> implements CardPhotoDao {

	public CardPhotoDaoImpl(){
		super(CardPhotoPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CardPhotoPO> queryCardPhotoByCaid(long caid) {
		return session().createCriteria(CardPhotoPO.class).add(Restrictions.eq(CardPhotoPO.COLUMN_CAID_INT, caid)).list();
	}

}
