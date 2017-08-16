package com.fanglin.decoration.dao.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.AuditDao;
import com.fanglin.decoration.po.AuditPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;


@Repository("auditDao")
public class AuditDaoImpl extends DaoImpl<AuditPO> implements AuditDao{
	
	public AuditDaoImpl(){
		super(AuditPO.class);
	}

	@Override
	public List<AuditPO> pageAudit(Paging paging, List<Filter> filters, int company) {
		List<String> status = Arrays.asList(new String[]{"咨询", "量房","已报价"});
		
		PagingQuery<AuditPO> query = pagingQuery(paging,AuditPO.class);
		
		query.add(query.getCriterion("decorationOrder.company", company, "eq"));
		
		queryFilterExcute(query, filters);		
		
		return query.alias("decorationOrder","decorationOrder").add(Restrictions.not(Restrictions.in("decorationOrder.status", status))).list();
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
				query.alias("decorationOrder","decorationOrder");
				if(StringUtils.isNotEmpty(data)){				
					if("orderId".equals(field)){
						query.add(query.getCriterion("decorationOrder.orderId", data, op));
					}else if("village".equals(field)){ 
						query.alias("decorationOrder.villagePO","village");
						query.add(query.getCriterion("village.villageName", data, op));		
					}else if("designer".equals(field)){
						query.alias("decorationOrder.designerPO", "designer");
						query.add(query.getCriterion("designer.currentName", data, op));
					}else if("salesman".equals(field)){
						query.add(query.getCriterion("salesman.currentName", data, op));
					}else if("supervisor".equals(field)){
						query.alias("decorationOrder.supervisorPO", "supervisor");
						query.add(query.getCriterion("supervisor.currentName", data, op));
					}else if("orderType".equals(field)){
						query.add(query.getCriterion("decorationOrder.type", Short.valueOf(data), op));
					}else if("salesmanType".equals(field)){
						query.add(query.getCriterion("decorationOrder.salesmanType", data, op));
					}else if("auditer".equals(field)){
						query.alias("auditer","auditer");
						query.add(query.getCriterion("auditer.currentName", data, op));
					}else if("designerDepartmentId".equals(field)){
						query.alias("decorationOrder.designerPO", "designer");
						query.alias("designer.dept", "designerDept");
						query.add(query.getCriterion("designerDept.deptId", data, op));
					}else if("createTimeDateRange".equals(field)){
						String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
						String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
						
						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
						
						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						
						query.add(query.getCriterion("decorationOrder.createTime", eTimestamp, "le"));
						query.add(query.getCriterion("decorationOrder.createTime", sTimestamp, "ge"));
					}else if("signTimeDateRange".equals(field)){
						String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
						String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
						
						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
						
						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						
						query.add(query.getCriterion("decorationOrder.contractTime", eTimestamp, "le"));
						query.add(query.getCriterion("decorationOrder.contractTime", sTimestamp, "ge"));
					}else if("status".equals(field)){
						query.add(query.getCriterion("decorationOrder.status", data, op));
					}else if("auditStatus".equals(field)){
						if(data.equals("已审批")){
							query.add(Restrictions.isNotNull("auditer"));
						}else if(data.equals("未审批")){
							query.add(Restrictions.isNull("auditer"));
						}
					}
				}				
			}				
		}	
	}
}
