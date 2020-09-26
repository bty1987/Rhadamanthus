package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.PictureDao;
import com.fanglin.store.po.PicturePO;

@Repository("pictureDao")
public class PictureDaoImpl extends DaoImpl<PicturePO> implements PictureDao {

	public PictureDaoImpl() {
		super(PicturePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PicturePO> queryPictureByGid(Long gid) {
		return session().createCriteria(PicturePO.class).add(Restrictions.eq(PicturePO.COLUMN_GID_STR, gid)).addOrder(Order.asc("sort")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PicturePO> queryPicture(Long gid, Short type) {
		return session().createCriteria(PicturePO.class).add(Restrictions.eq(PicturePO.COLUMN_GID_STR, gid)).add(Restrictions.eq(PicturePO.COLUMN_TYPE_STR, type)).addOrder(Order.asc("sort")).list();
	}

	@Override
	public int updatePictureForSort(Long pid, Short sort) {

		String sql = "UPDATE store.picture SET sort = :sort WHERE pid = :pid";
		session().createSQLQuery(sql).setShort("sort", sort).setLong("pid", pid).executeUpdate();

		return 0;
	}

}
