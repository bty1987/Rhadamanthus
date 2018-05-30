package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.po.PicturePO;
import com.fanglin.store.dao.PictureDao;

@Repository("pictureDao")
public class PictureDaoImpl extends DaoImpl<PicturePO> implements PictureDao {
	
	public PictureDaoImpl() {
		super(PicturePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PicturePO> queryPicture(Long gid, Short type, Short status) {
		
		Criteria criteria = session().createCriteria(PicturePO.class);
		
		if(gid != null){
			criteria.add(Restrictions.eq(PicturePO.COLUMN_GID_STR, gid));
		}
		
		if(type != null){
			criteria.add(Restrictions.eq(PicturePO.COLUMN_TYPE_STR, type));
		}
		
		if(status != null){
			criteria.add(Restrictions.eq("status", status));
		}
			
		criteria.addOrder(Order.asc("sort"));
		
		return criteria.list();
		
	}

	@Override
	public void updatePictureForSort(Long pid, Short sort) {
		
		String sql = "UPDATE store.picture SET sort = :sort WHERE pid = :pid";

	    session().createSQLQuery(sql).setShort("sort", sort).setLong("pid", pid).executeUpdate();
	    
	}

}
