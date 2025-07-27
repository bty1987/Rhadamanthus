package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationPictureDao;
import com.fanglin.quotation.po.QuotationPicturePO;

@Repository("QuotationPictureDao")
public class QuotationPictureDaoImpl extends DaoImpl<QuotationPicturePO> implements QuotationPictureDao {

	public QuotationPictureDaoImpl() {
		super(QuotationPicturePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationPicturePO> queryQuotationPicture(long qid, short atttype) {
		return session().createCriteria(QuotationPicturePO.class).add(Restrictions.eq("status", QuotationPicturePO.STATUS_YES_SHORT)).add(Restrictions.eq("qid", qid)).add(Restrictions.eq("atttype", atttype)).list();
	}

}
