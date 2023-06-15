package com.fanglin.right.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.right.dao.QuotationFunctionRightDao;
import com.fanglin.right.po.QuotationFunctionRightPO;

@Repository("quotationFunctionRightDao")
public class QuotationFunctionRightDaoImpl extends DaoImpl<QuotationFunctionRightPO> implements QuotationFunctionRightDao {

	public QuotationFunctionRightDaoImpl() {
		super(QuotationFunctionRightPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionRightPO> queryQuotationFunctionRight(String name) {
		return session().createCriteria(QuotationFunctionRightPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public int deleteQuotationFunctionRightByName(String name, Short type) {

		String sql = "delete from platform.quotationfunctionright where name = :name and type = :type";
		session().createSQLQuery(sql).setString("name", name).setShort("type", type).executeUpdate();

		return 0;
	}

}
