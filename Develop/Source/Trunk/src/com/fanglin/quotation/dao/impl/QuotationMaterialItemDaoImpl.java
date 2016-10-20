/**
 * @File Name		: QuotationMaterialItemDaoImpl.java
 * @Package   	: com.fanglin.quotation.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-10-20
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationMaterialItemDao;
import com.fanglin.quotation.po.QuotationMaterialItemPO;

@Repository("quotationMaterialItemDao")
public class QuotationMaterialItemDaoImpl extends DaoImpl<QuotationMaterialItemPO> implements QuotationMaterialItemDao {

	public QuotationMaterialItemDaoImpl(){
		super(QuotationMaterialItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationMaterialItemPO> queryQuotationMaterialItemByQId(long qid) {
		return session().createCriteria(QuotationMaterialItemPO.class).add(Restrictions.eq(QuotationMaterialItemPO.COLUMN_QID_STR, qid)).list();
	}

}
