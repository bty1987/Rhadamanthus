package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.construction.dao.ConstructionFunctionDao;
import com.fanglin.construction.po.ConstructionFunctionPO;

@Repository("constructionFunctionDao")
public class ConstructionFunctionDaoImpl extends DaoImpl<ConstructionFunctionPO> implements ConstructionFunctionDao {

	public ConstructionFunctionDaoImpl() {
		super(ConstructionFunctionPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionFunctionPO> queryConstructionFunction(Short type) {

		if (type != null) {
			return session().createCriteria(ConstructionFunctionPO.class).add(Restrictions.eq("type", type)).list();
		} else {
			return session().createCriteria(ConstructionFunctionPO.class).list();
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionFunctionPO> queryConstructionFunctionByName(String name) {
		return session().createCriteria(ConstructionFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}

}
