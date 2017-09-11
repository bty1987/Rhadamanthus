/**
 * @File Name		: QuotationSmallCategoryDaoImpl.java
 * @Package   	: com.fanglin.vo
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
import com.fanglin.data.po.QuotationSmallCategoryPO;
import com.fanglin.data.quotation.dao.QuotationSmallCategoryDao;
import com.fanglin.utils.Paging;

@Repository("quotationsmallcategory")
public class QuotationSmallCategoryDaoImpl extends DaoImpl<QuotationSmallCategoryPO> implements QuotationSmallCategoryDao {

	public QuotationSmallCategoryDaoImpl(){
		super(QuotationSmallCategoryPO.class, true);
	}

	@Override
	public List<QuotationSmallCategoryPO> pageQuotationSmallCategory(Paging paging, List<Filter> filters) {
		 PagingQuery<QuotationSmallCategoryPO> query = pagingQuery(paging, QuotationSmallCategoryPO.class);
			
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
	public List<QuotationSmallCategoryPO> queryQuotationSmallCategory(Integer qtid) {
		return session().createCriteria(QuotationSmallCategoryPO.class).add(Restrictions.eq("qtid", qtid)).list();
	}
}
