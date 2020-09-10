/**
 * @File Name		: CustomQuotationItemDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.apache.poi.ss.formula.functions.T;
import org.hibernate.SQLQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.po.ConstructionNodePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.NormricePO;
import com.fanglin.quotation.dao.QuotationNormriceDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemMO;

@Repository("quotationNormriceDao")
public class QuotationNormriceDaoImpl extends DaoImpl<QuotationFunctionAreaItemMO> implements QuotationNormriceDao {

	public QuotationNormriceDaoImpl() {
		super(QuotationFunctionAreaItemMO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> queryQuotationFunctionAreaItem(short index, long functionAreaId, Short schedule) {

		String sql = String.format("select i.*, m.*, n.* from quotation.quotationfunctionareaitem%d i, data.normrice m, communion.constructionnode n where i.quotationFunctionAreaId = :functionAreaId and i.quotationItemId = m.qiid and m.cnid = n.cnid", index);

		if (schedule != null) {
			sql = String.format("%s and n.sort = :schedule", sql);
		}

		SQLQuery query = session().createSQLQuery(sql).addEntity(QuotationFunctionAreaItemMO.class).addEntity(NormricePO.class).addEntity(ConstructionNodePO.class);

		query.setLong("functionAreaId", functionAreaId);

		if (schedule != null) {
			query.setShort("schedule", schedule);
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> amountQuotationNormrice(short index, long functionAreaId) {

		String sql = String.format("select m.*, n.*, sum(m.salary) as amount from quotation.quotationfunctionareaitem%d i, data.normrice m, communion.constructionnode n where i.quotationFunctionAreaId = :functionAreaId and i.quotationItemId = m.qiid and m.cnid = n.cnid group by n.cnid", index);

		return session().createSQLQuery(sql).addEntity(NormricePO.class).addEntity(ConstructionNodePO.class).addScalar("amount", StandardBasicTypes.LONG).setLong("functionAreaId", functionAreaId).list();
	}

}
