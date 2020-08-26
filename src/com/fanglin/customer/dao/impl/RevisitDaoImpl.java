package com.fanglin.customer.dao.impl;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.RevisitDao;
import com.fanglin.customer.po.RevisitPO;
import com.fanglin.utils.Paging;
@Repository("revisitDao")
public class RevisitDaoImpl extends DaoImpl<RevisitPO> implements RevisitDao{

	public RevisitDaoImpl() {
		super(RevisitPO.class);
	}
	
	@Override
	public List<RevisitPO> pageRevisit(Paging paging, List<Filter> filters) {
		PagingQuery<RevisitPO> query = pagingQuery(paging, RevisitPO.class);
		queryFilterExcute(query, filters);		
		return query.alias("decoration","decoration").alias("creater","creater").list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<RevisitPO> queryRevisitByOrderId(String orderId) {
		return session().createCriteria(RevisitPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<RevisitPO> queryRevisitForAepair(long ident) {
		return session().createCriteria(RevisitPO.class).add(Restrictions.eq("ident", ident)).add(Restrictions.eq("type",RevisitPO.CUSTOMER_TYPE_INIT_AEPAIR)).list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<RevisitPO> queryRevisitForComplain(long ident) {
		return session().createCriteria(RevisitPO.class).add(Restrictions.eq("ident", ident)).add(Restrictions.eq("type",RevisitPO.CUSTOMER_TYPE_INIT_COMPLAIN)).list();
	}
	
	
	private void queryFilterExcute(PagingQuery<?> query,List<Filter> filters) {
		
		if(filters != null){
			for(Filter filter: filters){
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				query.alias("decoration","decoration");
				if(StringUtils.isNotEmpty(data)){				
					if("orderId".equals(field)){
						query.add(query.getCriterion("decoration.orderId", data, op));
					}else if("type".equals(field)){
						query.add(query.getCriterion("type", Short.valueOf(data), op));
					}
				}				
			}				
		}	
	}
}