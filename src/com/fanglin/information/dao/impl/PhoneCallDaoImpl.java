package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.PhoneCallDao;
import com.fanglin.information.po.PhoneCallPO;
import com.fanglin.utils.Paging;

@Repository("phoneCallDao")
public class PhoneCallDaoImpl extends DaoImpl<PhoneCallPO> implements PhoneCallDao {

	public PhoneCallDaoImpl(){
		super(PhoneCallPO.class);
	}

	@Override
	public List<PhoneCallPO> pagePhoneCall(Paging paging, List<Filter> filters) {
		
		PagingQuery<PhoneCallPO> query = pagingQuery(paging, PhoneCallPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public PhoneCallPO queryPhoneCallByCallBackId(String callBackId){
		return (PhoneCallPO) createCriteria(PhoneCallPO.class).add(Restrictions.eq("callbackId", callBackId)).uniqueResult();
	}
	
	@Override
	public PhoneCallPO queryPhoneCallByCallerACallee(String caller,String callee){
		return (PhoneCallPO) createCriteria(PhoneCallPO.class).add(Restrictions.eq("caller", caller)).add(Restrictions.eq("callee", callee)).add(Restrictions.eq("stopReason", PhoneCallPO.PHONECALLPO_STOPREASON_STR)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			
			query.alias("operater", "operater");
			
			for(Filter filter: filters){
				
				String field = filter.getField();
			
				if("orderId".equals(filter.getField())){
					query.add(query.getCriterion("orderId", filter));
				}else if("userId".equals(field)){
					query.add(query.getCriterion("operater.userId", filter));
				}else if("operateTime".equals(field)){
					query.add(query.getCriterion("operateTime", filter));
				}else if("callbackId".equals(field)){
					query.add(query.getCriterion("callbackId", filter));
				}else if("caller".equals(field)){
					query.add(query.getCriterion("caller", filter));
				}else if("callee".equals(field)){
					query.add(query.getCriterion("callee", filter));
				}else if("startTime".equals(field)){
					query.add(query.getCriterion("startTime", filter));
				}else if("endTime".equals(field)){
					query.add(query.getCriterion("endTime", filter));
				}else if("stopReason".equals(field)){
					query.add(query.getCriterion("stopReason", filter));
				}else if("duration".equals(field)){
					query.add(query.getCriterion("duration", filter));
				}else if("recordType".equals(field)){
					query.add(query.getCriterion("recordType", filter));
				}else if("recordUrl".equals(field)){
					query.add(query.getCriterion("recordUrl", filter));
				}
			}
		}
	}

}
