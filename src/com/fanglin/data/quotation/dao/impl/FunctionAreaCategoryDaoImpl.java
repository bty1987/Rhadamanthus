package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.FunctionAreaCategoryPO;
import com.fanglin.data.quotation.dao.FunctionAreaCategoryDao;

@Repository("functionAreaCategoryDao")
public class FunctionAreaCategoryDaoImpl extends DaoImpl<FunctionAreaCategoryPO> implements FunctionAreaCategoryDao {

	public FunctionAreaCategoryDaoImpl() {
		super(FunctionAreaCategoryPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaCategoryPO> queryFunctionAreaCategoryByFaid(long faid) {
		return createCriteria(FunctionAreaCategoryPO.class).add(Restrictions.eq("functionArea.faid", faid)).list();
	}

	@Override
	public FunctionAreaCategoryPO queryFunctionAreaCategory(long faid, long cid) {
		return (FunctionAreaCategoryPO) session().createCriteria(FunctionAreaCategoryPO.class).add(Restrictions.eq("functionArea.faid", faid)).add(Restrictions.eq("category.cid", cid)).setMaxResults(1).uniqueResult();
	}

}
