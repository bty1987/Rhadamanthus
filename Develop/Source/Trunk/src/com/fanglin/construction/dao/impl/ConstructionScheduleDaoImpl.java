/**
 * @File Name		: ConstructionScheduleDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("constructionScheduleDao")
public class ConstructionScheduleDaoImpl extends DaoImpl<ConstructionSchedulePO> implements ConstructionScheduleDao {

	public ConstructionScheduleDaoImpl(){
		super(ConstructionSchedulePO.class);
	}

	@Override
	public List<ConstructionSchedulePO> pageConstructionSchedule(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<ConstructionSchedulePO> query = pagingQuery(paging, ConstructionSchedulePO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<ConstructionSchedulePO> pageConstructionScheduleForSupervision(Paging paging, List<FilterVO> filters){
		PagingQuery<ConstructionSchedulePO> query = pagingQuery(paging, ConstructionSchedulePO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				
				String field = filter.getField();
				String op = filter.getOp();
				String data = filter.getData();
				
				if(ConstructionSchedulePO.COLUMN_SCHEDULE_STR.equals(field)){
					query.add(Restrictions.eq(field, Integer.valueOf(data)));
				}else if(ConstructionSchedulePO.COLUMN_SUPERVISORQUALITYID_STR.equals(field)){
					query.add(Restrictions.eq(field, data));
				}else if(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR.equals(field)){
					
					if("and".equals(op)){
						query.add(Restrictions.sqlRestriction(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE));
					}else if("nand".equals(op)){
						query.add(Restrictions.not(Restrictions.sqlRestriction(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE)));
					}
				}
			}
		}
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<ConstructionSchedulePO> pageConstructionScheduleForSupervisionByUserId(Paging paging, List<FilterVO> filters, String workTypeQuality, String userId){
		
		PagingQuery<ConstructionSchedulePO> query = pagingQuery(paging, ConstructionSchedulePO.class);
		
		if(workTypeQuality == ""){
			return new ArrayList<ConstructionSchedulePO>();
		}
		
		query.add(Restrictions.eq(workTypeQuality, userId));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<ConstructionSchedulePO> pageConstructionScheduleForQuality(Paging paging, List<FilterVO> filters, List<Integer> schedules){
		
		if(schedules.size() == 0){
			return new ArrayList<ConstructionSchedulePO>();
		}
		
		List<String> qualityUserIds = Arrays.asList(new String[]{ConstructionSchedulePO.COLUMN_CHANQUALITYID_STR, ConstructionSchedulePO.COLUMN_PUTLINEQUALITYID_STR, 
				ConstructionSchedulePO.COLUMN_WATERWAYCIRCUITQUALITYID_STR, ConstructionSchedulePO.COLUMN_BRICKLAYQUALITYID_STR, 
				ConstructionSchedulePO.COLUMN_CARPENTQUALITYID_STR, ConstructionSchedulePO.COLUMN_OILQUALITYID_STR,
				ConstructionSchedulePO.COLUMN_CLEANINGQUALITYID_STR});
		
		Criterion criterion = null;
		PagingQuery<ConstructionSchedulePO> query = pagingQuery(paging, ConstructionSchedulePO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				
				boolean flag = false;
				
				String field = filter.getField();
				Object data = filter.getData();
				String op = filter.getOp();
				
				if(ConstructionSchedulePO.COLUMN_CHANSTATUS_STR.equals(field)){
					data = Integer.valueOf(filter.getData());
					
					flag = true;
				}else if(qualityUserIds.contains(field)){
					flag = true;
				}else if(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR.equals(field)){
					
					if("and".equals(op)){
						query.add(Restrictions.sqlRestriction(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE));
					}else if("nand".equals(op)){
						query.add(Restrictions.not(Restrictions.sqlRestriction(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE)));
					}
				}
				
				if(flag){
					if(filter.getLogic() != null && "or".equals(filter.getLogic())){
						if(criterion == null){
							criterion = Restrictions.eq(filter.getField(), data);
						}else{
							criterion = Restrictions.or(criterion, Restrictions.eq(filter.getField(), data));
						}
					}else{
						if(criterion == null){
							criterion = Restrictions.eq(filter.getField(), data);
						}else{
							criterion = Restrictions.and(criterion, Restrictions.eq(filter.getField(), data));
						}
					}
				}
			}
		}
		
		if(criterion != null){
			query.add(Restrictions.and(criterion, Restrictions.in(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedules)));
		}else{
			query.add(Restrictions.in(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, schedules));
		}
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<ConstructionSchedulePO> pageConstructionScheduleForAcceptance(Paging paging, List<FilterVO> filters){
		
		PagingQuery<ConstructionSchedulePO> query = pagingQuery(paging, ConstructionSchedulePO.class);
		query.add(query.getCriterion(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, ConstructionSchedulePO.SCHEDULE_TYPE_CLEANING_INT, "eq"));
		
		if(filters != null){
			
			for(FilterVO filter: filters){
				String field = filter.getField();
				Object data = filter.getData();
				String op = filter.getOp();
				
				if(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR.equals(field)){
					
					if("and".equals(op)){
						query.add(Restrictions.sqlRestriction(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE));
					}else if("nand".equals(op)){
						query.add(Restrictions.not(Restrictions.sqlRestriction(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE)));
					}
				}
			}
		}
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
//	@Override
//	public List<ConstructionSchedulePO> queryConstructionSchedule(List<FilterVO> filters){
//		
//		PagingQuery<ConstructionSchedulePO> query = pagingQuery(new Paging(), ConstructionSchedulePO.class);
//		
//		if(filters != null){
//			for(FilterVO filter: filters){
//				if(ConstructionSchedulePO.COLUMN_SCHEDULE_STR.equals(filter.getField())){
//					query.add(Restrictions.eq(filter.getField(), Integer.valueOf(filter.getData())));
//				}else if(ConstructionSchedulePO.COLUMN_SUPERVISORQUALITYID_STR.equals(filter.getField())){
//					query.add(Restrictions.eq(filter.getField(), filter.getData()));
//				}
//			}
//		}
//		
//		queryFilterExcute(query, filters);
//		
//		query.notPaging();
//		
//		return query.list();
//	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionSchedulePO> queryConstructionScheduleForSupervisionByUserId(List<FilterVO> filters, String supervisionUserId){
		
		Criteria query = session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_SUPERVISORQUALITYID_STR, supervisionUserId));
		
		if(filters != null){
			for(FilterVO filter: filters){
				if(ConstructionSchedulePO.COLUMN_SCHEDULE_STR.equals(filter.getField())){
					query.add(Restrictions.eq(filter.getField(), filter.getData()));
				}
			}
		}
		
		return query.list();
	}

	@Override
	public ConstructionSchedulePO queryConstructionScheduleByOrderId(String orderId){
		return (ConstructionSchedulePO) session().createCriteria(ConstructionSchedulePO.class).add(Restrictions.eq(ConstructionSchedulePO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		query.alias("decorationOrderPO", "decorationOrderPO");
		
		if(filters != null){
			for(FilterVO filter: filters){
					
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.startsWith("design")){
					query.alias("decorationOrderPO.designerPO", "designer");
				}else if((field.startsWith("business") || field.startsWith("salesman"))){
					query.alias("decorationOrderPO.salesmanPO", "salesman");
				}else if(field.startsWith("village")){
					query.alias("decorationOrderPO.villagePO", "village");
				}
				
				if("orderId".equals(field)){
					query.add(query.getCriterion("decorationOrderPO.orderId", data, op));
				}else if("houseNumber".equals(field)){
					query.add(query.getCriterion("decorationOrderPO.houseNumber", data, op));
				}else if("designerId".equals(field)){
					query.add(query.getCriterion("designer.userId", data, op));
				}else if("salesmanId".equals(field)){
					query.add(query.getCriterion("salesman.userId", data, op));
				}else if("villageId".equals(field)){
					query.add(query.getCriterion("village.villageId", data, op));
				}else if("designer".equals(field)){
					query.add(query.getCriterion("designer.currentName", data, op));
				}else if("salesman".equals(field)){
					query.add(query.getCriterion("salesman.currentName", data, op));
				}else if("supervisor".equals(field)){
					query.alias("decorationOrderPO.orderSupervisorPO", "supervisor");
					query.add(query.getCriterion("supervisor.currentName", data, op));
				}else if("village".equals(field)){ 
					query.add(query.getCriterion("village.villageName", data, op));
				}else if("projectStatus".equals(field) && !"other".equals(data)){
					if("未完工".equals(data)){
						query.add(query.getCriterion("decorationOrderPO.projectStatus", "已完工", "ne"));
					}else{
						query.add(query.getCriterion("decorationOrderPO.projectStatus", "已完工", "eq"));
					}
					
				}else if("villageSeat".equals(field)){
					
					double x = Double.parseDouble(data.split(":")[0]);
					double y =  Double.parseDouble(data.split(":")[1]);
					
					double seatRang = SystemConfig.getDouble("seatRang");
					
					query.add(Restrictions.between("village.x", (x - seatRang), (x + seatRang)));
					query.add(Restrictions.between("village.y", (y - seatRang), (y + seatRang)));
				}
			}
		}
	}
	
}
