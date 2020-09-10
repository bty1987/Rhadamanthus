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
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.data.po.NormoodPO;
import com.fanglin.quotation.dao.QuotationNormoodDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemAO;

@Repository("quotationNormoodDao")
public class QuotationNormoodDaoImpl extends DaoImpl<QuotationFunctionAreaItemAO> implements QuotationNormoodDao {

	public QuotationNormoodDaoImpl() {
		super(QuotationFunctionAreaItemAO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<T> queryQuotationFunctionAreaItem(short index, long functionAreaId) {

		String sql = String.format("select i.*, a.*, g.* from quotation.quotationfunctionareaitem%d i, data.normood a, inventory.goods g where i.quotationFunctionAreaId = :functionAreaId and i.quotationItemId = a.qiid and a.gid = g.gid", index);

		return session().createSQLQuery(sql).addEntity(QuotationFunctionAreaItemAO.class).addEntity(NormoodPO.class).addEntity(GoodsPO.class).setLong("functionAreaId", functionAreaId).list();
	}

	@Override
	public List<?> amountQuotationNormood(short index, long functionAreaId) {

		String sql = String.format("select a.*, g.*, sum(a.num) as amount from quotation.quotationfunctionareaitem%d i, data.normood a, inventory.goods g where i.quotationFunctionAreaId = :functionAreaId and i.quotationItemId = a.qiid and a.gid = g.gid group by g.gid", index);

		return session().createSQLQuery(sql).addEntity(NormoodPO.class).addEntity(GoodsPO.class).addScalar("amount", StandardBasicTypes.LONG).setLong("functionAreaId", functionAreaId).list();
	}

}
