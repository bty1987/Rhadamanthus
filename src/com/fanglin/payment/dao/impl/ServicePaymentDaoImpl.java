package com.fanglin.payment.dao.impl;

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
	public List<ServicePaymentPO> pageServicePayment(Paging paging, List<Filter> filters) {

		PagingQuery<ServicePaymentPO> query = pagingQuery(paging, ServicePaymentPO.class);

		queryFilterExecute(query, filters);

		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ServicePaymentPO> queryServicePaymentByOrderId(String orderId){
		return session().createCriteria(ServicePaymentPO.class).createAlias("decoration", "decoration").add(Restrictions.eq("decoration.orderId", orderId)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ServicePaymentPO> queryServicePaymentForNotInitBySrId(long srId) {
		return session().createCriteria(ServicePaymentPO.class).createAlias("serviceReceipt", "serviceReceipt").add(Restrictions.eq("serviceReceipt.srId", srId)).add(Restrictions.ne("status", ServicePaymentPO.COLUMN_INITIALSTATUS_INT)).list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){

		if(filters != null && filters.size() > 0){

			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("decoration", "decoration");
				query.alias("decoration.house", "house");
				query.alias("house.village", "village");
				query.alias("decoration.designer", "designer");
				query.alias("serviceReceipt", "servicereceipt");
				
				if("orderId".equals(field)){
					query.add(query.getCriterion(DecorationHolonomyPO.COLUMN_ORDERID_STR, data, op));
				}else if("designer".equals(field)){
					query.add(query.getCriterion("designer.userId", data, op));
				}else if("village".equals(field)){
					query.add(query.getCriterion("village.no", data, op));
				}else if("status".equals(field)){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}else if("collectTime".equals(filter.getField())){
					
					if("between".equals(filter.getOp())){
						query.timeranges("servicereceipt.collectTime", "servicereceipt.collectTime", filter.getData());
					}else{
						query.add(query.getCriterion("servicereceipt.collectTime", filter.getData(), filter.getOp()));
					}
				}else if("company".equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
				}
			}
		}
	}

}
