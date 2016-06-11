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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.utils.Paging;

@Repository("quotationVersionDao")
public class QuotationVersionDaoImpl extends DaoImpl<QuotationVersionPO> implements QuotationVersionDao {

	public QuotationVersionDaoImpl(){
		super(QuotationVersionPO.class, true);
	}

	@Override
	public List<QuotationVersionPO> pageQuotationVersion(Paging paging, List<FilterVO> filters){
		
		PagingQuery<QuotationVersionPO> query = pagingQuery(paging, QuotationVersionPO.class);
		
		queryFliterExcute(query, filters);
		
		query.desc("defaultFlag");
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationVersionPO> queryQuotationVersionByDefaultFlag(int defaultFlag){
		return createCriteria(QuotationVersionPO.class).add(Restrictions.eq("defaultFlag", defaultFlag)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationVersionPO> queryQuotationVersion(){
		return createCriteria(QuotationVersionPO.class).addOrder(Order.desc("defaultFlag")).list();
	}
	
	private void queryFliterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
	}
	
}
