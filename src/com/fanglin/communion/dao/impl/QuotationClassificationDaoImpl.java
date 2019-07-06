/**
 * @File Name		: QuotationClassificationDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.QuotationClassificationDao;
import com.fanglin.communion.po.QuotationClassificationPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("quotationclassification")
public class QuotationClassificationDaoImpl extends DaoImpl<QuotationClassificationPO> implements QuotationClassificationDao {

	public QuotationClassificationDaoImpl() {
		super(QuotationClassificationPO.class, true);
	}

	@Override
	public List<QuotationClassificationPO> pageQuotationClassification(Paging paging, List<Filter> filters) {
		PagingQuery<QuotationClassificationPO> query = pagingQuery(paging, QuotationClassificationPO.class);

		if (filters != null) {
			for (Filter filter : filters) {
				if ("name".equals(filter.getField())) {
					query.add(query.getCriterion("name", Short.parseShort(filter.getData()), filter.getOp()));
				}
			}
		}

		query.asc("id");

		return query.list();
	}

}
