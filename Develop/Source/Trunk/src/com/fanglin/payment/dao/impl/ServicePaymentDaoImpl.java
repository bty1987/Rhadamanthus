package com.fanglin.payment.dao.impl;

import java.util.Arrays;
import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.payment.dao.ServicePaymentDao;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.utils.Paging;

@Repository("servicePaymentDao")
public class ServicePaymentDaoImpl  extends DaoImpl<ServicePaymentPO> implements ServicePaymentDao {

	public ServicePaymentDaoImpl(){
		super(ServicePaymentPO.class);
	}
	
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ServicePaymentPO> queryServicePaymentByOrderId(String orderId)
	{
		return session().createCriteria(ServicePaymentPO.class).createAlias("decorationOrder", "decorationOrder").add(Restrictions.eq("decorationOrder.orderId", orderId)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ServicePaymentPO> queryServicePaymentForNotInitBySrId(long srId) {
		
		List<Short> status = Arrays.asList(ServicePaymentPO.COLUMN_INITIALSTATUS_INT, ServicePaymentPO.COLUMN_CONFIRMEDSTATUS_INT);
		
		return session().createCriteria(ServicePaymentPO.class).createAlias("serviceReceipt", "serviceReceipt").add(Restrictions.eq("serviceReceipt.srId", srId)).add(Restrictions.not(Restrictions.in("status", status))).list();
	}
	
	
	@Override
	public List<ServicePaymentPO> pageServicePaymentForCollect(Paging paging, List<Filter> filters) {

		PagingQuery<ServicePaymentPO> query = pagingQuery(paging, ServicePaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}
	
	@Override
	public List<ServicePaymentPO> pageServicePaymentForConfirm(Paging paging, List<Filter> filters) {

		PagingQuery<ServicePaymentPO> query = pagingQuery(paging, ServicePaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){

		if(filters != null && filters.size() > 0){

			for(Filter filter: filters){

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				
				query.alias("decorationOrder", "decorationOrder");
				query.alias("decorationOrder.villagePO", "village");
				query.alias("decorationOrder.designerPO", "designer");
				
				if("orderId".equals(field)){
					query.add(query.getCriterion(DecorationHolonomyPO.COLUMN_ORDERID_STR, data, op));
				}else if("designer".equals(field)){
					query.add(query.getCriterion(DecorationHolonomyPO.COLUMN_DESIGNER_STR, data, op));
				}else if("village".equals(field)){
					query.add(query.getCriterion(DecorationHolonomyPO.COLUMN_VILLAGE_STR, data, op));
				}else if("status".equals(field)){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}
				
			}
		}
	}

}
