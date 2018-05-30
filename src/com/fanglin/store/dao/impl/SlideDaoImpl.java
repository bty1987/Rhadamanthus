package com.fanglin.store.dao.impl;

import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.store.dao.SlideDao;
import com.fanglin.store.po.SlidePO;

@Repository("slideDao")
public class SlideDaoImpl extends DaoImpl<SlidePO> implements SlideDao {

	public SlideDaoImpl() {
		super(SlidePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SlidePO> querySlide() {
		return session().createCriteria(SlidePO.class).add(Restrictions.eq("status", SlidePO.STATUS_ABLE_SHORT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SlidePO> querySlideByGid(long gid) {
		return session().createCriteria(SlidePO.class).add(Restrictions.eq(SlidePO.COLUMN_GID_STR, gid)).list();
	}

}
