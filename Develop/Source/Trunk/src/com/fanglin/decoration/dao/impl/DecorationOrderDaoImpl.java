/**
 * @File Name		: DecorationOrderDaoImpl
 * @Package   	: com.fanglin.dao.impl.decorationOrder
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("decoratioOrderDao")
public class DecorationOrderDaoImpl extends DaoImpl<DecorationOrderPO> implements DecorationOrderDao {

	public DecorationOrderDaoImpl(){
		super(DecorationOrderPO.class);
	}
	
	@Override
	public List<DecorationOrderPO> pageDecorationOrder(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<String> statuses){
		PagingQuery<DecorationOrderPO> query = pagingQuery(paging, DecorationOrderPO.class);
		
		if(designDepartmentIds != null && designDepartmentIds.size() > 0){
			query.alias("designerPO", "designer");
			query.alias("designer.dept", "designerDept");
			query.add(Restrictions.in("designerDept.did", designDepartmentIds));
		}
		
		if(statuses != null && statuses.size() > 0){
			query.add(Restrictions.in("status", statuses));
		}
		
		queryFilterExcute(query, filters);
		
		query.desc("autoId");

		return query.list();
	}
	
	@Override
	public List<DecorationOrderPO> pageDecorationOrderForGeneral(Paging paging, List<Filter> filters){
		
		PagingQuery<DecorationOrderPO> query = pagingQuery(paging, DecorationOrderPO.class);
		
		List<String> nostatus = Arrays.asList(DecorationOrderPO.STATUS_TERMINATION_STR, DecorationOrderPO.STATUS_WASTE_STR);
		
		query.add(Restrictions.not(Restrictions.in("status", nostatus)));
		
		queryFilterExcute(query, filters);
		query.desc("autoId");
		
		return query.list(); 
	}
	
	@Override
	public List<DecorationOrderPO> pageDecorationOrderForDesign(Paging paging, List<Filter> filters, List<Integer> designDepartmentIds, List<String> statuses) {
		
		PagingQuery<DecorationOrderPO> query = pagingQuery(paging, DecorationOrderPO.class);
		
		if(designDepartmentIds != null && designDepartmentIds.size() > 0){
			query.alias("designerPO", "designer");
			query.alias("designer.dept", "designerDept");
			query.add(Restrictions.in("designerDept.did", designDepartmentIds));
		}
		
		if(statuses != null && statuses.size() > 0){
			query.add(Restrictions.in("status", statuses));
		}
		
		queryFilterExcute(query, filters);
		
		query.desc("autoId");
		
		return query.list();
	}

	@Override
	public List<DecorationOrderPO> pageDecorationOrderForSalesman(Paging paging, List<Filter> filters, List<Integer> salesmanDepartmentIds, List<String> statuses) {
		
		PagingQuery<DecorationOrderPO> query = pagingQuery(paging, DecorationOrderPO.class);
		
		if(salesmanDepartmentIds != null && salesmanDepartmentIds.size() > 0){
			query.alias("salesmanPO", "salesman");
			query.alias("salesman.dept", "salesmanDept");
			query.add(Restrictions.in("salesmanDept.did", salesmanDepartmentIds));
		}
		
		if(statuses != null && statuses.size() > 0){
			query.add(Restrictions.in("status", statuses));
		}
		
		queryFilterExcute(query, filters);
		
		query.desc("autoId");
		
		return query.list();
	}

	@Override
	public List<DecorationOrderPO> pageDecorationOrderForMaterial(Paging paging, List<Filter> filters){
		PagingQuery<DecorationOrderPO> query = pagingQuery(paging, DecorationOrderPO.class);
		
		queryFilterExcute(query, filters);
		
		query.add(Restrictions.not(Restrictions.in("status", Arrays.asList(new String[]{DecorationOrderPO.STATUS_TERMINATION_STR, DecorationOrderPO.STATUS_WASTE_STR}))));
		
		query.desc("autoId");

		return query.list();
	}

	@Override
	public List<DecorationOrderPO> pageDecorationOrderForPutline(Paging paging, List<Filter> filters){
		PagingQuery<DecorationOrderPO> query = pagingQuery(paging, DecorationOrderPO.class);
		
		query.alias("putlineConstructionSchedules", "putlineConstructionSchedule");
		
		queryFilterExcute(query, filters);
		
		query.add(Restrictions.in("status", Arrays.asList(new String[]{DecorationOrderPO.STATUS_SIGNED_STR, DecorationOrderPO.STATUS_COMPLETED_STR})));
		query.add(Restrictions.eq("putlineConstructionSchedule.putlineStatus", 1));
		
		query.desc("autoId");
		
		return query.list();
	}
	
	@Override
	public List<DecorationOrderPO> pageDecorationOrderByOrderIds(Paging paging, List<Filter> filters, List<String> orderIds){
		
		PagingQuery<DecorationOrderPO> query  = pagingQuery(paging, DecorationOrderPO.class);
		
		query.add(Restrictions.in("orderId", orderIds));
		query.desc("autoId");
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<DecorationOrderPO> queryDecorationOrder(List<Filter> filters){
		
		PagingQuery<DecorationOrderPO> query = pagingQuery(new Paging(), DecorationOrderPO.class);
		
		queryFilterExcute(query, filters);
		query.notPaging();
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationOrderPO> queryDecorationOrderByCustomerId(int customerId){
		return session().createCriteria(DecorationOrderPO.class).createAlias("customerPO", "customer").add(Restrictions.eq("customer.id", customerId)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationOrderPO> queryDecorationOrderForBackVisit(List<Filter> filters){
		PagingQuery<DecorationOrderPO> query = pagingQuery(new Paging(), DecorationOrderPO.class);
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_WASTE_STR, DecorationOrderPO.STATUS_COMPLETED_STR, DecorationOrderPO.STATUS_TERMINATION_STR});
		
		Criteria criteria = session().createCriteria(DecorationOrderPO.class)
				.add(Restrictions.not(Restrictions.in("status", status)));

		if(filters != null){
			for(Filter filter: filters){
				if("status".equals(filter.getField())){
					criteria.add(query.getCriterion("status", filter.getData(), filter.getOp()));
				}else if("createTime".equals(filter.getField())){
					Timestamp timestamp = new Timestamp(Long.parseLong(filter.getData()));
					criteria.add(query.getCriterion("createTime", timestamp, filter.getOp()));
				}
			}
		}
		
		criteria.addOrder(Order.desc("autoId"));
		
		return criteria.list();
	}
	
	@Override
	public List<DecorationOrderPO> queryDecorationOrderByOrderIds(List<Filter> filters, List<String> orderIds){
		
		PagingQuery<DecorationOrderPO> query  = pagingQuery(new Paging(), DecorationOrderPO.class);
		
		query.add(Restrictions.in("orderId", orderIds));
		
		queryFilterExcute(query, filters);
		
		query.desc("autoId");
		query.notPaging();
		
		return query.list();
	}
	
	@Override
	public DecorationOrderPO queryDecorationOrderByOrderId(String OrderId){
		return (DecorationOrderPO)session().createCriteria(DecorationOrderPO.class).add(Restrictions.eq("orderId", OrderId)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public DecorationOrderPO queryDecorationOrderByCustomer(Integer customerAutoId){
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_WASTE_STR, DecorationOrderPO.STATUS_COMPLETED_STR, DecorationOrderPO.STATUS_TERMINATION_STR});
		 
		List<DecorationOrderPO> decorationOrderPOs = session().createCriteria(DecorationOrderPO.class)
				 .createAlias("customerPO", "customer")
				 .add(Restrictions.eq("customer.id", customerAutoId))
				 .add(Restrictions.not(Restrictions.in("status", status)))
				 .addOrder(Order.desc("autoId"))
				 .list();
		 
		 if(decorationOrderPOs != null && decorationOrderPOs.size() > 0){
			 return decorationOrderPOs.get(0);
		 }else{
			 return null;
		 }
	}
	
	@Override
	public DecorationOrderPO queryDecorationOrderByVillageIdAHouseNumber(String villageId, String hoseNumber){
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_WASTE_STR, DecorationOrderPO.STATUS_COMPLETED_STR, DecorationOrderPO.STATUS_TERMINATION_STR});
		
		return (DecorationOrderPO)session().createCriteria(DecorationOrderPO.class)
				.add(Restrictions.eq("villagePO.villageId", villageId))
				.add(Restrictions.eq("houseNumber", hoseNumber))
				.add(Restrictions.not(Restrictions.in("status", status)))
				.uniqueResult();
	}
	
	@Override
	public double countDecorationOrderForTotalPrice(List<Filter> filters) {
		
		PagingQuery<DecorationOrderPO> query  = pagingQuery(new Paging(), DecorationOrderPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.sumForField("orderTotalPrice");
	}

	@Override
	public void refreshDecorationOrder(DecorationOrderPO decorationOrderPO){
		session().refresh(decorationOrderPO);
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
					
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.startsWith("design")){
					query.alias("designerPO", "designer");
					
					if(field.contains("Department")){
						query.alias("designer.dept", "designerDept");
					}
					
					if(field.contains("Region")){
						query.alias("designer.dept", "designerDept");
						query.alias("designerDept.fatherDept", "designerRegion");
				}
				}else if((field.startsWith("business") || field.startsWith("salesman"))){
					
					query.alias("salesmanPO", "salesman");
					
					if(field.contains("Department")){
						query.alias("salesman.dept", "salesmanDept");
					}
					
					if(field.contains("Region")){
						query.alias("salesman.dept", "salesmanDept");
						query.alias("salesmanDept.fatherDept", "salesmanRegion");
					}
				}else if(field.startsWith("village")){
					query.alias("villagePO", "village");
				}else if(field.startsWith("customer")){
					query.alias("customerPO", "customer");
				}
				
				if("orderId".equals(field)){
					query.add(query.getCriterion("orderId", data, op));
				}else if("customerId".equals(field)){
					query.add(query.getCriterion("customer.customerId", data, op));
				}else if("customerPhone".equals(field)){
					query.add(query.getCriterion("customer.phone", data, op));
				}else if("houseNumber".equals(field)){
					query.add(query.getCriterion("houseNumber", data, op));
				}else if("houseClass".equals(field)){
					query.add(query.getCriterion("houseClass", data, op));
				}else if("status".equals(field)){
					query.add(query.getCriterion("status", data, op));
				}else if("statuses".equals(field)){
					query.add(query.getCriterion("status", filter.getRange(), op));
				}else if("otherStatus".equals(field)){
					query.add(query.getCriterion("otherStatus", data, "and"));
				}else if("designerId".equals(field)){
					query.add(query.getCriterion("designer.userId", data, op));
				}else if("salesmanId".equals(field)){
					query.add(query.getCriterion("salesman.userId", data, op));
				}else if("villageId".equals(field)){
					query.add(query.getCriterion("village.villageId", data, op));
				}else if("designerDepartmentId".equals(field)){
					query.add(query.getCriterion("designerDept.deptId", data, op));
				}else if("salesmanDepartmentId".equals(field)){
					query.add(query.getCriterion("salesmanDept.deptId", data, op));
				}else if("designer".equals(field)){
					query.add(query.getCriterion("designer.currentName", data, op));
				}else if("salesman".equals(field)){
					query.add(query.getCriterion("salesman.currentName", data, op));
				}else if("supervisor".equals(field)){
					query.alias("orderSupervisorPO", "supervisor");
					query.add(query.getCriterion("supervisor.currentName", data, op));
				}else if("village".equals(field)){ 
					query.add(query.getCriterion("village.villageName", data, op));
				}else if("company".equals(field)){
					query.add(query.getCriterion("company", Integer.valueOf(data), op));
				}else if("salesmanDepartment".equals(field)){
					query.add(query.getCriterion("salesmanDept.deptName", data, op));
				}else if("designerDepartment".equals(field)){
					query.add(query.getCriterion("designerDept.deptName", data, op));
				}else if("designerRegionId".equals(field)){
					query.add(query.getCriterion("designerRegion.deptId", data, op));
				}else if("salesmanRegionId".equals(field)){
					query.add(query.getCriterion("salesmanRegion.deptId", data, op));
				}else if("houseArea".equals(field)){
					Float dataF = Float.parseFloat(data);
					query.add(query.getCriterion("houseArea", dataF, op));
				}else if("signTimeDateRange".equals(field)){
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion("contractTime", eTimestamp, "le"));
					query.add(query.getCriterion("contractTime", sTimestamp, "ge"));
				}else if("createTimeDateRange".equals(field)){
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
					
					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
					
					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
					
					query.add(query.getCriterion("createTime", eTimestamp, "le"));
					query.add(query.getCriterion("createTime", sTimestamp, "ge"));
				}else if("putlineTimeDateRange".equals(field)){
					String sTime = data.split("-")[0].replaceAll("/", "-");
					String eTime = data.split("-")[1].replaceAll("/", "-");
					
					query.add(query.getCriterion("putlineConstructionSchedule.putlineTime", eTime, "le"));
					query.add(query.getCriterion("putlineConstructionSchedule.putlineTime", sTime, "ge"));
		        }
			}
		}
	}
	
}
