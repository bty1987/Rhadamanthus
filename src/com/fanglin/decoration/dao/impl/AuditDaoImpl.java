package com.fanglin.decoration.dao.impl;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.AuditDao;
import com.fanglin.decoration.po.AuditPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.Paging;


@Repository("auditDao")
public class AuditDaoImpl extends DaoImpl<AuditPO> implements AuditDao{
	
	public AuditDaoImpl(){
		super(AuditPO.class);
	}

	@Override
	public List<AuditPO> pageAudit(Paging paging, List<Filter> filters, int company) {
		List<Short> status = Arrays.asList(new Short[]{DecorationPO.STATUS_INIT_INT});
		
		PagingQuery<AuditPO> query = pagingQuery(paging,AuditPO.class);
		
		query.add(query.getCriterion("decoration.company", company, "eq"));
		
		queryFilterExcute(query, filters);		
		
		return query.alias("decoration","decoration").add(Restrictions.not(Restrictions.in("decoration.status", status))).list();
	}
	
	@Override
	public AuditPO queryAuditByOrderId(String orderId) {
		return (AuditPO)createCriteria(AuditPO.class).add(Restrictions.eq(AuditPO.COLUMN_ORDERID_STR , orderId)).uniqueResult();
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
					}else if("villageId".equals(field)){ 
						query.alias("decoration.house", "house");
						query.alias("house.village", "village");
						query.add(query.getCriterion("village.no", data, op));		
					}else if("designerId".equals(field)){
						query.alias("decoration.designer", "designer");
						query.add(query.getCriterion("designer.userId", data, op));
					}else if("salesmanId".equals(field)){
						query.add(query.getCriterion("salesman.userId", data, op));
					}else if("supervisor".equals(field)){
						query.alias("decoration.supervisorPO", "supervisor");
						query.add(query.getCriterion("supervisor.userId", data, op));
					}else if("orderType".equals(field)){
						query.add(query.getCriterion("decoration.typeness", Short.valueOf(data), op));
					}else if("salesmanType".equals(field)){
						query.add(query.getCriterion("decoration.salesmanType", data, op));
					}else if("auditer".equals(field)){
						query.alias("auditer","auditer");
						query.add(query.getCriterion("auditer.userId", data, op));
					}else if("designerDepartmentId".equals(field)){
						query.alias("decoration.designer", "designer");
						query.alias("designer.dept", "designerDept");
						query.add(query.getCriterion("designerDept.no", data, op));
					}else if("createTimeDateRange".equals(field)){
						query.timeranges("decoration.createTime", "decoration.createTime", data);
					}else if("signTimeDateRange".equals(field)){
						query.timeranges("decoration.contractTime", "decoration.contractTime", data);
					}else if("status".equals(field)){
						query.add(query.getCriterion("decoration.status", Short.valueOf(data), op));
					}else if("auditStatus".equals(field)){
						if(data.equals("已审批")){
							query.add(Restrictions.isNotNull("auditer"));
						}else if(data.equals("未审批")){
							query.add(Restrictions.isNull("auditer"));
						}
					}else if("auditTime".equals(field)){
						query.timeranges("auditTime", "auditTime", data);
					}
				}				
			}				
		}	
	}
}
