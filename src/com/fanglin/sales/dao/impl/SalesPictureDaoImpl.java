package com.fanglin.sales.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.sales.dao.SalesPictureDao;
import com.fanglin.sales.po.SalesPicturePO;

@Repository("salesPictureDao")
public class SalesPictureDaoImpl extends DaoImpl<SalesPicturePO> implements SalesPictureDao {

	public SalesPictureDaoImpl() {
		super(SalesPicturePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPicturePO> querySalesPictureBySid(Long sid) {
		return createCriteria(SalesPicturePO.class).add(Restrictions.eq(SalesPicturePO.COLUMN_SID_STR, sid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SalesPicturePO> querysalesPictureBySiid(Long siid) {
		return session().createCriteria(SalesPicturePO.class).add(Restrictions.eq(SalesPicturePO.COLUMN_SIID_STR, siid)).list();
	}

}
