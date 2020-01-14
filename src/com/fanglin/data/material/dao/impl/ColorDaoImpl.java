package com.fanglin.data.material.dao.impl;

import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.material.dao.ColorDao;
import com.fanglin.data.po.ColorPO;

@Repository("colorDao")
public class ColorDaoImpl extends DaoImpl<ColorPO> implements ColorDao {

	public ColorDaoImpl() {
		super(ColorPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ColorPO> queryColorByGid(long gid) {
		return session().createCriteria(ColorPO.class).add(Restrictions.eq(ColorPO.COLUMN_GID_STR, gid)).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ColorPO> queryColorForEnableByGid(long gid) {
		return session().createCriteria(ColorPO.class).add(Restrictions.eq(ColorPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(ColorPO.COLUMN_STATUS_STR, ColorPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public ColorPO queryColorByName(long gid, String name) {

		return (ColorPO) session().createCriteria(ColorPO.class).add(Restrictions.eq(ColorPO.COLUMN_GID_STR, gid)).add(Restrictions.eq(ColorPO.COLUMN_NAME_STR, name)).uniqueResult();
	}

}
