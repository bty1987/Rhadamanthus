/**
 * @File Name		: QuotationVersionDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.utils.Paging;

@Repository("quotationVersionDao")
public class QuotationVersionDaoImpl extends DaoImpl<QuotationVersionPO> implements QuotationVersionDao {

	public QuotationVersionDaoImpl(){
		super(QuotationVersionPO.class, true);
	}

	@Override
	public List<QuotationVersionPO> pageQuotationVersion(Paging paging, List<Filter> filters,int company){
		
		PagingQuery<QuotationVersionPO> query = pagingQuery(paging, QuotationVersionPO.class);
		
		queryFliterExcute(query, filters);
		
		query.desc("defaultFlag");
		
		return query.add(Restrictions.eq("company",company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationVersionPO> queryQuotationVersionByDefaultFlag(int company,int defaultFlag){
		return createCriteria(QuotationVersionPO.class).add(Restrictions.and(Restrictions.eq("defaultFlag", defaultFlag),(Restrictions.eq("company", company)))).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationVersionPO> queryQuotationVersion(int company){
		return createCriteria(QuotationVersionPO.class).add(Restrictions.eq("company", company)).addOrder(Order.desc("defaultFlag")).list();
	}
	
	@Override
	public QuotationVersionPO queryQuotationVersionByVersionId(String versionId) {
		return (QuotationVersionPO) session().createCriteria(QuotationVersionPO.class).add(Restrictions.eq("versionId", versionId)).uniqueResult();
	}

	private void queryFliterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
	}
	
}
