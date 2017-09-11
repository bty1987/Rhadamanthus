package com.fanglin.quotation.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.utils.Paging;

@Repository("extensionDao")
public class ExtensionDaoImpl extends DaoImpl<ExtensionPO> implements ExtensionDao{
	
	public ExtensionDaoImpl(){
		super(ExtensionPO.class);
	}

	@Override
	public List<ExtensionPO> pageExtensionByOrderId(Paging paging,List<Filter> filters) {
		PagingQuery<ExtensionPO> query = pagingQuery(paging, ExtensionPO.class);
		
		queryFilterExcute(query, filters);
		
		query.desc("createTime");
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ExtensionPO> queryExtensionByOrderId(String orderId) {
		return session().createCriteria(ExtensionPO.class).add(Restrictions.eq(ExtensionPO.COLUMN_ORDERID_STR, orderId)).list();
	}
	
	@Override
	public float sumExtensionByOrderId(String orderId,short type){
		String sql = "select if(sum(quotation.extension.total) is null,0,sum(quotation.extension.total)) from quotation.extension where orderId = :orderId and quotation.extension.type = :type";
		BigDecimal sum = (BigDecimal) session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).uniqueResult();
		return sum.floatValue();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		if(filters != null){
			for(Filter filter: filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if(ExtensionPO.COLUMN_ORDERID_STR.equals(filter.getField())){
						query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
					}
				}
			}
		}
	}
}
