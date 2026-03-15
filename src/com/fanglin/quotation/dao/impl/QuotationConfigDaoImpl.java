package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationConfigDao;
import com.fanglin.quotation.po.QuotationConfigPO;

/**
 * 预算配置表 DAO 实现
 */
@Repository("quotationConfigDao")
public class QuotationConfigDaoImpl extends DaoImpl<QuotationConfigPO> implements QuotationConfigDao {

	public QuotationConfigDaoImpl() {
		super(QuotationConfigPO.class);
	}

	@Override
	public QuotationConfigPO findByCompanyAndDepartment(Integer company, Integer department) {
		return (QuotationConfigPO) createCriteria(QuotationConfigPO.class)
				.add(Restrictions.eq("company", company))
				.add(Restrictions.eq("department", department))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationConfigPO> findByCompany(Integer company) {
		return createCriteria(QuotationConfigPO.class)
				.add(Restrictions.eq("company", company))
				.addOrder(Order.asc("department"))
				.list();
	}
}
