package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.DecorationCirclePictureDao;
import com.fanglin.customer.po.DecorationCirclePicturePO;

@Repository("decorationCirclePictureDao")
public class DecorationCirclePictureDaoImpl extends DaoImpl<DecorationCirclePicturePO> implements DecorationCirclePictureDao{
	
	public DecorationCirclePictureDaoImpl(){
		super(DecorationCirclePicturePO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DecorationCirclePicturePO> queryDecorationCirclePictureByDcid(long dcid) {
		return createCriteria(DecorationCirclePicturePO.class).add(Restrictions.eq(DecorationCirclePicturePO.COLUMN_DCID_STR, dcid)).list();
	}

}
