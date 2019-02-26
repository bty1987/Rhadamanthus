package com.fanglin.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.material.dao.MaterialActivityDao;
import com.fanglin.material.po.MaterialActivityItemPO;

@Repository("materialActivityDao")
public class MaterialActivityDaoImpl extends DaoImpl<MaterialActivityItemPO> implements MaterialActivityDao {

	public MaterialActivityDaoImpl() {
		super(MaterialActivityItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialActivityItemPO> queryMaterialActivityItem(String orderId) {
		return session().createCriteria(MaterialActivityItemPO.class).add(Restrictions.eq(MaterialActivityItemPO.COLUMN_ORDERID_STR, orderId)).list();
	}

}
