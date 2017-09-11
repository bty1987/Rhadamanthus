/**
 * @File Name		: QuotationBigCategoryDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationBigCategoryPO;
import com.fanglin.data.quotation.dao.QuotationBigCategoryDao;
import com.fanglin.utils.Paging;

@Repository("quotationbigcategory")
public class QuotationBigCategoryDaoImpl extends DaoImpl<QuotationBigCategoryPO> implements QuotationBigCategoryDao {

	public QuotationBigCategoryDaoImpl(){
		super(QuotationBigCategoryPO.class, true);
	}

	@Override
	public List<QuotationBigCategoryPO> pageQuotationBigCategory(Paging paging,List<Filter> filters) {
		 PagingQuery<QuotationBigCategoryPO> query = pagingQuery(paging, QuotationBigCategoryPO.class);
			
         if(filters != null){
 			for(Filter filter: filters){
 				if("name".equals(filter.getField())){
 					query.add(query.getCriterion("name", Short.parseShort(filter.getData()), filter.getOp()));
 				}
 			}
 		}
		
		query.asc("id");
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationBigCategoryPO> queryQuotationBigCategory(Integer qtid) {
		return session().createCriteria(QuotationBigCategoryPO.class).add(Restrictions.eq("qtid", qtid)).list();
	}

}
