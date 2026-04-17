package com.fanglin.quotation.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationProfileOptionDao;
import com.fanglin.quotation.po.QuotationProfileOptionPO;

@Repository("quotationProfileOptionDao")
public class QuotationProfileOptionDaoImpl extends DaoImpl<QuotationProfileOptionPO> implements QuotationProfileOptionDao {

	public QuotationProfileOptionDaoImpl() {
		super(QuotationProfileOptionPO.class);
	}

}
