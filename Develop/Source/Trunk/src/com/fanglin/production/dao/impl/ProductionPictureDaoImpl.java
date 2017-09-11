package com.fanglin.production.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.ProductionPictureDao;
import com.fanglin.production.po.ProductionPicturePO;


@Repository("productionPictureDao")
public class ProductionPictureDaoImpl extends DaoImpl<ProductionPicturePO> implements ProductionPictureDao {

	public ProductionPictureDaoImpl(){
		super(ProductionPicturePO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<ProductionPicturePO> queryProductionPictureByPid(long pid) {
		
		return session().createCriteria(ProductionPicturePO.class).add(Restrictions.eq(ProductionPicturePO.COLUMN_PID_STR, pid)).list();
	}

}
