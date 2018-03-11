/**
 * @File Name		: QuotationTypeDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.QuotationTypeDao;
import com.fanglin.communion.po.QuotationTypePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("quotationtype")
public class QuotationTypeDaoImpl extends DaoImpl<QuotationTypePO> implements QuotationTypeDao {

	public QuotationTypeDaoImpl(){
		super(QuotationTypePO.class, true);
	}

	@Override
	public List<QuotationTypePO> pageQuotationType(Paging paging,List<Filter> filters) {
		// TODO Auto-generated method stub
         PagingQuery<QuotationTypePO> query = pagingQuery(paging, QuotationTypePO.class);
		
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
	
}
