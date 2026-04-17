package com.fanglin.quotation.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationProfileItemDao;
import com.fanglin.quotation.po.QuotationProfileItemPO;

@Repository("quotationProfileItemDao")
public class QuotationProfileItemDaoImpl extends DaoImpl<QuotationProfileItemPO> implements QuotationProfileItemDao {

	public QuotationProfileItemDaoImpl() {
		super(QuotationProfileItemPO.class);
	}

}
